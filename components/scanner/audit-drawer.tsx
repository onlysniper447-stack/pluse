'use client'

import { ShieldCheck, AlertTriangle, Cpu, Activity, Database, Braces, Flame, Ban, Coins, Circle } from 'lucide-react'
import { Tag } from '@/components/ui/panel'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { categoriesFor, type FindingCategory, type ScanResult } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const icons: Record<FindingCategory, typeof Database> = {
  oracle: Database,
  resolution: Braces,
  reentrancy: Activity,
  admin: Cpu,
  mint: Coins,
  tax: Flame,
  blacklist: Ban,
  honeypot: Ban,
}

interface Props {
  result: ScanResult | null
  open: boolean
  onClose: () => void
}

export function AuditDrawer({ result, open, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetDescription className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Detailed audit
          </SheetDescription>
          <SheetTitle>Vulnerability breakdown</SheetTitle>
          {result ? (
            <p className="font-mono text-xs text-muted-foreground">
              Score {result.score == null ? 'N/A' : `${result.score}/100`} · {result.tag}
            </p>
          ) : null}
        </SheetHeader>
        {result ? (
          <ScrollArea className="min-h-0 flex-1">
            <ul className="flex flex-col gap-4 p-5">
              {categoriesFor(result).map((cat) => {
                const Icon = icons[cat.id]
                const score = result.vectors[cat.id as keyof typeof result.vectors]
                const skipped = score == null || result.skipped?.includes(cat.id)
                const items = result.findings.filter((f) => f.category === cat.id)
                return (
                  <li key={cat.id} className="rounded-lg border border-border/80 bg-card/60 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium tracking-tight text-foreground">{cat.title}</p>
                          <span
                            className={cn(
                              'font-mono text-sm font-bold tabular-nums',
                              skipped
                                ? 'text-slate-500'
                                : (score ?? 0) >= 80
                                  ? 'text-emerald'
                                  : (score ?? 0) >= 50
                                    ? 'text-amber'
                                    : 'text-crimson',
                            )}
                          >
                            {skipped ? 'N/A' : score}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{cat.blurb}</p>
                        {skipped ? (
                          <p className="mt-2 text-xs text-slate-500">Skipped — not applicable for this target.</p>
                        ) : (
                          <Progress value={score ?? 0} className="mt-2 flex flex-col gap-0" />
                        )}
                      </div>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {items.length === 0 && (
                        <li className="text-xs text-muted-foreground">No findings in this vector.</li>
                      )}
                      {items.map((f) => (
                        <li key={f.title} className="flex items-start gap-2 rounded-md border border-border/70 bg-background p-2.5">
                          {f.severity === 'pass' ? (
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald" />
                          ) : f.severity === 'skipped' ? (
                            <Circle className="mt-0.5 size-4 shrink-0 text-slate-500" />
                          ) : (
                            <AlertTriangle
                              className={cn(
                                'mt-0.5 size-4 shrink-0',
                                f.severity === 'critical' ? 'text-crimson' : 'text-amber',
                              )}
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-foreground">{f.title}</p>
                              <Tag
                                tone={
                                  f.severity === 'pass'
                                    ? 'emerald'
                                    : f.severity === 'critical'
                                      ? 'crimson'
                                      : f.severity === 'skipped'
                                        ? 'muted'
                                        : 'amber'
                                }
                              >
                                {f.severity === 'skipped' ? 'N/A' : f.severity}
                              </Tag>
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
