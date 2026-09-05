'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ShieldCheck, AlertTriangle, Cpu, Activity, Database, Braces } from 'lucide-react'
import { Tag } from '@/components/ui/panel'
import { findingCategories, type ScanResult } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const icons = {
  oracle: Database,
  resolution: Braces,
  reentrancy: Activity,
  admin: Cpu,
} as const

interface Props {
  result: ScanResult
  onClose: () => void
}

export function AuditDrawer({ result, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close audit drawer" className="absolute inset-0 bg-black/55" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-labelledby="audit-drawer-title"
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-[#0B0E14] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Detailed audit</p>
            <h2 id="audit-drawer-title" className="text-base font-semibold tracking-tight text-foreground">
              Vulnerability breakdown
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Score {result.score}/100 · {result.tag}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md border border-slate-800 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="terminal-scroll flex-1 overflow-y-auto p-5">
          <ul className="flex flex-col gap-4">
            {findingCategories.map((cat) => {
              const Icon = icons[cat.id]
              const score = result.vectors[cat.id]
              const items = result.findings.filter((f) => f.category === cat.id)
              return (
                <li key={cat.id} className="rounded-lg border border-slate-800/80 bg-[#121620]/60 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium tracking-tight text-foreground">{cat.title}</p>
                        <span
                          className={cn(
                            'font-mono text-sm font-bold tabular-nums',
                            score >= 80 ? 'text-emerald' : score >= 50 ? 'text-amber' : 'text-crimson',
                          )}
                        >
                          {score}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{cat.blurb}</p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full',
                            score >= 80 ? 'bg-emerald' : score >= 50 ? 'bg-amber' : 'bg-crimson',
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {items.length === 0 && (
                      <li className="text-xs text-muted-foreground">No findings in this vector.</li>
                    )}
                    {items.map((f) => (
                      <li key={f.title} className="flex items-start gap-2 rounded-md border border-slate-800/70 bg-[#07090E] p-2.5">
                        {f.severity === 'pass' ? (
                          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald" />
                        ) : (
                          <AlertTriangle
                            className={cn(
                              'mt-0.5 size-4 shrink-0',
                              f.severity === 'critical' ? 'text-crimson' : 'text-amber',
                            )}
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-foreground">{f.title}</p>
                            <Tag tone={f.severity === 'pass' ? 'emerald' : f.severity === 'critical' ? 'crimson' : 'amber'}>
                              {f.severity}
                            </Tag>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.aside>
    </div>
  )
}
