'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatUsd, shortAddr, riskLabel } from '@/lib/mock-data'
import { isNew, rankedContracts, type Horizon } from '@/lib/dashboard-data'
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
          <Tabs
            value={tab}
            onValueChange={(next) => {
              if (next === 'safest' || next === 'risk' || next === 'new') setTab(next)
            }}
          >
            <TabsList className="h-7">
              {tabs.map((tb) => (
                <TabsTrigger key={tb.id} value={tb.id} className="px-2 font-mono text-[10px] uppercase">
                  {tb.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      <div className="overflow-x-auto">
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow className="text-[11px] text-muted-foreground hover:bg-transparent">
            <TableHead className="px-4">Rank · Contract</TableHead>
            <TableHead className="px-4">Safety score</TableHead>
            <TableHead className="px-4">Price verification</TableHead>
            <TableHead className="px-4">Money control risk</TableHead>
            <TableHead className="px-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c, i) => {
            const money =
              c.topShare > 50
                ? `CRITICAL: Top wallet holds ${c.topShare.toFixed(0)}%`
                : c.topShare > 30
                  ? `Caution: Top wallet holds ${c.topShare.toFixed(0)}%`
                  : `Safe: Top wallet holds ${c.topShare.toFixed(0)}%`
            return (
              <TableRow key={c.id}>
                <TableCell className="px-4 py-3 whitespace-normal">
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
                </TableCell>
                <TableCell className="px-4 py-3">
                  <ScoreBadge score={c.score} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Tag tone={c.feeds >= 2 ? 'emerald' : 'amber'}>{c.feedLabel}</Tag>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <p
                    className={cn(
                      'text-xs leading-relaxed whitespace-normal',
                      c.topShare > 50 ? 'text-crimson' : c.topShare > 30 ? 'text-amber' : 'text-emerald',
                    )}
                  >
                    {money}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button
                    nativeButton={false}
                    size="sm"
                    variant="outline"
                    render={<Link href={`/?target=${c.address}`} />}
                    className="border-primary/40 bg-primary/10 text-primary"
                  >
                    <ScanSearch className="size-3.5" />
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                No pools in this view for the selected time window.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </Panel>
  )
}
