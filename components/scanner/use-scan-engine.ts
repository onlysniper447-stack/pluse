'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type ScanResult, type ScanStep } from '@/lib/mock-data'
import { inspectTarget } from '@/lib/inspection/inspect'

export type ScanPhase = 'idle' | 'scanning' | 'complete'

export interface LogEntry {
  id: string
  ts: string
  text: string
  detail?: string
  status: ScanStep['status'] | 'pending'
}

function stamp() {
  return new Date().toISOString().slice(11, 23)
}

export function useScanEngine() {
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [result, setResult] = useState<ScanResult | null>(null)
  const [progress, setProgress] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const generation = useRef(0)

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => clear, [])

  const reset = useCallback(() => {
    clear()
    generation.current += 1
    setPhase('idle')
    setLogs([])
    setResult(null)
    setProgress(0)
  }, [])

  const run = useCallback((input: string) => {
    clear()
    const gen = ++generation.current
    setPhase('scanning')
    setResult(null)
    setProgress(4)
    setLogs([
      {
        id: 'boot',
        ts: stamp(),
        text: `PLUSE inspector · target ${input.trim().startsWith('0x') ? input.trim().slice(0, 10) + '…' : 'inline source'}`,
        status: 'ok',
      },
    ])

    void inspectTarget(input)
      .then(({ result: payload, steps }) => {
      if (generation.current !== gen) return

      let elapsed = 180
      steps.forEach((entry, i) => {
        timers.current.push(
          setTimeout(() => {
            if (generation.current !== gen) return
            setLogs((l) => [...l, { id: entry.id, ts: stamp(), text: entry.label, status: 'pending' }])
          }, elapsed),
        )
        elapsed += entry.durationMs
        timers.current.push(
          setTimeout(() => {
            if (generation.current !== gen) return
            setLogs((l) => l.map((e) => (e.id === entry.id ? { ...e, status: entry.status, detail: entry.detail } : e)))
            setProgress(Math.round(((i + 1) / steps.length) * 100))
          }, elapsed),
        )
      })

      timers.current.push(
        setTimeout(() => {
          if (generation.current !== gen) return
          setResult(payload)
          setPhase('complete')
          const scoreLabel = payload.score == null ? 'N/A' : `${payload.score}/100`
          setLogs((l) => [
            ...l,
            {
              id: 'done',
              ts: stamp(),
              text: `Inspection complete · score ${scoreLabel} · ${payload.tag}`,
              status:
                payload.kind === 'eoa'
                  ? 'skipped_na'
                  : payload.tag === 'Adversarial Hazard'
                    ? 'fail'
                    : payload.tag === 'Warning'
                      ? 'warn'
                      : 'ok',
            },
          ])
        }, elapsed + 240),
      )
      })
      .catch((err: unknown) => {
        if (generation.current !== gen) return
        const message = err instanceof Error ? err.message : 'Inspection failed'
        setPhase('complete')
        setLogs((l) => [
          ...l,
          { id: 'err', ts: stamp(), text: 'Inspection aborted', detail: message, status: 'fail' },
        ])
      })
  }, [])

  return { phase, logs, result, progress, run, reset }
}
