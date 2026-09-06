'use client'

import Link from 'next/link'

export function BrandMark() {
  return (
    <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="PLUSE home">
      <span className="relative flex size-8 items-center justify-center rounded-md border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_18px_-6px_rgba(52,211,153,0.8)]">
        <svg viewBox="0 0 24 24" className="size-4 text-emerald-400" fill="none" aria-hidden>
          <path
            d="M2 12h4l2-6 3 12 3-9 2 3h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-mono text-sm font-semibold tracking-[0.18em] text-white">[PLUSE]</span>
    </Link>
  )
}
