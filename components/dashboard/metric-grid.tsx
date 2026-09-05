'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Layers, ShieldAlert, Activity } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { formatUsd } from '@/lib/mock-data'
import { windowKpis, type Horizon } from '@/lib/dashboard-data'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

function Sparkline({ values, tone }: { values: number[]; tone: string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 100}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={tone} strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function useCountUp(target: number, duration = 700) {
  const [n, setN] = useState(target)
  useEffect(() => {
    let current = n
    const start = performance.now()
    let raf = 0
    const from = current
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(from + (target - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return n
}

function MetricCard({
  label,
  raw,
  format,
  delta,
  icon: Icon,
  tone,
  goodWhenUp,
  suffix,
  spark,
  horizon,
}: {
  label: string
  raw: number
  format: (n: number) => string
  delta: number
  icon: typeof ShieldCheck
  tone: string
  goodWhenUp: boolean
  suffix?: string
  spark: number[]
  horizon: Horizon
}) {
  const n = useCountUp(raw)
  const up = delta >= 0
  const positive = up === goodWhenUp
  return (
    <motion.div variants={fadeUp}>
      <Panel interactive className="relative flex flex-col gap-3 overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F080]/70 to-transparent" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
          <Icon className="size-4" style={{ color: tone }} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">{format(n)}</span>
          {suffix && <span className="font-mono text-xs text-muted-foreground">{suffix}</span>}
        </div>
        <div className="flex items-end justify-between gap-3">
          <span
            className={cn(
              'flex items-center gap-0.5 font-mono text-xs tabular-nums',
              positive ? 'text-emerald' : 'text-crimson',
            )}
          >
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta).toFixed(1)}%
            <span className="ml-1 text-muted-foreground">{horizon}</span>
          </span>
          <div className="w-24">
            <Sparkline values={spark} tone={tone} />
          </div>
        </div>
      </Panel>
    </motion.div>
  )
}

export function MetricGrid({ horizon }: { horizon: Horizon }) {
  const k = windowKpis(horizon)
  return (
    <motion.div
      key={horizon}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MetricCard
        label="Money protected"
        raw={k.moneyProtected}
        format={(n) => formatUsd(n)}
        delta={k.deltas.money}
        icon={ShieldCheck}
        tone="var(--emerald)"
        goodWhenUp
        spark={k.spark}
        horizon={horizon}
      />
      <MetricCard
        label="Active pools"
        raw={k.pools}
        format={(n) => Math.round(n).toLocaleString('en-US')}
        delta={k.deltas.pools}
        icon={Layers}
        tone="var(--emerald)"
        goodWhenUp
        spark={k.spark}
        horizon={horizon}
      />
      <MetricCard
        label="Problems found"
        raw={k.problems}
        format={(n) => Math.round(n).toString()}
        delta={k.deltas.problems}
        icon={ShieldAlert}
        tone="var(--crimson)"
        goodWhenUp={false}
        spark={k.spark}
        horizon={horizon}
      />
      <MetricCard
        label="Safety score"
        raw={k.safety}
        format={(n) => n.toFixed(1)}
        delta={k.deltas.safety}
        icon={Activity}
        tone="var(--emerald)"
        goodWhenUp
        suffix="/ 100"
        spark={k.spark}
        horizon={horizon}
      />
    </motion.div>
  )
}
