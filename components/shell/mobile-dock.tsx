'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavActive, navItems } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-[#0A0C10]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium tracking-tight transition-colors',
                  active ? 'text-emerald-400' : 'text-slate-500',
                )}
              >
                {active && (
                  <span className="absolute top-0 h-0.5 w-10 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                )}
                <item.icon className="size-5" />
                <span className="truncate text-[10px] tracking-tight">{item.short}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
