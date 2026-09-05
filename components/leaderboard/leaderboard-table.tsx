'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, User, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { leaderboard, shortAddr, auditBadges } from '@/lib/mock-data'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { GradeBadge } from './grade-badge'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'human' | 'agent'

export function LeaderboardTable() {
  const [filter, setFilter] = useState<Filter>('all')
  const rows = leaderboard.filter((r) => (filter === 'all' ? true : filter === 'agent' ? r.isAgent : !r.isAgent))

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        eyebrow="HackenProof-style rankings · epoch 42"
        title="Developer & agent trust table"
        action={
          <div className="flex items-center gap-1">
            {(
              [
                ['all', 'All'],
                ['human', 'Developers'],
                ['agent', 'Agents'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={cn(
                  'h-6 rounded-sm px-2 font-mono text-[10px] uppercase tracking-wider transition-colors',
                  filter === k ? 'bg-emerald/15 text-emerald' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">
                Rank #
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Developer / Agent Address
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                Audited Contracts
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Pass Rate %
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Audit Badges
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                Overall Grade
              </th>
            </tr>
          </thead>
          <motion.tbody key={filter} variants={staggerContainer} initial="hidden" animate="show">
            {rows.map((r) => (
              <motion.tr
                key={r.address}
                variants={fadeUp}
                className="group border-b border-slate-800/60 transition-transform last:border-0 hover:bg-accent hover:scale-[1.01]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-mono text-base font-bold tabular-nums',
                        r.rank === 1 ? 'text-emerald text-glow-emerald' : r.rank <= 3 ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {String(r.rank).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'flex items-center font-mono text-[10px] tabular-nums',
                        r.trend > 0 ? 'text-emerald' : r.trend < 0 ? 'text-crimson' : 'text-muted-foreground',
                      )}
                    >
                      {r.trend > 0 ? (
                        <TrendingUp className="size-3" />
                      ) : r.trend < 0 ? (
                        <TrendingDown className="size-3" />
                      ) : (
                        <Minus className="size-3" />
                      )}
                      {r.trend !== 0 && Math.abs(r.trend)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-md border',
                        r.isAgent ? 'border-emerald/40 bg-emerald/10 text-emerald' : 'border-slate-800 bg-muted/40 text-muted-foreground',
                      )}
                    >
                      {r.isAgent ? <Bot className="size-4" /> : <User className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium tracking-tight text-foreground">
                          {r.handle ?? shortAddr(r.address, 6)}
                        </span>
                        {r.isAgent && <Tag tone="emerald">Agent</Tag>}
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">{shortAddr(r.address, 6)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">{r.marketsCreated}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          r.passRate >= 90 ? 'bg-emerald' : r.passRate >= 75 ? 'bg-low' : r.passRate >= 60 ? 'bg-amber' : 'bg-crimson',
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${r.passRate}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums text-foreground">{r.passRate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {auditBadges(r).map((b) => (
                      <Tag key={b} tone="emerald">
                        <Award className="size-3" /> {b}
                      </Tag>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <GradeBadge grade={r.grade} />
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
