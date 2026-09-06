'use client'

import { horizons, type Horizon } from '@/lib/dashboard-data'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TimeHorizon({ value, onChange }: { value: Horizon; onChange: (h: Horizon) => void }) {
  return (
    <div
      className="sticky z-30 -mx-4 border-y border-border/80 bg-background/90 px-4 py-2 backdrop-blur-md lg:-mx-6 lg:px-6"
      style={{ top: '5.75rem' }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-3">
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          Time window
        </span>
        <Tabs
          value={value}
          onValueChange={(next) => {
            if (typeof next === 'string') onChange(next as Horizon)
          }}
          className="min-w-0 flex-1"
        >
          <TabsList variant="line" className="h-8 w-full justify-start overflow-x-auto bg-transparent p-0">
            {horizons.map((h) => (
              <TabsTrigger key={h.id} value={h.id} className="shrink-0 font-mono text-[11px] tracking-tight">
                {h.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
