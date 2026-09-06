import type { Metadata } from 'next'
import { LeaderboardHero } from '@/components/leaderboard/leaderboard-hero'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'

export const metadata: Metadata = {
  title: 'Security Leaderboard — PLUSE',
  description: 'PLUSE inspection rankings for DreamDEX event-contract builders on Somnia Shannon Testnet.',
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col">
      <LeaderboardHero />
      <LeaderboardTable />
    </div>
  )
}
