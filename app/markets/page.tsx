import type { Metadata } from 'next'
import { MarketsView } from '@/components/markets/markets-view'

export const metadata: Metadata = {
  title: 'DreamDEX Markets — PLUSE',
  description: 'DreamDEX event contracts on Somnia, scored and inspected by PLUSE.',
}

export default function MarketsPage() {
  return <MarketsView />
}
