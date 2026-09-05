'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { contracts, formatUsd, shortAddr, riskLabel } from '@/lib/mock-data'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

const toneFor = (risk: (typeof contracts)[number]['risk']) =>
  risk === 'safe' ? 'emerald' : risk === 'low' ? 'low' : risk === 'medium' ? 'amber' : risk === 'high' ? 'high' : 'crimson'

export function RecentScans({ onSelect }: { onSelect: (address: string) => void }) {
  const recent = [...contracts].sort((a, b) => b.volume24h - a.volume24h).slice(0, 6)

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader eyebrow="Recently indexed" title="High-volume contracts" />
      <motion.ul variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col divide-y divide-border">
        {recent.map((c) => (
          <motion.li key={c.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onSelect(c.address)}
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-transform hover:bg-accent hover:scale-[1.01]"
            >
              <span
                className={cn(
                  'font-mono text-sm font-bold tabular-nums',
                  c.score >= 80 ? 'text-emerald' : c.score >= 50 ? 'text-amber' : 'text-crimson',
                )}
              >
                {c.score}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{c.title}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {shortAddr(c.address)} · {c.category} · TVL {formatUsd(c.tvl)}
                </p>
              </div>
              <Tag tone={toneFor(c.risk)}>{riskLabel[c.risk]}</Tag>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </Panel>
  )
}
