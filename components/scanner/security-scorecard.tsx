'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, CircleCheck, TriangleAlert, CircleAlert, ExternalLink } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { fadeUp, scoreRingTransition, staggerContainer } from '@/lib/motion'
import { findingCategories, type ScanResult, type ScoreTag } from '@/lib/mock-data'
import type { ScanPhase } from './use-scan-engine'
import { cn } from '@/lib/utils'

interface Props {
  result: ScanResult | null
  phase: ScanPhase
  onOpenDrawer: () => void
}

const RADIUS = 54
const CIRC = 2 * Math.PI * RADIUS

const TICKS = Array.from({ length: 40 }, (_, i) => {
  const a = (i / 40) * 2 * Math.PI
  const r = (n: number) => (Math.round(n * 1000) / 1000).toFixed(3)
  return {
    x1: r(72 + Math.cos(a) * 64),
    y1: r(72 + Math.sin(a) * 64),
    x2: r(72 + Math.cos(a) * 67),
    y2: r(72 + Math.sin(a) * 67),
  }
})

function tagTone(tag: ScoreTag) {
  if (tag === 'Pass') return 'emerald' as const
  if (tag === 'Warning') return 'amber' as const
  return 'crimson' as const
}

function scoreStroke(score: number) {
  if (score >= 80) return 'var(--emerald)'
  if (score >= 50) return 'var(--amber)'
  return 'var(--crimson)'
}

export function SecurityScorecard({ result, phase, onOpenDrawer }: Props) {
  const score = result?.score ?? 0
  const tag = result?.tag ?? 'Pass'
  const stroke = result ? scoreStroke(score) : 'var(--emerald)'

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        eyebrow="Security scorecard"
        title="PLUSE rating"
        action={
          result ? (
            <Tag tone={tagTone(tag)}>
              {tag === 'Pass' ? <ShieldCheck className="size-3" /> : <ShieldAlert className="size-3" />}
              {tag}
            </Tag>
          ) : (
            <Tag tone="muted">{phase === 'scanning' ? 'computing' : 'no scan'}</Tag>
          )
        }
      />

      <div className="flex flex-col items-center gap-6 p-5 lg:flex-row lg:items-start">
        <button
          type="button"
          onClick={() => result && onOpenDrawer()}
          disabled={!result}
          className="relative shrink-0 rounded-full transition-transform hover:scale-[1.01] disabled:cursor-default"
          aria-label={result ? `Open audit drawer, score ${score}` : 'No scan yet'}
        >
          <svg
            width="144"
            height="144"
            viewBox="0 0 144 144"
            className="-rotate-90"
            role="img"
            aria-label={`Score ${score} out of 100`}
          >
            <circle cx="72" cy="72" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="8" />
            {TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--border)" strokeWidth="1" />
            ))}
            <motion.circle
              cx="72"
              cy="72"
              r={RADIUS}
              fill="none"
              stroke={stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{
                strokeDashoffset: result ? CIRC * (1 - score / 100) : phase === 'scanning' ? CIRC * 0.7 : CIRC,
                rotate: phase === 'scanning' ? 360 : 0,
              }}
              transition={
                phase === 'scanning'
                  ? { rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' }, strokeDashoffset: { duration: 0.5 } }
                  : scoreRingTransition
              }
              style={{ originX: '72px', originY: '72px', filter: `drop-shadow(0 0 8px ${stroke})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={result ? 'score' : phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="font-mono text-4xl font-bold tabular-nums text-foreground"
              >
                {result ? score : phase === 'scanning' ? '··' : '—'}
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">/ 100</span>
          </div>
        </button>

        <div className="w-full min-w-0 flex-1">
          {result ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {findingCategories.map((cat) => {
                  const value = result.vectors[cat.id]
                  return (
                    <motion.div
                      key={cat.id}
                      variants={fadeUp}
                      className="rounded-md border border-slate-800 bg-[#07090E] p-2"
                    >
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {cat.id}
                      </p>
                      <p
                        className={cn(
                          'font-mono text-sm font-bold tabular-nums',
                          value >= 80 ? 'text-emerald' : value >= 50 ? 'text-amber' : 'text-crimson',
                        )}
                      >
                        {value}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
              <ul className="flex flex-col gap-2">
                {result.findings.slice(0, 3).map((f) => (
                  <motion.li
                    key={f.title}
                    variants={fadeUp}
                    className="flex items-start gap-2.5 rounded-md border border-slate-800 bg-[#07090E] p-2.5"
                  >
                    <span className="mt-0.5 shrink-0">
                      {f.severity === 'pass' && <CircleCheck className="size-4 text-emerald" />}
                      {f.severity === 'warn' && <TriangleAlert className="size-4 text-amber" />}
                      {f.severity === 'critical' && <CircleAlert className="size-4 text-crimson" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{f.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{f.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <button
                type="button"
                onClick={onOpenDrawer}
                className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-emerald transition-transform hover:scale-[1.01]"
              >
                Open full audit drawer <ExternalLink className="size-3.5" />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {findingCategories.map((v, i) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-md border border-dashed border-slate-800 p-2.5"
                >
                  <span className="text-xs text-muted-foreground">{v.title}</span>
                  <span
                    className={cn('h-1.5 w-24 overflow-hidden rounded-full bg-muted', phase === 'scanning' && 'animate-pulse')}
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
