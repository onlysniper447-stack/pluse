'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { isNavActive, navItems } from '@/lib/nav'
import { ConnectButton } from '@/components/web3/connect-button'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { BrandMark } from './brand-mark'
import { NetworkBadge } from './network-badge'
import { useShell } from './shell-context'
import { cn } from '@/lib/utils'

export function TopBar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useShell()
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0C10]/80 shadow-[0_1px_0_0_rgba(52,211,153,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-6">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <Button
            type="button"
            variant="outline"
            nativeButton
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            className="h-9 gap-2 border-emerald-400/30 bg-emerald-400/10 px-3 text-emerald-200 hover:border-emerald-400/60 hover:text-emerald-100"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="text-xs font-semibold tracking-wide md:hidden">Menu</span>
          </Button>
          <BrandMark />
        </div>

        <nav aria-label="Primary" className="hidden md:flex">
          <ul className="flex items-center">
            {navItems.map((item, index) => {
              const active = isNavActive(pathname, item.href)
              return (
                <li key={item.href} className="flex items-center">
                  {index > 0 && (
                    <span className="px-1.5 font-mono text-[11px] text-slate-600" aria-hidden>
                      |
                    </span>
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex h-10 items-center px-2.5 text-[13px] font-medium tracking-tight transition-all duration-200',
                      active
                        ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.85)]'
                        : 'text-slate-400 hover:text-emerald-300 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.55)]',
                    )}
                  >
                    {t(item.labelKey)}
                    {active && (
                      <span className="absolute inset-x-2.5 -bottom-px h-px bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <div className="hidden items-center gap-2 md:flex">
            <NetworkBadge />
            <ConnectButton />
          </div>
          <div className="md:hidden">
            <ConnectButton compact />
          </div>
        </div>
      </div>
    </header>
  )
}
