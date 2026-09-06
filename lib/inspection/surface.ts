import { toFunctionSelector } from 'viem'

/** Oracle / settlement ABI surface used by prediction-market contracts. */
export const ORACLE_SETTLEMENT_SIGNATURES = [
  'resolve()',
  'resolve(uint256)',
  'settle()',
  'settle(bool)',
  'settle(uint8)',
  'latestRoundData()',
  'getPrice()',
  'getPriceUnsafe(bytes32)',
  'oracle()',
  'resolutionTime()',
  'resolvesAt()',
  'disputeWindow()',
  'expiry()',
] as const

export const ORACLE_SETTLEMENT_SELECTORS = ORACLE_SETTLEMENT_SIGNATURES.map((sig) =>
  toFunctionSelector(sig).slice(2).toLowerCase(),
)

export const ORACLE_SETTLEMENT_KEYWORDS = [
  'resolve(',
  'settle(',
  'latestrounddata',
  'oracle',
  'resolutiontime',
  'resolvesat',
  'disputewindow',
  'expiry',
  'pyth',
  'chainlink',
  'optimistic oracle',
  'uma ',
] as const

export const ERC20_SELECTORS = [
  toFunctionSelector('transfer(address,uint256)').slice(2),
  toFunctionSelector('transferFrom(address,address,uint256)').slice(2),
  toFunctionSelector('approve(address,uint256)').slice(2),
  toFunctionSelector('balanceOf(address)').slice(2),
  toFunctionSelector('totalSupply()').slice(2),
  toFunctionSelector('allowance(address,address)').slice(2),
].map((s) => s.toLowerCase())

export const ERC721_SELECTORS = [
  toFunctionSelector('ownerOf(uint256)').slice(2),
  toFunctionSelector('safeTransferFrom(address,address,uint256)').slice(2),
  toFunctionSelector('tokenURI(uint256)').slice(2),
  '80ac58cd', // ERC-721 interface id often embedded
].map((s) => s.toLowerCase())

export const TOKEN_PRIVILEGE_SELECTORS = {
  mint: [
    toFunctionSelector('mint(address,uint256)').slice(2),
    toFunctionSelector('mint(address)').slice(2),
  ],
  burn: [toFunctionSelector('burn(uint256)').slice(2), toFunctionSelector('burn(address,uint256)').slice(2)],
  pause: [toFunctionSelector('pause()').slice(2), toFunctionSelector('unpause()').slice(2)],
  blacklist: [
    toFunctionSelector('blacklist(address)').slice(2),
    toFunctionSelector('addBlackList(address)').slice(2),
    toFunctionSelector('setBlacklist(address,bool)').slice(2),
  ],
  fee: [
    toFunctionSelector('setFee(uint256)').slice(2),
    toFunctionSelector('setTax(uint256)').slice(2),
    toFunctionSelector('setFees(uint256,uint256)').slice(2),
  ],
} as const

export function normalizeBytecode(code: string | undefined | null): string {
  if (!code) return ''
  const hex = code.toLowerCase()
  return hex.startsWith('0x') ? hex.slice(2) : hex
}

export function isEmptyBytecode(code: string | undefined | null): boolean {
  const hex = normalizeBytecode(code)
  return hex.length === 0 || hex === '0' || hex === '00'
}

export function countSelectors(bytecode: string, selectors: string[]): number {
  const hay = normalizeBytecode(bytecode)
  return selectors.filter((sel) => hay.includes(sel.replace(/^0x/, '').toLowerCase())).length
}

export function bytecodeHasAny(bytecode: string, selectors: string[]): boolean {
  return countSelectors(bytecode, selectors) > 0
}

export function asciiFromBytecode(bytecode: string): string {
  const hex = normalizeBytecode(bytecode)
  const chars: string[] = []
  for (let i = 0; i + 1 < hex.length; i += 2) {
    const n = Number.parseInt(hex.slice(i, i + 2), 16)
    if (n >= 32 && n < 127) chars.push(String.fromCharCode(n))
    else chars.push(' ')
  }
  return chars.join('').toLowerCase()
}

export function sourceHasOracleSettlement(source: string): boolean {
  const text = source.toLowerCase()
  return ORACLE_SETTLEMENT_KEYWORDS.some((k) => text.includes(k))
}

export function bytecodeHasOracleSettlement(bytecode: string): boolean {
  if (bytecodeHasAny(bytecode, ORACLE_SETTLEMENT_SELECTORS)) return true
  return sourceHasOracleSettlement(asciiFromBytecode(bytecode))
}
