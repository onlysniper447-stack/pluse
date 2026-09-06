'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavActive, navItems } from '@/lib/nav'
import { useI18n } from '@/lib/i18n'
import { ConnectButton } from '@/components/web3/connect-button'
import { NetworkBadge } from './network-badge'
import { cn } from '@/lib/utils'

export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <div
      id="mobile-menu"
      className="border-t border-white/10 bg-[#0A0C10]/95 px-4 py-4 backdrop-blur-xl md:hidden"
    >
      <nav aria-label="Mobile menu">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition-all',
                    active
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_18px_-8px_rgba(52,211,153,0.9)]'
                      : 'border-transparent text-slate-300 hover:border-emerald-400/20 hover:bg-white/[0.04] hover:text-emerald-300',
                  )}
                >
                  <item.icon className="size-4" />
                  {t(item.labelKey)}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Network</p>
        <NetworkBadge />
        <p className="text-xs text-slate-500">Shannon · chainId 50312 · STT</p>
        <ConnectButton />
      </div>
    </div>
  )
}
