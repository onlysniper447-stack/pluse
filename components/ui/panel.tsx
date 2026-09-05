import { cn } from '@/lib/utils'

export function Panel({ className, children, interactive = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-[#121620]/60 backdrop-blur-md border border-slate-800/80 transition-all',
        interactive && 'hover:border-emerald-500/40 hover:scale-[1.01] transition-transform',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: string
  eyebrow?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-slate-800/80 px-4 py-3', className)}>
      <div className="flex flex-col gap-0.5">
        {eyebrow && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</span>
        )}
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  )
}

type Tone = 'cyan' | 'emerald' | 'amber' | 'crimson' | 'muted' | 'high' | 'low'

const toneClass: Record<Tone, string> = {
  cyan: 'border-low/40 bg-low/10 text-low',
  low: 'border-low/40 bg-low/10 text-low',
  emerald: 'border-emerald/40 bg-emerald/10 text-emerald',
  amber: 'border-amber/40 bg-amber/10 text-amber',
  high: 'border-high/40 bg-high/10 text-high',
  crimson: 'border-crimson/40 bg-crimson/10 text-crimson',
  muted: 'border-slate-800 bg-muted/40 text-muted-foreground',
}

export function Tag({
  tone = 'muted',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-sm border px-1.5 font-mono text-[10px] font-medium uppercase tracking-wider',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
