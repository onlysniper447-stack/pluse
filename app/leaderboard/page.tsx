import type { Metadata } from 'next'
import { DeveloperBanner } from '@/components/leaderboard/developer-banner'
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { PageHeader } from '@/components/shell/page-header'

export const metadata: Metadata = {
  title: 'Security Leaderboard — PLUSE',
  description: 'Developer and agent trust rankings by clean audit pass rate across DreamDEX event contracts.',
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Leaderboard" description="Who builds the safest markets — ranked by clean inspections." />
      <DeveloperBanner />
      <LeaderboardTable />
    </div>
  )
}
