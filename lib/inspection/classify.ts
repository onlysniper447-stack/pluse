import { type Address } from 'viem'
import { contracts } from '@/lib/mock-data'
import { lookupChain, normalizeAddress } from './chain-lookup'
import {
  TOKEN_PRIVILEGE_SELECTORS,
  bytecodeHasOracleSettlement,
  countSelectors,
  ERC20_SELECTORS,
  ERC721_SELECTORS,
  isEmptyBytecode,
  sourceHasOracleSettlement,
} from './surface'

export type TargetKind = 'eoa' | 'prediction-market' | 'erc20' | 'erc721' | 'generic' | 'source'

export interface ClassifiedTarget {
  kind: TargetKind
  input: string
  address?: Address
  bytecode?: string
  codeBytes: number
  balanceWei?: string
  hasOracleSettlement: boolean
  privileges: {
    mint: boolean
    burn: boolean
    pause: boolean
    blacklist: boolean
    fee: boolean
  }
  rpcError?: string
}

function privilegesFromBytecode(bytecode: string) {
  return {
    mint: bytecodeHasAnyList(bytecode, TOKEN_PRIVILEGE_SELECTORS.mint),
    burn: bytecodeHasAnyList(bytecode, TOKEN_PRIVILEGE_SELECTORS.burn),
    pause: bytecodeHasAnyList(bytecode, TOKEN_PRIVILEGE_SELECTORS.pause),
    blacklist: bytecodeHasAnyList(bytecode, TOKEN_PRIVILEGE_SELECTORS.blacklist),
    fee: bytecodeHasAnyList(bytecode, TOKEN_PRIVILEGE_SELECTORS.fee),
  }
}

function bytecodeHasAnyList(bytecode: string, selectors: readonly string[]) {
  return countSelectors(bytecode, [...selectors]) > 0
}

function kindFromBytecode(bytecode: string, hasOracleSettlement: boolean): TargetKind {
  if (hasOracleSettlement) return 'prediction-market'
  const erc20Hits = countSelectors(bytecode, ERC20_SELECTORS)
  const erc721Hits = countSelectors(bytecode, ERC721_SELECTORS)
  if (erc721Hits >= 2 && erc721Hits >= erc20Hits) return 'erc721'
  if (erc20Hits >= 3) return 'erc20'
  return 'generic'
}

export async function classifyTarget(input: string): Promise<ClassifiedTarget> {
  const trimmed = input.trim()
  const emptyPrivileges = { mint: false, burn: false, pause: false, blacklist: false, fee: false }
  const address = normalizeAddress(trimmed)

  if (!address) {
    const hasOracleSettlement = sourceHasOracleSettlement(trimmed)
    return {
      kind: hasOracleSettlement ? 'source' : sourceLooksLikeToken(trimmed) ? 'erc20' : 'source',
      input: trimmed,
      codeBytes: 0,
      hasOracleSettlement,
      privileges: {
        ...emptyPrivileges,
        mint: /function\s+mint\b/i.test(trimmed),
        burn: /function\s+burn\b/i.test(trimmed),
        pause: /pausable|function\s+pause\b/i.test(trimmed),
        blacklist: /blacklist/i.test(trimmed),
        fee: /setFee|setTax|txFee/i.test(trimmed),
      },
    }
  }

  const known = contracts.some((c) => c.address.toLowerCase() === address.toLowerCase())
  if (known) {
    return {
      kind: 'prediction-market',
      input: trimmed,
      address,
      codeBytes: 0,
      hasOracleSettlement: true,
      privileges: emptyPrivileges,
    }
  }

  const lookup = await lookupChain(address)
  if ('error' in lookup && !('code' in lookup)) {
    return {
      kind: 'eoa',
      input: trimmed,
      address,
      bytecode: '0x',
      codeBytes: 0,
      balanceWei: '0',
      hasOracleSettlement: false,
      privileges: emptyPrivileges,
      rpcError: lookup.error,
    }
  }

  const code = 'code' in lookup ? lookup.code : '0x'
  const balanceWei = 'balanceWei' in lookup ? lookup.balanceWei : '0'
  const rpcError = 'error' in lookup ? lookup.error : undefined

  if (rpcError && isEmptyBytecode(code)) {
    return {
      kind: 'eoa',
      input: trimmed,
      address,
      bytecode: '0x',
      codeBytes: 0,
      balanceWei,
      hasOracleSettlement: false,
      privileges: emptyPrivileges,
      rpcError,
    }
  }

  if (isEmptyBytecode(code)) {
    return {
      kind: 'eoa',
      input: trimmed,
      address,
      bytecode: '0x',
      codeBytes: 0,
      balanceWei,
      hasOracleSettlement: false,
      privileges: emptyPrivileges,
    }
  }

  const hasOracleSettlement = bytecodeHasOracleSettlement(code)
  const kind = kindFromBytecode(code, hasOracleSettlement)

  return {
    kind,
    input: trimmed,
    address,
    bytecode: code,
    codeBytes: Math.max(0, (code.length - 2) / 2),
    balanceWei,
    hasOracleSettlement,
    privileges: privilegesFromBytecode(code),
  }
}

function sourceLooksLikeToken(source: string): boolean {
  return /erc[- ]?20|erc[- ]?721|IERC20|IERC721|function\s+transfer\s*\(/i.test(source)
}
