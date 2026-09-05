import type { Grade } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const tone: Record<Grade, string> = {
  'A+': 'border-emerald/60 bg-emerald/15 text-emerald shadow-glow-emerald',
  A: 'border-emerald/40 bg-emerald/10 text-emerald',
  B: 'border-low/40 bg-low/10 text-low',
  C: 'border-amber/40 bg-amber/10 text-amber',
  F: 'border-crimson/50 bg-crimson/15 text-crimson',
}

export function GradeBadge({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'lg' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md border font-mono font-bold',
        size === 'sm' ? 'h-7 min-w-9 px-1.5 text-xs' : 'size-14 text-2xl',
        tone[grade],
      )}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  )
}
