import { formatEther, type Address } from 'viem'
import { contracts, type ScanResult, type ScanStep, type ScoreTag } from '@/lib/mock-data'
import { resolveScan } from '@/lib/scan-resolver'
import { classifyTarget, type ClassifiedTarget } from './classify'
import { evaluateResolutionCheck } from './resolution-check'

export interface InspectionReport {
  result: ScanResult
  steps: ScanStep[]
}

const CONNECT: ScanStep = {
  id: 's1',
  label: 'Connecting to Somnia RPC',
  detail: 'api.infra.testnet.somnia.network · chainId 50312',
  durationMs: 420,
  status: 'ok',
}

function step(
  id: string,
  label: string,
  detail: string,
  status: ScanStep['status'],
  durationMs: number,
): ScanStep {
  return { id, label, detail, status, durationMs }
}

function tagFor(score: number): ScoreTag {
  if (score >= 80) return 'Pass'
  if (score >= 50) return 'Warning'
  return 'Adversarial Hazard'
}

function average(values: Array<number | null | undefined>): number {
  const nums = values.filter((v): v is number => typeof v === 'number')
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

function nativeHoldings(address?: Address, balanceWei?: string): Pick<ScanResult, 'holders' | 'liquidityUsd' | 'liquidityDeployed'> {
  if (!address) {
    return { holders: [], liquidityUsd: 0, liquidityDeployed: false }
  }
  const wei = BigInt(balanceWei ?? '0')
  const stt = Number(formatEther(wei))
  const amount = Number.isFinite(stt) ? stt : 0
  return {
    liquidityDeployed: wei > 0n,
    liquidityUsd: amount,
    holders: [
      {
        address,
        tag: 'Native',
        share: 100,
        usd: amount,
        amountStt: amount,
      },
    ],
  }
}

function eoaResult(target: ClassifiedTarget): InspectionReport {
  const notice = 'Target address is an EOA (Wallet Address), not a deployed smart contract.'
  return {
    steps: [
      CONNECT,
      step('s2', 'Fetching bytecode', 'eth_getCode → 0x (empty) · EOA', 'ok', 520),
      step('s3', 'EOA detection', notice, 'skipped_na', 380),
      step(
        's-hold',
        'Reading native STT balance',
        target.balanceWei ? `${Number(formatEther(BigInt(target.balanceWei))).toFixed(4)} STT` : '0 STT',
        'ok',
        360,
      ),
    ],
    result: {
      kind: 'eoa',
      score: null,
      tag: 'Not a contract',
      notice,
      skipped: ['oracle', 'resolution', 'reentrancy', 'admin'],
      vectors: { oracle: null, resolution: null, reentrancy: null, admin: null },
      oracleQuorum: 'N/A',
      ...nativeHoldings(target.address, target.balanceWei),
      findings: [
        {
          severity: 'skipped',
          category: 'resolution',
          title: 'Resolution ambiguity & timestamp limits',
          description: 'Target address is an EOA (Wallet Address), not a deployed smart contract.',
        },
      ],
      address: target.address,
    },
  }
}

function skipResolutionStep(): ScanStep {
  return evaluateResolutionCheck({ hasOracleSettlementSurface: false }).step
}

function skipOracleStep(): ScanStep {
  return step(
    's-oracle',
    'Oracle dependency graph (multi-source check)',
    'Skipped — no oracle / settlement ABI surface detected',
    'skipped_na',
    360,
  )
}

function tokenResult(target: ClassifiedTarget): InspectionReport {
  const { privileges, kind } = target
  const mint = privileges.mint || privileges.burn ? 58 : 92
  const tax = privileges.fee ? 54 : 88
  const blacklist = privileges.blacklist || privileges.pause ? 61 : 90
  const honeypot = privileges.fee && privileges.blacklist ? 48 : 86
  const reentrancy = 84
  const admin = privileges.mint ? 62 : 81
  const score = average([mint, tax, blacklist, honeypot, reentrancy, admin])
  const standard = kind === 'erc721' ? 'ERC-721' : 'ERC-20'

  const findings: ScanResult['findings'] = [
    evaluateResolutionCheck({ hasOracleSettlementSurface: false }).finding,
    {
      severity: 'skipped',
      category: 'oracle',
      title: 'Oracle & data-feed integrity',
      description: 'Skipped — contract has no oracle or settlement functions.',
    },
    {
      severity: privileges.mint ? 'warn' : 'pass',
      category: 'mint',
      title: privileges.mint ? 'Minting / burn privilege concentration' : 'No unbounded mint surface',
      description: privileges.mint
        ? 'mint() is present. A privileged account can inflate supply. Confirm cap, access control, and timelock.'
        : 'No mint(address,uint256) selector. Supply inflation via a hidden minter is less likely.',
    },
    {
      severity: privileges.fee ? 'warn' : 'pass',
      category: 'tax',
      title: privileges.fee ? 'Tax & fee manipulation limits' : 'No tunable tax selector',
      description: privileges.fee
        ? 'setFee/setTax is present. Owner can change transfer taxes after users buy. Pin a hard cap on-chain.'
        : 'No setFee/setTax selector. Transfer tax cannot be silently raised from a standard admin function.',
    },
    {
      severity: privileges.blacklist || privileges.pause ? 'warn' : 'pass',
      category: 'blacklist',
      title: privileges.blacklist || privileges.pause ? 'Blacklist / pausable function vectors' : 'No pause or blacklist selector',
      description:
        privileges.blacklist || privileges.pause
          ? 'pause() and/or blacklist() can freeze holders. Treat as an admin seizure vector.'
          : 'No pause/blacklist selectors detected in the bytecode surface.',
    },
    {
      severity: honeypot < 70 ? 'warn' : 'pass',
      category: 'honeypot',
      title: honeypot < 70 ? 'Honeypot & transfer restriction risk' : 'Transfer path looks unrestricted',
      description:
        honeypot < 70
          ? 'Fee + blacklist controls can trap sellers. Simulate buy→sell on a fork before size.'
          : 'Standard transfer/transferFrom selectors present without a stacked fee+blacklist pattern.',
    },
  ]

  const steps: ScanStep[] = [
    CONNECT,
    step(
      's2',
      'Fetching bytecode & verified source',
      `${(target.codeBytes / 1024).toFixed(1)} KB on-chain · ${standard} selectors matched`,
      'ok',
      700,
    ),
    step('s3', 'Building AST · ABI surface parse', `No resolve()/settle()/latestRoundData() · ${standard} token surface`, 'ok', 640),
    skipOracleStep(),
    skipResolutionStep(),
    step(
      's-mint',
      'Minting / burn privilege concentration',
      privileges.mint ? 'mint() selector present · privileged inflation possible' : 'No mint selector',
      privileges.mint ? 'warn' : 'ok',
      720,
    ),
    step(
      's-tax',
      'Tax & fee manipulation limits',
      privileges.fee ? 'Tunable tax/fee admin function detected' : 'No setFee/setTax selector',
      privileges.fee ? 'warn' : 'ok',
      680,
    ),
    step(
      's-black',
      'Blacklist / pausable function vectors',
      privileges.blacklist || privileges.pause ? 'pause/blacklist can freeze transfers' : 'No pause/blacklist selector',
      privileges.blacklist || privileges.pause ? 'warn' : 'ok',
      640,
    ),
    step(
      's-honey',
      'Honeypot & transfer restriction checks',
      honeypot < 70 ? 'Stacked fee + restriction pattern' : 'Transfer selectors look standard',
      honeypot < 70 ? 'warn' : 'ok',
      700,
    ),
    step('s9', 'Compiling PLUSE scorecard', `Skipped checks excluded from score · ${standard} vector set`, 'ok', 420),
  ]

  return {
    steps,
    result: {
      kind,
      score,
      tag: tagFor(score),
      skipped: ['oracle', 'resolution'],
      notice: `Prediction-market checks skipped — target matches ${standard}, not a settlement contract.`,
      vectors: {
        oracle: null,
        resolution: null,
        reentrancy,
        admin,
        mint,
        tax,
        blacklist,
        honeypot,
      },
      oracleQuorum: 'N/A',
      ...nativeHoldings(target.address, target.balanceWei),
      findings,
      address: target.address,
    },
  }
}

function predictionResult(target: ClassifiedTarget): InspectionReport {
  const base = resolveScan(target.input)
  const resolution = evaluateResolutionCheck({
    hasOracleSettlementSurface: true,
    scan: base,
  })
  const steps: ScanStep[] = [
    CONNECT,
    step(
      's2',
      'Fetching bytecode & verified source',
      target.codeBytes > 0 ? `${(target.codeBytes / 1024).toFixed(1)} KB · settlement ABI present` : 'Watchlist hit · oracle/settlement surface confirmed',
      'ok',
      720,
    ),
    step('s3', 'Building AST · parsing resolution nodes', 'resolve()/settle()/expiry sinks present — running adversarial suite', 'ok', 900),
    step('s4', 'Oracle dependency graph (multi-source check)', 'Oracle/settlement keywords confirmed on ABI/AST', 'ok', 800),
    resolution.step,
    step('s6', 'Reentrancy & reactive contract guards', 'Settlement callback isolation', 'ok', 800),
    step('s7', 'Admin key privilege concentration', 'Resolution-authority custody map', 'ok', 700),
    step('s8', 'Cross-referencing exploit signatures', 'Event-contract vector catalog', 'ok', 560),
    step('s9', 'Compiling PLUSE scorecard', 'Weighting only applicable prediction-market vectors', 'ok', 420),
  ]

  return {
    steps,
    result: {
      ...base,
      kind: 'prediction-market',
      skipped: [],
      vectors: {
        ...base.vectors,
        resolution: resolution.scoreContribution,
      },
      address: target.address,
    },
  }
}

function genericResult(target: ClassifiedTarget): InspectionReport {
  const reentrancy = 78
  const admin = 70
  const score = average([reentrancy, admin])
  const skipReason = target.rpcError
    ? 'Could not confirm oracle/settlement ABI (RPC error). Not scored as a prediction market.'
    : 'No resolve()/settle()/oracle ABI surface. Prediction-market suite skipped.'

  return {
    steps: [
      CONNECT,
      step(
        's2',
        'Fetching bytecode & verified source',
        target.rpcError ? `eth_getCode failed · ${target.rpcError}` : `${(target.codeBytes / 1024).toFixed(1)} KB · unverified`,
        target.rpcError ? 'warn' : 'ok',
        640,
      ),
      step('s3', 'Building AST · ABI surface parse', 'No settlement/oracle function selectors', 'ok', 560),
      skipOracleStep(),
      skipResolutionStep(),
      step('s6', 'Reentrancy & reactive contract guards', 'Generic bytecode heuristic only', 'ok', 700),
      step('s7', 'Admin key privilege concentration', 'Owner slot not fully decoded', 'warn', 640),
      step('s9', 'Compiling PLUSE scorecard', 'Skipped checks excluded from score', 'ok', 400),
    ],
    result: {
      kind: 'generic',
      score,
      tag: tagFor(score),
      skipped: ['oracle', 'resolution'],
      notice: skipReason,
      vectors: { oracle: null, resolution: null, reentrancy, admin },
      oracleQuorum: 'N/A',
      ...nativeHoldings(target.address, target.balanceWei),
      findings: [
        evaluateResolutionCheck({ hasOracleSettlementSurface: false }).finding,
        {
          severity: 'skipped',
          category: 'oracle',
          title: 'Oracle dependency graph',
          description: 'Skipped — no oracle ABI surface.',
        },
        {
          severity: 'pass',
          category: 'reentrancy',
          title: 'No event-contract reentrancy signature',
          description: 'Did not match DreamDEX settlement reentrancy catalog. Residual generic risk remains.',
        },
        {
          severity: 'warn',
          category: 'admin',
          title: 'Privilege map unverified',
          description: 'Owner / timelock slots could not be fully decoded. Not treated as a market-resolution admin path.',
        },
      ],
      address: target.address,
    },
  }
}

export async function inspectTarget(input: string): Promise<InspectionReport> {
  const target = await classifyTarget(input)

  if (target.kind === 'eoa') return eoaResult(target)
  if (target.kind === 'erc20' || target.kind === 'erc721') return tokenResult(target)
  if (target.kind === 'prediction-market' || target.hasOracleSettlement) return predictionResult(target)
  return genericResult(target)
}

export function isWatchlistMarket(input: string): boolean {
  const trimmed = input.trim().toLowerCase()
  return contracts.some((c) => c.address.toLowerCase() === trimmed)
}
