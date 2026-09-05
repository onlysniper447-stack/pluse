'use client'

import { motion } from 'framer-motion'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { formatUsd, riskLabel, riskShort, type MarketCategory, type RiskLevel } from '@/lib/mock-data'
import { rankedContracts, sectors, severities, type Horizon } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

const cellTone: Record<RiskLevel, string> = {
  safe: 'bg-emerald/80 hover:bg-emerald',
  low: 'bg-low/70 hover:bg-low',
  medium: 'bg-amber/80 hover:bg-amber',
  high: 'bg-high/80 hover:bg-high',
  critical: 'bg-crimson hover:bg-crimson',
}

export type CellFilter = { category: MarketCategory; risk: RiskLevel } | null

export function RiskHeatmap({
  horizon,
  filter,
  onFilter,
}: {
  horizon: Horizon
  filter: CellFilter
  onFilter: (f: CellFilter) => void
}) {
  const rows = rankedContracts(horizon)

  return (
    <Panel>
      <PanelHeader
        eyebrow="Heatmap"
        title="Pools by sector and risk"
        action={
          filter ? (
            <button
              type="button"
              onClick={() => onFilter(null)}
              className="font-mono text-[10px] uppercase tracking-wider text-emerald hover:underline"
            >
              Clear filter · {filter.category} / {riskShort[filter.risk]}
            </button>
          ) : (
            <span className="text-[11px] text-muted-foreground">Click a cell to filter the table</span>
          )
        }
      />
      <div className="overflow-x-auto p-4">
        <div className="min-w-[520px] grid grid-cols-[88px_repeat(5,1fr)] gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span />
          {severities.map((l) => (
            <span key={l} className="text-center">
              {riskShort[l]}
            </span>
          ))}
          {sectors.map((cat) => (
            <div key={cat} className="contents">
              <span className="flex items-center text-foreground">{cat}</span>
              {severities.map((lvl) => {
                const cells = rows.filter((c) => c.category === cat && c.risk === lvl)
                const tvl = cells.reduce((s, c) => s + c.tvlWindow, 0)
                const selected = filter?.category === cat && filter?.risk === lvl
                return (
                  <motion.button
                    type="button"
                    key={`${cat}-${lvl}`}
                    whileHover={cells.length ? { scale: 1.03 } : undefined}
                    onClick={() => {
                      if (!cells.length) return
                      onFilter(selected ? null : { category: cat, risk: lvl })
                    }}
                    disabled={!cells.length}
                    data-cell={`${cat}-${lvl}`}
                    aria-pressed={selected}
                    aria-label={`${cat} ${riskLabel[lvl]}: ${cells.length} pools, ${formatUsd(tvl)} locked`}
                    className={cn(
                      'flex h-16 flex-col items-center justify-center rounded-md border border-background/30 transition-transform',
                      cells.length ? cellTone[lvl] : 'bg-muted/25',
                      selected && 'ring-2 ring-emerald ring-offset-2 ring-offset-background',
                    )}
                  >
                    {cells.length > 0 && (
                      <>
                        <span className="font-mono text-base font-bold tabular-nums text-background">{cells.length}</span>
                        <span className="text-[9px] text-background/85">{formatUsd(tvl)}</span>
                      </>
                    )}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Each cell: number of active pools · total money locked (USD)
        </p>
      </div>
    </Panel>
  )
}
