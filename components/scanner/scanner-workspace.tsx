'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScannerHero } from './scanner-hero'
import { TriageCards } from './triage-cards'
import { AuditUtilities } from './audit-utilities'
import { LiquidityPanel } from './liquidity-panel'
import { ScanTerminal } from './scan-terminal'
import { AuditDrawer } from './audit-drawer'
import { PdfModal, BytecodeModal, DryRunModal } from './utility-modals'
import { useScanEngine } from './use-scan-engine'
import { sampleContractInput } from '@/lib/mock-data'

export function ScannerWorkspace() {
  const [input, setInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modal, setModal] = useState<'pdf' | 'bytecode' | 'dryrun' | null>(null)
  const { phase, logs, result, progress, run } = useScanEngine()
  const params = useSearchParams()

  useEffect(() => {
    const target = params.get('target')
    if (target && phase === 'idle') {
      setInput(target)
      run(target)
      return
    }
    if (params.get('quick') === '1' && phase === 'idle' && input === '') {
      setInput(sampleContractInput)
      run(sampleContractInput)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const ready = phase === 'complete' && result

  return (
    <div className="flex flex-col gap-5">
      <ScannerHero value={input} onChange={setInput} phase={phase} onRun={() => run(input)} />

      {result?.kind === 'eoa' && result.notice ? (
        <div
          role="status"
          className="rounded-xl border border-slate-800 bg-[#0A0C10] px-4 py-3 text-sm text-slate-200"
        >
          <p className="font-semibold text-white">EOA (wallet) — code checks bypassed</p>
          <p className="mt-1 text-slate-400">{result.notice}</p>
        </div>
      ) : null}

      {result?.kind && result.kind !== 'eoa' && result.kind !== 'prediction-market' && result.notice ? (
        <div role="status" className="rounded-xl border border-slate-800 bg-[#0A0C10] px-4 py-3 text-sm text-slate-400">
          {result.notice}
        </div>
      ) : null}

      <TriageCards result={result} phase={phase} onOpenScore={() => setDrawerOpen(true)} />
      <AuditUtilities
        disabled={!ready || result?.kind === 'eoa'}
        phase={phase}
        onPdf={() => setModal('pdf')}
        onBytecode={() => setModal('bytecode')}
        onDryRun={() => setModal('dryrun')}
      />

      {(phase === 'scanning' || logs.length > 0) && (
        <ScanTerminal logs={logs} phase={phase} progress={progress} />
      )}

      {phase === 'complete' && result ? <LiquidityPanel result={result} /> : null}

      <AuditDrawer result={result} open={drawerOpen && Boolean(result)} onClose={() => setDrawerOpen(false)} />
      {modal === 'pdf' && result && <PdfModal result={result} target={input} onClose={() => setModal(null)} />}
      {modal === 'bytecode' && <BytecodeModal onClose={() => setModal(null)} />}
      {modal === 'dryrun' && <DryRunModal onClose={() => setModal(null)} />}
    </div>
  )
}
