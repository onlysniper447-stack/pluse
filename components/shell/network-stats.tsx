'use client'

export function NetworkStats() {
  return (
    <div className="border-b border-slate-800 bg-[#0A0C10] text-slate-400">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-3 px-4 text-[11px] lg:px-6">
        <div className="flex min-w-0 items-center gap-3 overflow-hidden sm:gap-6">
          <span className="flex shrink-0 items-center gap-1.5 font-medium text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400" />
            SOMNIA TESTNET
          </span>
          <span className="hidden h-3 w-px bg-slate-800 sm:block" />
          <span className="hidden shrink-0 sm:inline">
            TESTNET TVL WATCHED:{' '}
            <span className="font-semibold text-slate-100">$14.2M</span>
          </span>
          <span className="hidden h-3 w-px bg-slate-800 md:block" />
          <span className="hidden truncate md:inline">
            CRITICAL EXPLOITS PREVENTED:{' '}
            <span className="font-semibold text-slate-100">19</span>
          </span>
        </div>
      </div>
    </div>
  )
}
