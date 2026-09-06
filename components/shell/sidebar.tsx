'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, ChevronRight, Cpu, LineChart, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useShell } from './shell-context'
import { ConnectButton } from '@/components/web3/connect-button'
import { NetworkBadge } from './network-badge'
import { cn } from '@/lib/utils'

const services = [
  { href: '/library/code-review', key: 'svc.review' },
  { href: '/library/watchdog', key: 'svc.watch' },
  { href: '/docs', key: 'svc.api' },
]

const insights = [
  { href: '/library/blocked-threats', key: 'ins.threats' },
  { href: '/library/price-alerts', key: 'ins.feeds' },
]

const guides = [
  { href: '/library/how-to-audit', key: 'guide.audit' },
  { href: '/library/risk-scores', key: 'guide.scores' },
  { href: '/library/safe-rules', key: 'guide.rules' },
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
      <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        <Icon className="size-3.5 text-emerald-400" />
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
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm tracking-tight transition-colors',
                  active
                    ? 'bg-emerald-400/10 text-emerald-300'
                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-emerald-300',
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
  const { t } = useI18n()
  const pathname = usePathname()

  useEffect(() => {
    closeSidebar()
  }, [pathname, closeSidebar])

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

  if (!sidebarOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <button type="button" aria-label="Close menu" className="absolute inset-0 bg-transparent" onClick={closeSidebar} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('shell.menu')}
        className="relative flex h-full w-full max-w-sm flex-col border-r border-white/10 bg-[#0A0C10] shadow-[20px_0_60px_-24px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <p className="font-mono text-sm font-semibold tracking-[0.16em] text-white">[PLUSE]</p>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-md border border-white/10 text-slate-400 hover:border-emerald-400/40 hover:text-emerald-300"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <Section icon={Cpu} title={t('shell.services')} items={services} onNavigate={closeSidebar} />
          <Section icon={LineChart} title={t('shell.insights')} items={insights} onNavigate={closeSidebar} />
          <Section icon={BookOpen} title={t('shell.guides')} items={guides} onNavigate={closeSidebar} />

          <div className="h-px bg-white/10" />

          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Network</p>
            <NetworkBadge />
            <p className="text-xs text-slate-500">Shannon · chainId 50312 · STT</p>
            <ConnectButton />
          </div>
        </div>
      </aside>
    </div>
  )
}
