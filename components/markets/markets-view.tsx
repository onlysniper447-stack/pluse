'use client'

import Link from 'next/link'
import { ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { contracts, formatUsd, riskLabel, shortAddr } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const riskTone: Record<string, string> = {
  safe: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  low: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',
  medium: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  high: 'border-orange-500/20 bg-orange-500/10 text-orange-400',
  critical: 'border-red-500/20 bg-red-500/10 text-red-400',
}

export function MarketsView() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-white">DreamDEX Markets</h1>
        <p className="mt-2 max-w-2xl text-base text-slate-400">
          DreamDEX event contracts on Somnia Shannon Testnet, scored by PLUSE. Inspect opens the scanner with that address.
        </p>
        <p className="mt-6 border-t border-slate-800/60 pt-4 font-mono text-xs text-slate-500">
          {contracts.length} markets · chainId 50312 · STT
        </p>
      </section>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0A0C10]">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Market</TableHead>
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Category</TableHead>
              <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">TVL</TableHead>
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Safety</TableHead>
              <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <TableRow key={c.id} className="border-slate-800/80 hover:bg-slate-800/30">
                <TableCell className="px-4 py-4 whitespace-normal">
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-500">{shortAddr(c.address, 6)}</p>
                </TableCell>
                <TableCell className="px-4 py-4 text-sm text-slate-300">{c.category}</TableCell>
                <TableCell className="px-4 py-4 text-right font-semibold tabular-nums text-white">
                  {formatUsd(c.tvl)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                      riskTone[c.risk] ?? riskTone.medium,
                    )}
                  >
                    {c.score} · {riskLabel[c.risk]}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Button
                    nativeButton={false}
                    size="sm"
                    variant="outline"
                    render={<Link href={`/?target=${c.address}`} />}
                    className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  >
                    <ScanSearch className="size-3.5" />
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
