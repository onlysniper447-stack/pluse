'use client'

import { useEffect, useState } from 'react'
import { threatLogs, shortAddr } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const START_BLOCK = 48_213_907

export function StatusTicker() {
  const [block, setBlock] = useState(START_BLOCK)

  useEffect(() => {
    const id = setInterval(() => setBlock((b) => b + 1), 450)
    return () => clearInterval(id)
  }, [])

  const items = [...threatLogs, ...threatLogs]

  return (
    <div className="border-b border-border bg-surface/60">
      <div className="mx-auto flex h-8 max-w-[1600px] items-center gap-4 overflow-hidden px-4 font-mono text-[11px] lg:px-6">
        <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
          <span>
            BLOCK <span className="text-foreground tabular-nums">#{block.toLocaleString('en-US')}</span>
          </span>
          <span className="hidden sm:inline">
            GAS <span className="text-foreground">0.0004 SOMI</span>
          </span>
          <span className="hidden text-emerald md:inline">FINALITY 412ms</span>
        </div>
        <div className="relative flex-1 overflow-hidden" aria-hidden>
          <div className="animate-ticker flex w-max gap-10 whitespace-nowrap">
            {items.map((t, i) => (
              <span key={`${t.id}-${i}`} className="flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    t.severity === 'critical' && 'bg-crimson',
                    t.severity === 'warn' && 'bg-amber',
                    t.severity === 'info' && 'bg-emerald',
                  )}
                />
                <span className="text-foreground/70">{shortAddr(t.contract)}</span>
                <span className="uppercase tracking-wider">{t.vector}</span>
                <span className="text-foreground/50">— {t.message}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
