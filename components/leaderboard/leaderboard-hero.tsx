'use client'

import { useI18n } from '@/lib/i18n'

export function LeaderboardHero() {
  const { t } = useI18n()

  return (
    <section className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">{t('lb.title')}</h1>
      <p className="mt-2 max-w-2xl text-base text-slate-400">{t('lb.sub')}</p>
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-800/60 pt-4 font-mono text-xs text-slate-500">
        <span>
          Engineers: <span className="text-slate-300">18</span>
        </span>
        <span className="hidden text-slate-700 sm:inline">|</span>
        <span>
          Agents: <span className="text-slate-300">12</span>
        </span>
        <span className="hidden text-slate-700 sm:inline">|</span>
        <span>
          Network: <span className="text-amber-400">Shannon Testnet</span>
        </span>
      </div>
    </section>
  )
}
