'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { contracts, formatUsd, shortAddr, riskLabel, type EventContract } from '@/lib/mock-data'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

type SortKey = 'tvl' | 'score' | 'volume24h'

const toneFor = (risk: EventContract['risk']) =>
  risk === 'safe' ? 'emerald' : risk === 'low' ? 'low' : risk === 'medium' ? 'amber' : risk === 'high' ? 'high' : 'crimson'

export function Watchlist() {
  const [sort, setSort] = useState<SortKey>('tvl')

  const rows = useMemo(
    () => [...contracts].sort((a, b) => b[sort] - a[sort]),
    [sort],
  )

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        eyebrow="Monitored set"
        title="Event contract watchlist"
        action={
          <div className="flex items-center gap-1">
            {(['tvl', 'score', 'volume24h'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSort(k)}
                className={cn(
                  'flex h-6 items-center gap-1 rounded-sm px-2 font-mono text-[10px] uppercase tracking-wider transition-colors',
                  sort === k ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <ArrowUpDown className="size-3" />
                {k === 'volume24h' ? 'Vol 24h' : k}
              </button>
            ))}
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Market</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 text-right font-medium">TVL</th>
              <th className="px-4 py-2.5 text-right font-medium">Vol 24h</th>
              <th className="px-4 py-2.5 font-medium">Oracle</th>
              <th className="px-4 py-2.5 text-right font-medium">Score</th>
            </tr>
          </thead>
          <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
            {rows.map((c) => (
              <motion.tr
                key={c.id}
                variants={fadeUp}
                className="border-b border-border/60 last:border-0 hover:bg-accent"
              >
                <td className="px-4 py-2.5">
                  <p className="text-xs font-medium text-foreground">{c.title}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{shortAddr(c.address, 5)}</p>
                </td>
                <td className="px-4 py-2.5">
                  <Tag tone="muted">{c.category}</Tag>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums">{formatUsd(c.tvl)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums">{formatUsd(c.volume24h)}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{c.oracle}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={cn(
                        'font-mono text-sm font-bold tabular-nums',
                        c.score >= 80 ? 'text-emerald' : c.score >= 50 ? 'text-amber' : 'text-crimson',
                      )}
                    >
                      {c.score}
                    </span>
                    <Tag tone={toneFor(c.risk)}>{riskLabel[c.risk]}</Tag>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </Panel>
  )
}
