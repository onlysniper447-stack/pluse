import { cn } from '@/lib/utils'

export function NetworkBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-400',
        className,
      )}
      title="Somnia Shannon Testnet — PLUSE is not live on mainnet"
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
      </span>
      Somnia Testnet
    </span>
  )
}
