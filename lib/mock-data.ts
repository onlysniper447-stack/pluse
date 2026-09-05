import contractsJson from '@/data/contracts.json'
import kpisJson from '@/data/kpis.json'
import leaderboardJson from '@/data/leaderboard.json'
import scanJson from '@/data/scan.json'
import threatsJson from '@/data/threats.json'

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical'
export type MarketCategory = 'Sports' | 'Crypto' | 'Macro' | 'Politics' | 'Culture'
export type ScoreTag = 'Pass' | 'Warning' | 'Adversarial Hazard'
export type Grade = 'A+' | 'A' | 'B' | 'C' | 'F'
export type FindingCategory = 'oracle' | 'resolution' | 'reentrancy' | 'admin'

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
  status: 'ok' | 'warn' | 'fail'
}

export type EntityTag = 'Pool Creator' | 'Public Pool' | 'Big Wallet'

export interface LiquidityHolder {
  address: `0x${string}`
  tag: EntityTag
  share: number
  usd: number
}

export interface ScanResult {
  score: number
  tag: ScoreTag
  vectors: { oracle: number; resolution: number; reentrancy: number; admin: number }
  oracleQuorum: 'PASSED' | 'WARNING'
  liquidityUsd: number
  liquidityDeployed: boolean
  holders: LiquidityHolder[]
  findings: {
    severity: 'pass' | 'warn' | 'critical'
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
]

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
  if (entry.grade === 'A+' || entry.passRate >= 98) badges.push('Oracle Verified')
  if (entry.passRate >= 95) badges.push('Zero Critical')
  if (entry.isAgent) badges.push('Agent')
  if (entry.rank <= 3) badges.push('Top Auditor')
  if (entry.marketsCreated >= 200) badges.push('High Volume')
  return badges
}
