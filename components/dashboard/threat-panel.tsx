'use client'

import { motion } from 'framer-motion'
import { Braces, Database, Activity } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { threatBreakdown, threatLogs, shortAddr } from '@/lib/mock-data'
import { fadeUp, staggerContainer, easeOutExpo } from '@/lib/motion'
import { cn } from '@/lib/utils'

const icons = {
  'Resolution Logic': Braces,
  'Oracle Security': Database,
  'Liquidity Slippage': Activity,
} as const

export function ThreatPanel() {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader eyebrow="Adversarial threat panel" title="Vector breakdown · 30d" />

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col divide-y divide-border">
        {threatBreakdown.map((v) => {
          const Icon = icons[v.vector]
          const pct = (n: number) => (n / v.total) * 100
          return (
            <motion.div key={v.vector} variants={fadeUp} className="flex flex-col gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{v.vector}</span>
                <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">{v.total} findings</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{v.description}</p>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.span
                  className="bg-crimson"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct(v.critical)}%` }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                />
                <motion.span
                  className="bg-amber"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct(v.warn)}%` }}
                  transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
                />
                <motion.span
                  className="bg-emerald/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct(v.info)}%` }}
                  transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
                />
              </div>
              <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider">
                <span className="text-crimson">{v.critical} critical</span>
                <span className="text-amber">{v.warn} warn</span>
                <span className="text-emerald">{v.info} info</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="mt-auto border-t border-border">
        <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live feed</div>
        <ul className="terminal-scroll flex max-h-52 flex-col divide-y divide-border/60 overflow-y-auto">
          {threatLogs.map((t) => (
            <li key={t.id} className="flex items-start gap-2 px-4 py-2 text-xs">
              <span
                className={cn(
                  'mt-1.5 size-1.5 shrink-0 rounded-full',
                  t.severity === 'critical' && 'bg-crimson shadow-[0_0_6px_var(--crimson)]',
                  t.severity === 'warn' && 'bg-amber',
                  t.severity === 'info' && 'bg-emerald',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{t.ts.slice(11, 19)}</span>
                  <span className="font-mono text-[10px] text-foreground/70">{shortAddr(t.contract)}</span>
                  <Tag tone={t.severity === 'critical' ? 'crimson' : t.severity === 'warn' ? 'amber' : 'emerald'}>
                    {t.vector}
                  </Tag>
                </div>
                <p className="mt-0.5 leading-relaxed text-muted-foreground">{t.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
