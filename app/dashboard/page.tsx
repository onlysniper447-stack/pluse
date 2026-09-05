import type { Metadata } from 'next'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export const metadata: Metadata = {
  title: 'Risk Dashboard — PLUSE',
  description: 'See which Somnia pools look safe, and which do not, over 1 hour to 30 days.',
}

export default function DashboardPage() {
  return <DashboardView />
}
