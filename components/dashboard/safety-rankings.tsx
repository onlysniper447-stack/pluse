'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanSearch } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { formatUsd, shortAddr, riskLabel } from '@/lib/mock-data'
import { isNew, rankedContracts, type Horizon } from '@/lib/dashboard-data'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { CellFilter } from './risk-heatmap'

type Tab = 'safest' | 'risk' | 'new'

const tabs: { id: Tab; label: string }[] = [
  { id: 'safest', label: 'Top Safest Contracts' },
  { id: 'risk', label: 'High-Risk / At-Risk Pools' },
  { id: 'new', label: 'Newly Deployed' },
]

const RADIUS = 16
const CIRC = 2 * Math.PI * RADIUS

function ScoreBadge({ score }: { score: number }) {
  const stroke = score >= 80 ? 'var(--emerald)' : score >= 50 ? 'var(--amber)' : 'var(--crimson)'
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90" aria-hidden>
        <circle cx="20" cy="20" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - score / 100)}
        />
      </svg>
      <span
        className={cn(
          'font-mono text-sm font-bold tabular-nums',
          score >= 80 ? 'text-emerald' : score >= 50 ? 'text-amber' : 'text-crimson',
        )}
      >
        {score}
      </span>
    </span>
  )
}

export function SafetyRankings({ horizon, cell }: { horizon: Horizon; cell: CellFilter }) {
  const [tab, setTab] = useState<Tab>('safest')

  useEffect(() => {
    if (!cell) return
    if (cell.risk === 'high' || cell.risk === 'critical' || cell.risk === 'medium') setTab('risk')
    else setTab('safest')
  }, [cell])

  const all = rankedContracts(horizon)
  const scoped = cell ? all.filter((c) => c.category === cell.category && c.risk === cell.risk) : all

  const rows = [...scoped]
    .filter((c) => {
      if (tab === 'safest') return c.score >= 80
      if (tab === 'risk') return c.score < 80
      return isNew(c, horizon)
    })
    .sort((a, b) =>
      tab === 'safest'
        ? b.score - a.score
        : tab === 'risk'
          ? a.score - b.score
          : Date.parse(b.deployedAt) - Date.parse(a.deployedAt),
    )

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        eyebrow="Standings"
        title="Contract safety rankings"
        action={
          <div className="flex flex-wrap justify-end gap-1">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className={cn(
                  'h-7 rounded-md px-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                  tab === tb.id ? 'bg-emerald/15 text-emerald' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tb.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Rank · Contract</th>
              <th className="px-4 py-2.5 font-medium">Safety score</th>
              <th className="px-4 py-2.5 font-medium">Price verification</th>
              <th className="px-4 py-2.5 font-medium">Money control risk</th>
              <th className="px-4 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`${horizon}-${tab}-${cell?.category ?? 'all'}-${cell?.risk ?? 'all'}`}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {rows.map((c, i) => {
                const money =
                  c.topShare > 50
                    ? `CRITICAL: Top wallet holds ${c.topShare.toFixed(0)}%`
                    : c.topShare > 30
                      ? `Caution: Top wallet holds ${c.topShare.toFixed(0)}%`
                      : `Safe: Top wallet holds ${c.topShare.toFixed(0)}%`
                return (
                  <motion.tr
                    key={c.id}
                    variants={fadeUp}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-sm font-bold tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-medium tracking-tight text-foreground">{c.title}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{shortAddr(c.address, 6)}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {c.category} · {formatUsd(c.tvlWindow)} locked · {riskLabel[c.risk]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={c.score} />
                    </td>
                    <td className="px-4 py-3">
                      <Tag tone={c.feeds >= 2 ? 'emerald' : 'amber'}>{c.feedLabel}</Tag>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className={cn(
                          'text-xs leading-relaxed',
                          c.topShare > 50 ? 'text-crimson' : c.topShare > 30 ? 'text-amber' : 'text-emerald',
                        )}
                      >
                        {money}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/?target=${c.address}`}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2.5 text-[11px] font-medium text-emerald transition-transform hover:scale-[1.01]"
                      >
                        <ScanSearch className="size-3.5" />
                        Inspect Contract
                      </Link>
                    </td>
                  </motion.tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No pools in this view for the selected time window.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
    </Panel>
  )
}
