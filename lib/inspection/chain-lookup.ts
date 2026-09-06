import { createPublicClient, http, isAddress, type Address } from 'viem'
import { somnia } from '@/lib/web3/somnia'

export interface ChainLookup {
  address: Address
  code: string
  balanceWei: string
  error?: string
}

function normalizeAddress(input: string): Address | null {
  const trimmed = input.trim()
  if (!isAddress(trimmed, { strict: false })) return null
  return (`0x${trimmed.slice(2).toLowerCase()}`) as Address
}

const direct = createPublicClient({
  chain: somnia,
  transport: http(somnia.rpcUrls.default.http[0], { timeout: 8_000 }),
})

async function lookupDirect(address: Address): Promise<ChainLookup> {
  const [code, balance] = await Promise.all([
    direct.getCode({ address }),
    direct.getBalance({ address }),
  ])
  return { address, code: code ?? '0x', balanceWei: balance.toString() }
}

export async function lookupChain(input: string): Promise<ChainLookup | { error: string; address?: Address }> {
  const address = normalizeAddress(input)
  if (!address) return { error: 'invalid address' }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      const data = (await res.json()) as { code?: string; balance?: string; error?: string }
      if (res.ok && data.code !== undefined && data.balance !== undefined) {
        return { address, code: data.code, balanceWei: data.balance }
      }
    } catch {
      /* fall through to direct RPC */
    }
  }

  try {
    return await lookupDirect(address)
  } catch (err) {
    return { address, error: err instanceof Error ? err.message : 'eth_getCode failed' }
  }
}

export { normalizeAddress }
