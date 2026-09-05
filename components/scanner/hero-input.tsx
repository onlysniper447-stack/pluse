'use client'

import { Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import type { ScanPhase } from './use-scan-engine'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (v: string) => void
  phase: ScanPhase
  onRun: () => void
}

export function HeroInput({ value, onChange, phase, onRun }: Props) {
  const { t } = useI18n()
  const scanning = phase === 'scanning'
  const empty = value.trim().length === 0

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 backdrop-blur-md shadow-[0_0_40px_-12px_rgba(0,240,128,0.25)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label htmlFor="hero-target" className="sr-only">
          {t('hero.placeholder')}
        </label>
        <input
          id="hero-target"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !empty && !scanning) onRun()
          }}
          disabled={scanning}
          spellCheck={false}
          placeholder={t('hero.placeholder')}
          className="h-14 min-w-0 flex-1 rounded-lg border border-slate-800 bg-[#07090E] px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-emerald/50 focus:ring-2 focus:ring-emerald/20 disabled:opacity-60"
        />
        <motion.button
          type="button"
          onClick={onRun}
          disabled={empty || scanning}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex h-14 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald px-6 text-sm font-semibold tracking-tight text-primary-foreground shadow-glow-emerald transition-transform hover:scale-[1.01] disabled:opacity-40 disabled:shadow-none',
          )}
        >
          {scanning ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
          {scanning ? t('hero.scanning') : t('hero.run')}
        </motion.button>
      </div>
    </div>
  )
}
