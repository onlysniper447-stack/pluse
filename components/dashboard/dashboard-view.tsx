'use client'

import { useState } from 'react'
import { TimeHorizon } from './time-horizon'
import { MetricGrid } from './metric-grid'
import { RiskHeatmap, type CellFilter } from './risk-heatmap'
import { SafetyRankings } from './safety-rankings'
import { PageHeader } from '@/components/shell/page-header'
import type { Horizon } from '@/lib/dashboard-data'

export function DashboardView() {
  const [horizon, setHorizon] = useState<Horizon>('24h')
  const [cell, setCell] = useState<CellFilter>(null)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Risk Dashboard"
        description="DreamDEX event contracts on Somnia Shannon Testnet, grouped by sector and inspection score."
      />
      <TimeHorizon value={horizon} onChange={setHorizon} />
      <MetricGrid horizon={horizon} />
      <RiskHeatmap horizon={horizon} filter={cell} onFilter={setCell} />
      <SafetyRankings horizon={horizon} cell={cell} />
    </div>
  )
}
