'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Terminal, CircleCheck, TriangleAlert, CircleAlert } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { logLine, scanStateVariants } from '@/lib/motion'
import type { LogEntry, ScanPhase } from './use-scan-engine'
import { cn } from '@/lib/utils'

interface Props {
  logs: LogEntry[]
  phase: ScanPhase
  progress: number
}

function StatusGlyph({ status }: { status: LogEntry['status'] }) {
  if (status === 'pending')
    return <span className="inline-block size-3 animate-spin rounded-full border border-emerald/60 border-t-transparent" />
  if (status === 'ok') return <CircleCheck className="size-3.5 text-emerald" />
  if (status === 'warn') return <TriangleAlert className="size-3.5 text-amber" />
  return <CircleAlert className="size-3.5 text-crimson" />
}

export function ScanTerminal({ logs, phase, progress }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [logs.length])

  return (
    <motion.div variants={scanStateVariants} animate={phase} className="rounded-lg">
      <Panel className="flex h-full flex-col overflow-hidden">
        <PanelHeader
          eyebrow="Live inspection log"
          title="Agent execution console"
          action={
            <Tag tone={phase === 'scanning' ? 'emerald' : phase === 'complete' ? 'emerald' : 'muted'}>
              <Terminal className="size-3" />
              {phase === 'idle' ? 'standby' : phase}
            </Tag>
          }
        />

        <div className="h-0.5 w-full bg-muted/60">
          <motion.div
            className="h-full bg-emerald shadow-glow-emerald"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        <div className="scanline terminal-scroll relative min-h-[260px] flex-1 overflow-y-auto bg-[#07090E] p-3 font-mono text-xs leading-relaxed">
          {logs.length === 0 ? (
            <div className="flex h-full flex-col items-start gap-1 text-muted-foreground">
              <span>
                <span className="text-emerald">pluse@somnia</span>:~$ awaiting target
                <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-emerald animate-blink" />
              </span>
              <span className="mt-2 text-muted-foreground/60">
                {'// AST parse → oracle graph → reentrancy → admin key map.'}
              </span>
            </div>
          ) : (
            <ol className="flex flex-col gap-1">
              <AnimatePresence initial={false}>
                {logs.map((entry) => (
                  <motion.li
                    key={entry.id}
                    variants={logLine}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-[auto_auto_1fr] items-start gap-x-2.5"
                  >
                    <span className="tabular-nums text-muted-foreground/70">{entry.ts}</span>
                    <span className="mt-[3px]">
                      <StatusGlyph status={entry.status} />
                    </span>
                    <span
                      className={cn(
                        entry.status === 'pending' && 'text-foreground/80',
                        entry.status === 'ok' && 'text-foreground',
                        entry.status === 'warn' && 'text-amber',
                        entry.status === 'fail' && 'text-crimson',
                      )}
                    >
                      {entry.text}
                      {entry.status === 'pending' && <span className="text-muted-foreground">…</span>}
                      {entry.detail && <span className="ml-2 text-muted-foreground">› {entry.detail}</span>}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {phase === 'scanning' && (
                <li className="text-emerald">
                  <span className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-emerald animate-blink" />
                </li>
              )}
              <div ref={bottomRef} />
            </ol>
          )}
        </div>
      </Panel>
    </motion.div>
  )
}
