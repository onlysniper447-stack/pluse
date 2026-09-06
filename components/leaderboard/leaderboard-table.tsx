'use client'

import { useState } from 'react'
import { Bot, User, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { leaderboard, shortAddr, auditBadges } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { SecurityRating } from './security-rating'

type Filter = 'all' | 'human' | 'agent'

export function LeaderboardTable() {
  const [filter, setFilter] = useState<Filter>('all')
  const rows = leaderboard.filter((r) => (filter === 'all' ? true : filter === 'agent' ? r.isAgent : !r.isAgent))

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0A0C10]">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-white">Trust rankings</p>
        <Tabs
          value={filter}
          onValueChange={(next) => {
            if (next === 'all' || next === 'human' || next === 'agent') setFilter(next)
          }}
        >
          <TabsList className="h-8 bg-slate-950/60">
            <TabsTrigger value="all" className="px-3 text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="human" className="px-3 text-xs">
              Engineers
            </TabsTrigger>
            <TabsTrigger value="agent" className="px-3 text-xs">
              Agents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Rank #</TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Developer / Agent Address
            </TableHead>
            <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Audited Contracts
            </TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Security Rating
            </TableHead>
            <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Verified Attributes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.address} className="border-slate-800/80 hover:bg-slate-800/30">
              <TableCell className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-mono text-sm font-semibold tabular-nums text-white',
                      r.rank > 3 && 'text-slate-300',
                    )}
                  >
                    {String(r.rank).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center text-[11px] tabular-nums',
                      r.trend > 0 ? 'text-emerald-400' : r.trend < 0 ? 'text-red-400' : 'text-slate-600',
                    )}
                  >
                    {r.trend > 0 ? (
                      <TrendingUp className="size-3" />
                    ) : r.trend < 0 ? (
                      <TrendingDown className="size-3" />
                    ) : (
                      <Minus className="size-3" />
                    )}
                    {r.trend !== 0 ? Math.abs(r.trend) : null}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-normal">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full border',
                      r.isAgent
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-800 text-slate-300',
                    )}
                  >
                    {r.isAgent ? <Bot className="size-4" /> : <User className="size-4" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-white">
                        {r.handle ?? shortAddr(r.address, 6)}
                      </span>
                      {r.isAgent ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-400">
                          AI AGENT
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">{shortAddr(r.address, 6)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-right text-sm font-bold tabular-nums text-white">
                {r.marketsCreated.toLocaleString('en-US')}
              </TableCell>
              <TableCell className="px-4 py-4">
                <SecurityRating value={r.passRate} />
              </TableCell>
              <TableCell className="px-4 py-4 whitespace-normal">
                <div className="flex flex-wrap gap-1.5">
                  {auditBadges(r).map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
                    >
                      {b.toUpperCase()}
                    </span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
