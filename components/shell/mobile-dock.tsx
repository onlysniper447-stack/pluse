'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { PanelLeft } from 'lucide-react'
import { navItems } from '@/lib/nav'
import { navIndicatorTransition } from '@/lib/motion'
import { useShell } from './shell-context'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MobileDock() {
  const pathname = usePathname()
  const { toggleSidebar } = useShell()
  const { t } = useI18n()

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-[#0A0C10]/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-tight transition-colors',
                  active ? 'text-emerald' : 'text-muted-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    transition={navIndicatorTransition}
                    className="absolute top-0 h-0.5 w-10 rounded-full bg-emerald shadow-glow-emerald"
                  />
                )}
                <item.icon className="size-5" />
                <span className="font-mono text-[9px]">
                  {item.index}. {item.short}
                </span>
              </Link>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={toggleSidebar}
            className="relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
          >
            <PanelLeft className="size-5" />
            <span className="font-mono text-[9px]">{t('shell.menu')}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
