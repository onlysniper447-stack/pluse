'use client'

import { Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/lib/i18n'
import type { ScanPhase } from './use-scan-engine'

interface ScannerHeroProps {
  value: string
  onChange: (v: string) => void
  phase: ScanPhase
  onRun: () => void
}

export function ScannerHero({ value, onChange, phase, onRun }: ScannerHeroProps) {
  const { t } = useI18n()
  const scanning = phase === 'scanning'
  const empty = value.trim().length === 0

  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">{t('sync')}</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
          {t('hero.sub')}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">{t('slogan')}</p>
      </div>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        onSubmit={(e) => {
          e.preventDefault()
          if (!empty && !scanning) onRun()
        }}
      >
        <Label htmlFor="hero-target" className="sr-only">
          {t('hero.placeholder')}
        </Label>
        <Input
          id="hero-target"
          value={value}
          onValueChange={onChange}
          disabled={scanning}
          spellCheck={false}
          placeholder={t('hero.placeholder')}
          className="h-12 min-w-0 flex-1 rounded-lg border-slate-800 bg-[#0A0C10] px-4 font-mono text-sm text-white placeholder:text-slate-500 md:h-[52px] md:text-sm"
        />
        <Button
          type="submit"
          disabled={empty || scanning}
          className="h-12 shrink-0 gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400 md:h-[52px]"
        >
          {scanning ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
          {scanning ? t('hero.scanning') : t('hero.run')}
        </Button>
      </form>
    </section>
  )
}
