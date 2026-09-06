'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { PanelLeft } from 'lucide-react'
import { navItems } from '@/lib/nav'
import { navIndicatorTransition } from '@/lib/motion'
import { ConnectButton } from '@/components/web3/connect-button'
import { useI18n, localeMeta } from '@/lib/i18n'
import { BrandMark } from './brand-mark'
import { useShell } from './shell-context'
import { cn } from '@/lib/utils'

export function TopBar() {
  const pathname = usePathname()
  const { toggleSidebar } = useShell()
  const { t, locale } = useI18n()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0A0C10]/88 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 text-[11px] font-medium tracking-tight text-foreground transition-transform hover:border-emerald/40 hover:scale-[1.01]"
          aria-label={t('shell.menu')}
        >
          <PanelLeft className="size-4" />
          <span className="font-mono">[=]</span>
        </button>

        <BrandMark />

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center md:flex">
          <ul className="relative flex items-center">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex h-10 items-center gap-1.5 px-3 text-[11px] font-medium tracking-tight transition-colors',
                      active ? 'text-emerald' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">{item.index}.</span>
                    {t(item.labelKey)}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={navIndicatorTransition}
                        className="absolute inset-x-3 -bottom-px h-px bg-emerald shadow-glow-emerald"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span
            title="Somnia Shannon Testnet — PLUSE is not live on mainnet"
            className="flex h-9 items-center rounded-full border border-amber/50 bg-amber/10 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-amber"
          >
            {t('shell.testnet')}
          </span>
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden h-9 items-center rounded-full border border-slate-800 bg-slate-900/60 px-2.5 font-mono text-[11px] text-emerald sm:flex"
            title={t('shell.language')}
          >
            {localeMeta[locale].pill}
          </button>
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
          <div className="sm:hidden">
            <ConnectButton compact />
          </div>
        </div>
      </div>
      <p className="border-t border-slate-800/60 px-4 py-1.5 text-center text-[12px] leading-snug text-muted-foreground sm:text-sm">
        {t('slogan')}
      </p>
    </header>
  )
}
