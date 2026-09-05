'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Check, X } from 'lucide-react'
import { Panel, Tag } from '@/components/ui/panel'
import { type ScanResult } from '@/lib/mock-data'
import { fadeUp, scoreRingTransition, staggerContainer } from '@/lib/motion'
import { useI18n } from '@/lib/i18n'
import type { ScanPhase } from './use-scan-engine'

const RADIUS = 36
const CIRC = 2 * Math.PI * RADIUS

interface Props {
  result: ScanResult | null
  phase: ScanPhase
  onOpenScore: () => void
}

function safetyKey(score: number) {
  if (score >= 80) return 'triage.safe' as const
  if (score >= 50) return 'triage.warn' as const
  return 'triage.danger' as const
}

export function TriageCards({ result, phase, onOpenScore }: Props) {
  const { t } = useI18n()
  const score = result?.score ?? 0
  const stroke = !result ? 'var(--muted)' : score >= 80 ? 'var(--emerald)' : score >= 50 ? 'var(--amber)' : 'var(--crimson)'
  const labelTone = score >= 80 ? 'emerald' : score >= 50 ? 'amber' : 'crimson'
  const priceOk = result ? result.oracleQuorum === 'PASSED' : null
  const rulesOk = result ? result.vectors.resolution >= 80 : null

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-3">
      <motion.div variants={fadeUp}>
        <button type="button" onClick={() => result && onOpenScore()} className="block w-full text-left" disabled={!result}>
          <Panel interactive className="flex items-center gap-4 p-4">
            <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90" aria-hidden>
              <circle cx="44" cy="44" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="6" />
              <motion.circle
                cx="44"
                cy="44"
                r={RADIUS}
                fill="none"
                stroke={stroke}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{
                  strokeDashoffset: result ? CIRC * (1 - score / 100) : phase === 'scanning' ? CIRC * 0.65 : CIRC,
                }}
                transition={scoreRingTransition}
                style={{ filter: result ? `drop-shadow(0 0 6px ${stroke})` : undefined }}
              />
            </svg>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t('triage.score')}</p>
              <p className="font-mono text-3xl font-bold tabular-nums text-foreground">
                {result ? score : phase === 'scanning' ? '··' : '—'}
                <span className="ml-1 text-xs text-muted-foreground">/ 100</span>
              </p>
              {result ? (
                <Tag tone={labelTone} className="mt-1">
                  {score >= 80 ? <ShieldCheck className="size-3" /> : <ShieldAlert className="size-3" />}
                  {t(safetyKey(score))}
                </Tag>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">{t('triage.idle')}</p>
              )}
            </div>
          </Panel>
        </button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel interactive className="flex h-full flex-col justify-between gap-3 p-4">
          <p className="text-[11px] font-medium text-muted-foreground">{t('triage.price')}</p>
          {priceOk === null ? (
            <p className="text-sm text-muted-foreground">{t('triage.idle')}</p>
          ) : (
            <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              {priceOk ? <Check className="mt-0.5 size-4 shrink-0 text-emerald" /> : <X className="mt-0.5 size-4 shrink-0 text-crimson" />}
              {t(priceOk ? 'triage.price.ok' : 'triage.price.bad')}
            </p>
          )}
        </Panel>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel interactive className="flex h-full flex-col justify-between gap-3 p-4">
          <p className="text-[11px] font-medium text-muted-foreground">{t('triage.rules')}</p>
          {rulesOk === null ? (
            <p className="text-sm text-muted-foreground">{t('triage.idle')}</p>
          ) : (
            <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              {rulesOk ? <Check className="mt-0.5 size-4 shrink-0 text-emerald" /> : <X className="mt-0.5 size-4 shrink-0 text-crimson" />}
              {t(rulesOk ? 'triage.rules.ok' : 'triage.rules.bad')}
            </p>
          )}
        </Panel>
      </motion.div>
    </motion.div>
  )
}
