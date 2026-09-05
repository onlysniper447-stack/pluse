'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { HeroInput } from './hero-input'
import { TriageCards } from './triage-cards'
import { AuditUtilities } from './audit-utilities'
import { LiquidityPanel } from './liquidity-panel'
import { ScanTerminal } from './scan-terminal'
import { AuditDrawer } from './audit-drawer'
import { PdfModal, BytecodeModal, DryRunModal } from './utility-modals'
import { useScanEngine } from './use-scan-engine'
import { sampleContractInput } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'

export function ScannerWorkspace() {
  const [input, setInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modal, setModal] = useState<'pdf' | 'bytecode' | 'dryrun' | null>(null)
  const { phase, logs, result, progress, run } = useScanEngine()
  const params = useSearchParams()
  const { t } = useI18n()

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
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem] sm:leading-snug">
          {t('slogan')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('hero.sub')}</p>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <HeroInput value={input} onChange={setInput} phase={phase} onRun={() => run(input)} />
      </div>

      <TriageCards result={result} phase={phase} onOpenScore={() => setDrawerOpen(true)} />
      <AuditUtilities
        disabled={!ready}
        phase={phase}
        onPdf={() => setModal('pdf')}
        onBytecode={() => setModal('bytecode')}
        onDryRun={() => setModal('dryrun')}
      />

      {(phase === 'scanning' || logs.length > 0) && (
        <ScanTerminal logs={logs} phase={phase} progress={progress} />
      )}

      <LiquidityPanel result={result} />

      <AnimatePresence>
        {drawerOpen && result && <AuditDrawer result={result} onClose={() => setDrawerOpen(false)} />}
      </AnimatePresence>
      {modal === 'pdf' && result && <PdfModal result={result} target={input} onClose={() => setModal(null)} />}
      {modal === 'bytecode' && <BytecodeModal onClose={() => setModal(null)} />}
      {modal === 'dryrun' && <DryRunModal onClose={() => setModal(null)} />}
    </div>
  )
}
