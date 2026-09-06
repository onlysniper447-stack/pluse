import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function Panel({
  className,
  children,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <Card
      className={cn(
        'gap-0 bg-[#0A0C10] py-0',
        interactive && 'transition-transform hover:scale-[1.01] hover:ring-primary/35',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
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
    <CardHeader className={cn('border-b px-4 py-3', className)}>
      {eyebrow ? (
        <CardDescription className="font-mono text-[10px] uppercase tracking-[0.18em]">
          {eyebrow}
        </CardDescription>
      ) : null}
      <CardTitle className="text-sm font-semibold tracking-tight">{title}</CardTitle>
      {action ? <CardAction>{action}</CardAction> : null}
    </CardHeader>
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
  muted: 'border-border bg-muted/40 text-muted-foreground',
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
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-sm font-mono text-[10px] font-medium uppercase tracking-wider',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </Badge>
  )
}
