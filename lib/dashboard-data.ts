import { contracts, kpis, type EventContract, type MarketCategory, type RiskLevel } from '@/lib/mock-data'

export type Horizon = '1h' | '24h' | '7d' | '30d'

export const horizons: { id: Horizon; label: string }[] = [
  { id: '1h', label: '1 HOUR' },
  { id: '24h', label: '24 HOURS' },
  { id: '7d', label: '7 DAYS' },
  { id: '30d', label: '30 DAYS' },
]

const scale: Record<Horizon, { tvl: number; count: number; exploits: number; safety: number; vol: number; delta: number }> = {
  '1h': { tvl: 0.82, count: 0.71, exploits: 0.38, safety: 0.975, vol: 0.22, delta: 0.4 },
  '24h': { tvl: 1, count: 1, exploits: 1, safety: 1, vol: 1, delta: 1 },
  '7d': { tvl: 1.14, count: 1.22, exploits: 1.85, safety: 1.012, vol: 4.1, delta: 1.6 },
  '30d': { tvl: 1.31, count: 1.45, exploits: 2.4, safety: 1.028, vol: 11.2, delta: 2.1 },
}

const sparks: Record<Horizon, number[]> = {
  '1h': [54, 56, 55, 58, 57, 60, 59, 61, 63, 62, 64, 66],
  '24h': [38, 42, 40, 47, 51, 49, 56, 61, 58, 66, 71, 74],
  '7d': [28, 31, 36, 34, 42, 48, 45, 53, 58, 62, 70, 76],
  '30d': [18, 22, 27, 33, 31, 40, 48, 52, 61, 68, 73, 81],
}

const deployedAt: Record<string, string> = {
  c1: '2026-01-12T00:00:00Z',
  c2: '2026-08-20T00:00:00Z',
  c3: '2026-03-02T00:00:00Z',
  c4: '2026-09-04T18:00:00Z',
  c5: '2026-06-11T00:00:00Z',
  c6: '2026-09-03T09:00:00Z',
  c7: '2026-02-14T00:00:00Z',
  c8: '2026-07-01T00:00:00Z',
  c9: '2026-04-18T00:00:00Z',
  c10: '2026-09-01T12:00:00Z',
  c11: '2026-08-28T00:00:00Z',
  c12: '2026-09-05T04:00:00Z',
}

function dualFeed(oracle: string) {
  return /dual|pyth\s*\/\s*chainlink|por|espn/i.test(oracle)
}

function topShare(c: EventContract) {
  if (c.score < 50) return 72.4
  if (c.score < 70) return 41.2
  if (c.score < 85) return 24.8
  return 18.1
}

export interface RankedContract extends EventContract {
  feeds: number
  feedLabel: string
  topShare: number
  deployedAt: string
  tvlWindow: number
  volumeWindow: number
}

export function windowKpis(h: Horizon) {
  const s = scale[h]
  return {
    moneyProtected: Math.round(kpis.totalValueProtected * s.tvl),
    pools: Math.round(kpis.activeContracts * s.count),
    problems: Math.max(1, Math.round(kpis.flaggedExploits * s.exploits)),
    safety: Math.min(99.9, +(kpis.safetyIndex * s.safety).toFixed(1)),
    deltas: {
      money: +(kpis.deltas.tvp * s.delta).toFixed(1),
      pools: +(kpis.deltas.contracts * s.delta).toFixed(1),
      problems: +(kpis.deltas.exploits * s.delta).toFixed(1),
      safety: +(kpis.deltas.safety * s.delta).toFixed(1),
    },
    spark: sparks[h],
  }
}

export function rankedContracts(h: Horizon): RankedContract[] {
  const s = scale[h]
  return contracts.map((c) => ({
    ...c,
    feeds: dualFeed(c.oracle) ? 2 : 1,
    feedLabel: dualFeed(c.oracle) ? '2 Trusted Feeds' : '1 Unverified Source',
    topShare: topShare(c),
    deployedAt: deployedAt[c.id] ?? '2026-06-01T00:00:00Z',
    tvlWindow: Math.round(c.tvl * s.tvl),
    volumeWindow: Math.round(c.volume24h * s.vol),
  }))
}

export function isNew(c: RankedContract, h: Horizon, now = Date.parse('2026-09-05T12:00:00Z')) {
  const age = now - Date.parse(c.deployedAt)
  const hours = h === '1h' ? 36 : h === '24h' ? 48 : h === '7d' ? 24 * 7 : 24 * 30
  return age <= hours * 3_600_000
}

export const sectors: MarketCategory[] = ['Sports', 'Crypto', 'Macro']
export const severities: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical']
