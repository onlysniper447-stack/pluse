import { createPublicClient, http, isAddress, type Address } from 'viem'
import { somnia } from '@/lib/web3/somnia'

export const runtime = 'nodejs'

const client = createPublicClient({
  chain: somnia,
  transport: http(somnia.rpcUrls.default.http[0], { timeout: 12_000 }),
})

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { address?: string }
    const raw = (body.address ?? '').trim()
    if (!isAddress(raw, { strict: false })) {
      return Response.json({ error: 'invalid address' }, { status: 400 })
    }
    const address = raw.toLowerCase() as Address
    const [code, balance] = await Promise.all([
      client.getCode({ address }),
      client.getBalance({ address }),
    ])
    return Response.json({
      address,
      code: code ?? '0x',
      balance: balance.toString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'chain lookup failed'
    return Response.json({ error: message }, { status: 502 })
  }
}
