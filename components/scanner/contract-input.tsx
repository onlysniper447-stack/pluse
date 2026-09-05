'use client'

import { motion } from 'framer-motion'
import { Play, RotateCcw, FileCode, Hash, Loader2 } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { sampleContractInput } from '@/lib/mock-data'
import type { ScanPhase } from './use-scan-engine'
import { cn } from '@/lib/utils'

export type InputMode = 'address' | 'code'

interface Props {
  mode: InputMode
  onModeChange: (mode: InputMode) => void
  address: string
  code: string
  onAddressChange: (v: string) => void
  onCodeChange: (v: string) => void
  phase: ScanPhase
  onRun: () => void
  onReset: () => void
}

export function ContractInput({
  mode,
  onModeChange,
  address,
  code,
  onAddressChange,
  onCodeChange,
  phase,
  onRun,
  onReset,
}: Props) {
  const scanning = phase === 'scanning'
  const value = mode === 'address' ? address : code
  const isEmpty = value.trim().length === 0
  const isAddress = /^0x[a-fA-F0-9]{40}$/.test(address.trim())

  return (
    <Panel className="flex flex-col">
      <PanelHeader
        eyebrow="Hacken inspection engine"
        title="Target input"
        action={
          <Tag tone={mode === 'address' ? (isAddress ? 'emerald' : 'muted') : 'emerald'}>
            {mode === 'address' ? <Hash className="size-3" /> : <FileCode className="size-3" />}
            {mode === 'address' ? 'CA' : 'Source'}
          </Tag>
        }
      />

      <div className="flex border-b border-slate-800/80">
        {(
          [
            ['address', 'CA', 'Paste Contract Address (CA)'],
            ['code', 'Source', 'Raw Resolution / Smart Contract Code'],
          ] as const
        ).map(([id, short, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onModeChange(id)}
            className={cn(
              'relative flex-1 px-3 py-2 text-left text-[11px] font-medium tracking-tight transition-colors',
              mode === id ? 'text-emerald' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
            {mode === id && (
              <motion.span
                layoutId="input-tab"
                className="absolute inset-x-3 bottom-0 h-px bg-emerald"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex-1 p-3">
        {mode === 'address' ? (
          <>
            <label htmlFor="scan-address" className="sr-only">
              Contract address
            </label>
            <input
              id="scan-address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isEmpty && !scanning) onRun()
              }}
              disabled={scanning}
              spellCheck={false}
              placeholder="0x…"
              className="h-[220px] w-full rounded-md border border-slate-800 bg-[#07090E] px-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-emerald/50 focus:ring-2 focus:ring-emerald/20 disabled:opacity-60"
            />
          </>
        ) : (
          <>
            <label htmlFor="scan-input" className="sr-only">
              Raw resolution logic
            </label>
            <textarea
              id="scan-input"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isEmpty && !scanning) {
                  e.preventDefault()
                  onRun()
                }
              }}
              disabled={scanning}
              spellCheck={false}
              placeholder={'paste resolve() / Solidity source'}
              className="min-h-[220px] w-full resize-none rounded-md border border-slate-800 bg-[#07090E] p-3 font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-emerald/50 focus:ring-2 focus:ring-emerald/20 disabled:opacity-60"
            />
          </>
        )}
        <div className="pointer-events-none absolute bottom-5 right-5 font-mono text-[10px] text-muted-foreground">
          {value.length} chars
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 px-3 py-2.5">
        <button
          type="button"
          onClick={() => {
            onModeChange('code')
            onCodeChange(sampleContractInput)
          }}
          disabled={scanning}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
        >
          Load sample
        </button>
        <div className="flex items-center gap-2">
          {phase !== 'idle' && (
            <button
              type="button"
              onClick={onReset}
              className="flex h-9 items-center gap-1.5 rounded-md border border-slate-800 px-3 text-xs text-muted-foreground transition-transform hover:scale-[1.01] hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
          )}
          <motion.button
            type="button"
            onClick={onRun}
            disabled={isEmpty || scanning}
            whileTap={{ scale: 0.97 }}
            className="flex h-9 items-center gap-2 rounded-md bg-emerald px-4 text-xs font-semibold text-primary-foreground shadow-glow-emerald transition-all hover:brightness-110 hover:scale-[1.01] disabled:opacity-40 disabled:shadow-none"
          >
            {scanning ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            {scanning ? 'Inspecting…' : 'Run Security Audit'}
          </motion.button>
        </div>
      </div>
    </Panel>
  )
}
