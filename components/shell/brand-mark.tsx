'use client'

import Link from 'next/link'

export function BrandMark() {
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="PLUSE home">
      <span className="relative flex size-8 items-center justify-center rounded-md border border-emerald/40 bg-emerald/10">
        <svg viewBox="0 0 24 24" className="size-4 text-emerald" fill="none" aria-hidden>
          <path
            d="M2 12h4l2-6 3 12 3-9 2 3h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-base font-semibold tracking-tight text-foreground">PLUSE</span>
        <span className="mt-1 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground lg:flex">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald animate-pulse-ring" />
            <span className="relative size-1.5 rounded-full bg-emerald shadow-glow-emerald" />
          </span>
          <span className="text-amber">●</span>
          SOMNIA TESTNET
        </span>
      </span>
    </Link>
  )
}
