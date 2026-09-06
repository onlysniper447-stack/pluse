import { cn } from '@/lib/utils'

export function SecurityRating({ value }: { value: number }) {
  const radius = 16
  const c = 2 * Math.PI * radius
  const arc = c * 0.75
  const filled = arc * Math.min(100, Math.max(0, value)) / 100
  const tone = value >= 90 ? 'text-emerald-400' : value >= 75 ? 'text-amber-400' : 'text-red-400'
  const stroke = value >= 90 ? '#34d399' : value >= 75 ? '#fbbf24' : '#f87171'

  return (
    <div className="flex items-center gap-3">
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="rgb(51 65 85 / 0.8)"
          strokeWidth="3.5"
          strokeDasharray={`${arc} ${c}`}
          strokeLinecap="round"
          transform="rotate(135 22 22)"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="3.5"
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          transform="rotate(135 22 22)"
        />
      </svg>
      <div>
        <p className={cn('text-sm font-semibold tabular-nums', tone)}>{value.toFixed(1)}%</p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Security rating</p>
      </div>
    </div>
  )
}
