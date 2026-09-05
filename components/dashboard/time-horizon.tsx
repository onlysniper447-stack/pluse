'use client'

import { motion } from 'framer-motion'
import { horizons, type Horizon } from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'

export function TimeHorizon({ value, onChange }: { value: Horizon; onChange: (h: Horizon) => void }) {
  return (
    <div className="sticky z-30 -mx-4 border-y border-slate-800/80 bg-[#0A0C10]/90 px-4 py-2 backdrop-blur-md lg:-mx-6 lg:px-6" style={{ top: '4.75rem' }}>
      <div className="mx-auto flex max-w-[1600px] items-center gap-3">
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          Time window
        </span>
        <div className="flex flex-1 gap-1 overflow-x-auto">
          {horizons.map((h) => {
            const active = value === h.id
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onChange(h.id)}
                className={cn(
                  'relative h-8 shrink-0 rounded-md px-3 font-mono text-[11px] tracking-tight transition-colors',
                  active ? 'text-emerald' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="horizon-pill"
                    className="absolute inset-0 rounded-md border border-emerald/50 bg-emerald/10"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{h.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
