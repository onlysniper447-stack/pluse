'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Cpu, LineChart, X, ChevronRight } from 'lucide-react'
import { useI18n, locales, localeMeta, type Locale } from '@/lib/i18n'
import { useShell } from './shell-context'
import { cn } from '@/lib/utils'

const guides = [
  { href: '/library/how-to-audit', key: 'guide.audit' },
  { href: '/library/risk-scores', key: 'guide.scores' },
  { href: '/library/safe-rules', key: 'guide.rules' },
]
const services = [
  { href: '/library/code-review', key: 'svc.review' },
  { href: '/library/watchdog', key: 'svc.watch' },
  { href: '/docs', key: 'svc.api' },
]
const insights = [
  { href: '/library/blocked-threats', key: 'ins.threats' },
  { href: '/library/price-alerts', key: 'ins.feeds' },
]

function Section({
  icon: Icon,
  title,
  items,
  onNavigate,
}: {
  icon: typeof BookOpen
  title: string
  items: { href: string; key: string }[]
  onNavigate: () => void
}) {
  const { t } = useI18n()
  const pathname = usePathname()
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="size-3.5 text-emerald" />
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm tracking-tight transition-colors hover:bg-emerald/10 hover:text-emerald',
                  active ? 'bg-emerald/10 text-emerald' : 'text-foreground/90',
                )}
              >
                {t(item.key)}
                <ChevronRight className="size-3.5 shrink-0 opacity-50" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useShell()
  const { t, locale, setLocale } = useI18n()

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [sidebarOpen, closeSidebar])

  return (
    <motion.div
      key="sidebar"
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/55" onClick={closeSidebar} />
      <motion.aside
        role="dialog"
        aria-label={t('shell.menu')}
        initial={{ x: -360, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -360, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="relative flex h-full w-full max-w-sm flex-col border-r border-slate-800 bg-[#0A0C10]"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <p className="text-sm font-semibold tracking-tight">{t('shell.menu')}</p>
          <button
            type="button"
            onClick={closeSidebar}
            className="flex size-8 items-center justify-center rounded-md border border-slate-800 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="terminal-scroll flex-1 space-y-6 overflow-y-auto p-4">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t('shell.language')}
            </p>
            <label className="sr-only" htmlFor="locale-select">
              {t('shell.language')}
            </label>
            <select
              id="locale-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="h-10 w-full rounded-md border border-slate-800 bg-slate-900/60 px-3 text-sm text-foreground outline-none focus:border-emerald/50"
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeMeta[l].pill} — {localeMeta[l].label}
                </option>
              ))}
            </select>
          </div>

          <Section icon={BookOpen} title={t('shell.guides')} items={guides} onNavigate={closeSidebar} />
          <Section icon={Cpu} title={t('shell.services')} items={services} onNavigate={closeSidebar} />
          <Section icon={LineChart} title={t('shell.insights')} items={insights} onNavigate={closeSidebar} />
        </div>
      </motion.aside>
    </motion.div>
  )
}
