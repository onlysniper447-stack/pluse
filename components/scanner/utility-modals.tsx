'use client'

import { useEffect, useState } from 'react'
import { FileText, Binary, FlaskConical, Check, Loader2 } from 'lucide-react'
import type { ScanResult } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function PdfModal({ result, target, onClose }: { result: ScanResult; target: string; onClose: () => void }) {
  const { t } = useI18n()
  const [hash, setHash] = useState('')

  useEffect(() => {
    sha256(JSON.stringify({ target, score: result.score, tag: result.tag, ts: '2026-09-05' })).then(setHash)
  }, [result, target])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            {t('util.pdf')}
          </DialogTitle>
          <DialogDescription>{t('util.pdf.desc')}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-primary/30 bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">PLUSE · Executive certificate</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            {result.score == null ? 'N/A' : `${result.score} / 100`}
          </p>
          <p className="text-sm text-muted-foreground">{result.tag} · Somnia Shannon Testnet (50312)</p>
          <p className="mt-3 break-all font-mono text-[11px] text-muted-foreground">Target {target.slice(0, 42)}</p>
          <p className="mt-2 break-all font-mono text-[11px] text-primary">sha256:{hash || '…'}</p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Binary className="size-4 text-primary" />
            {t('util.bytecode')}
          </DialogTitle>
          <DialogDescription>{t('util.bytecode.desc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 rounded-lg border border-border bg-background p-3 font-mono text-xs">
          {lines.slice(0, step + 1).map((l, i) => (
            <p key={l} className={i === 3 ? 'text-primary' : 'text-foreground/80'}>
              {i === step && step < 3 ? (
                <Loader2 className="mr-2 inline size-3 animate-spin" />
              ) : (
                <Check className="mr-2 inline size-3 text-primary" />
              )}
              {l}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
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
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="size-4 text-primary" />
            {t('util.dryrun')}
          </DialogTitle>
          <DialogDescription>{t('util.dryrun.desc')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 rounded-lg border border-border bg-background p-3 font-mono text-xs">
          {lines.slice(0, step + 1).map((l, i) => (
            <p key={l} className={i === 4 ? 'text-primary' : 'text-foreground/80'}>
              {i === step && step < 4 ? (
                <Loader2 className="mr-2 inline size-3 animate-spin" />
              ) : (
                <Check className="mr-2 inline size-3 text-primary" />
              )}
              {l}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
