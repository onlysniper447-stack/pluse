import contractsJson from '@/data/contracts.json'
import kpisJson from '@/data/kpis.json'
import leaderboardJson from '@/data/leaderboard.json'
import scanJson from '@/data/scan.json'
import threatsJson from '@/data/threats.json'

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'
export type MarketCategory = 'Sports' | 'Crypto' | 'Macro' | 'Politics' | 'Culture'
export type ScoreTag = 'Pass' | 'Warning' | 'Adversarial Hazard' | 'Not a contract'
export type Grade = 'A+' | 'A' | 'B' | 'C' | 'F'
export type FindingCategory =
  | 'oracle'
  | 'resolution'
  | 'reentrancy'
  | 'admin'
  | 'mint'
  | 'tax'
  | 'blacklist'
  | 'honeypot'
export type TargetKind = 'eoa' | 'prediction-market' | 'erc20' | 'erc721' | 'generic' | 'source'

export interface EventContract {
  id: string
  address: `0x${string}`
  title: string
  category: MarketCategory
  tvl: number
  oracle: string
  resolvesAt: string
  risk: RiskLevel
  score: number
  volume24h: number
}

export interface ThreatLog {
  id: string
  ts: string
  severity: 'info' | 'warn' | 'critical'
  vector: 'Resolution Logic' | 'Oracle Security' | 'Liquidity Slippage'
  contract: `0x${string}`
  message: string
}

export interface LeaderboardEntry {
  rank: number
  address: `0x${string}`
  handle?: string
  isAgent: boolean
  marketsCreated: number
  passRate: number
  grade: Grade
  tvpProtected: number
  trend: number
}

export interface SystemKpis {
  totalValueProtected: number
  activeContracts: number
  flaggedExploits: number
  safetyIndex: number
  deltas: { tvp: number; contracts: number; exploits: number; safety: number }
}

export interface ScanStep {
  id: string
  label: string
  detail?: string
  durationMs: number
  status: 'ok' | 'warn' | 'fail' | 'skipped' | 'skipped_na'
}

export type EntityTag = 'Pool Creator' | 'Public Pool' | 'Big Wallet' | 'Wallet' | 'Native'

export interface LiquidityHolder {
  address: `0x${string}`
  tag: EntityTag
  share: number
  usd: number
  amountStt?: number
}

export interface ScanVectors {
  oracle: number | null
  resolution: number | null
  reentrancy: number | null
  admin: number | null
  mint?: number | null
  tax?: number | null
  blacklist?: number | null
  honeypot?: number | null
}

export interface ScanResult {
  score: number | null
  tag: ScoreTag
  kind?: TargetKind
  skipped?: FindingCategory[]
  notice?: string
  address?: string
  vectors: ScanVectors
  oracleQuorum: 'PASSED' | 'WARNING' | 'N/A'
  liquidityUsd: number
  liquidityDeployed: boolean
  holders: LiquidityHolder[]
  findings: {
    severity: 'pass' | 'warn' | 'critical' | 'skipped'
    category: FindingCategory
    title: string
    description: string
  }[]
}

export const findingCategories: { id: FindingCategory; title: string; blurb: string }[] = [
  {
    id: 'oracle',
    title: 'Oracle & Data Feed Integrity',
    blurb: 'Multi-source check, deviation guards, and stale-price windows.',
  },
  {
    id: 'resolution',
    title: 'Resolution Ambiguity & Timestamp Limits',
    blurb: 'Settlement text, timezone pinning, and dispute windows.',
  },
  {
    id: 'reentrancy',
    title: 'Reentrancy & Reactive Contract Guards',
    blurb: 'CEI pattern, callback isolation, and settlement reentry.',
  },
  {
    id: 'admin',
    title: 'Admin Key Privilege Concentration',
    blurb: 'EOA admins, timelocks, and resolution-authority custody.',
  },
  {
    id: 'mint',
    title: 'Minting / Burn Privilege Concentration',
    blurb: 'Uncapped mint, hidden minters, and burn rights.',
  },
  {
    id: 'tax',
    title: 'Tax & Fee Manipulation Limits',
    blurb: 'Post-deployment fee changes that can trap holders.',
  },
  {
    id: 'blacklist',
    title: 'Blacklist / Pausable Function Vectors',
    blurb: 'Admin freeze, pause, and address-level transfer bans.',
  },
  {
    id: 'honeypot',
    title: 'Honeypot & Transfer Restriction Checks',
    blurb: 'Sell path, max-tx, and hidden transfer modifiers.',
  },
]

export function categoriesFor(result: ScanResult) {
  const skipped = new Set(result.skipped ?? [])
  const present = new Set(result.findings.map((f) => f.category))
  return findingCategories.filter((c) => {
    const vector = result.vectors[c.id as keyof ScanResult['vectors']]
    return present.has(c.id) || skipped.has(c.id) || vector != null
  })
}

export const kpis = kpisJson as SystemKpis
export const contracts = contractsJson as EventContract[]
export const threatLogs = threatsJson.logs as ThreatLog[]
export const threatBreakdown = threatsJson.breakdown
export const leaderboard = leaderboardJson.rankings as LeaderboardEntry[]
export const currentUser = {
  ...(leaderboardJson.currentUser as LeaderboardEntry & { badges: string[] }),
  percentile: 92,
}
export const scanScript = scanJson.script as ScanStep[]
export const sampleScanResult = scanJson.sampleResult as ScanResult
export const sampleContractInput = scanJson.sampleInput

export function formatUsd(n: number, compact = true): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(n)
}

export function shortAddr(addr: string, chars = 4): string {
  return `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}`
}

export const riskColor: Record<RiskLevel, string> = {
  safe: 'bg-emerald text-background',
  low: 'bg-low/80 text-background',
  medium: 'bg-amber text-background',
  high: 'bg-high text-background',
  critical: 'bg-crimson text-foreground',
}

export const riskLabel: Record<RiskLevel, string> = {
  safe: 'PASSED',
  low: 'LOW',
  medium: 'MEDIUM RISK',
  high: 'HIGH',
  critical: 'CRITICAL EXPLOIT',
}

export const riskShort: Record<RiskLevel, string> = {
  safe: 'PASSED',
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
}

export function auditBadges(entry: LeaderboardEntry): string[] {
  const badges: string[] = []
  if (entry.grade === 'A+' || entry.passRate >= 98) badges.push('Oracle Master')
  if (entry.passRate >= 95) badges.push('Zero Exploits')
  if (entry.rank <= 3) badges.push('Top Auditor')
  if (entry.marketsCreated >= 200) badges.push('High Volume')
  return badges
}
