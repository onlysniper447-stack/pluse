'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, Binary, FlaskConical, Check, Loader2 } from 'lucide-react'
import type { ScanResult } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function Frame({
  title,
  icon: Icon,
  onClose,
  children,
}: {
  title: string
  icon: typeof FileText
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        role="dialog"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-[#0A0C10] p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-emerald" />
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

export function PdfModal({ result, target, onClose }: { result: ScanResult; target: string; onClose: () => void }) {
  const { t } = useI18n()
  const [hash, setHash] = useState('')

  useEffect(() => {
    sha256(JSON.stringify({ target, score: result.score, tag: result.tag, ts: '2026-09-05' })).then(setHash)
  }, [result, target])

  return (
    <Frame title={t('util.pdf')} icon={FileText} onClose={onClose}>
      <div className="rounded-lg border border-emerald/30 bg-slate-900/60 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald">PLUSE · Executive certificate</p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{result.score} / 100</p>
        <p className="text-sm text-muted-foreground">{result.tag} · Somnia Shannon Testnet (50312)</p>
        <p className="mt-3 break-all font-mono text-[11px] text-muted-foreground">
          Target {target.slice(0, 42)}
        </p>
        <p className="mt-2 break-all font-mono text-[11px] text-emerald">
          sha256:{hash || '…'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 h-9 w-full rounded-md bg-emerald text-xs font-semibold text-primary-foreground"
      >
        Print / Save PDF
      </button>
    </Frame>
  )
}

export function BytecodeModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(3, s + 1)), 700)
    return () => clearInterval(id)
  }, [])

  const lines = [
    'Fetching runtime bytecode @ Somnia Shannon 50312…',
    'Hashing solc 0.8.26 metadata…',
    'Comparing source digest ↔ on-chain bytecode…',
    'MATCH  14.2 KB  ·  0 opcode deltas',
  ]

  return (
    <Frame title={t('util.bytecode')} icon={Binary} onClose={onClose}>
      <div className="space-y-2 rounded-lg border border-slate-800 bg-[#07090E] p-3 font-mono text-xs">
        {lines.slice(0, step + 1).map((l, i) => (
          <p key={l} className={i === 3 ? 'text-emerald' : 'text-foreground/80'}>
            {i === step && step < 3 ? <Loader2 className="mr-2 inline size-3 animate-spin" /> : <Check className="mr-2 inline size-3 text-emerald" />}
            {l}
          </p>
        ))}
      </div>
    </Frame>
  )
}

export function DryRunModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(4, s + 1)), 650)
    return () => clearInterval(id)
  }, [])

  const lines = [
    'Forking Somnia Shannon testnet (50312)…',
    'eth_call resolve() with Pyth=$119,840 · Chainlink=$119,910',
    'Divergence 0.06% < 5% band · quorum holds',
    'settle(NO) would execute · payout path non-reentrant',
    'DRY RUN COMPLETE · 0 gas spent',
  ]

  return (
    <Frame title={t('util.dryrun')} icon={FlaskConical} onClose={onClose}>
      <div className="space-y-2 rounded-lg border border-slate-800 bg-[#07090E] p-3 font-mono text-xs">
        {lines.slice(0, step + 1).map((l, i) => (
          <p key={l} className={i === 4 ? 'text-emerald' : 'text-foreground/80'}>
            {i === step && step < 4 ? <Loader2 className="mr-2 inline size-3 animate-spin" /> : <Check className="mr-2 inline size-3 text-emerald" />}
            {l}
          </p>
        ))}
      </div>
    </Frame>
  )
}
