'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { scanScript, type ScanResult, type ScanStep } from '@/lib/mock-data'
import { resolveScan } from '@/lib/scan-resolver'

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

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => clear, [])

  const reset = useCallback(() => {
    clear()
    setPhase('idle')
    setLogs([])
    setResult(null)
    setProgress(0)
  }, [])

  const run = useCallback((input: string) => {
    clear()
    const payload = resolveScan(input)
    setPhase('scanning')
    setResult(null)
    setProgress(0)
    setLogs([
      {
        id: 'boot',
        ts: stamp(),
        text: `PLUSE agent v2.4.1 · target ${input.trim().startsWith('0x') ? input.trim().slice(0, 10) + '…' : 'inline resolution logic'}`,
        status: 'ok',
      },
    ])

    let elapsed = 250
    scanScript.forEach((step, i) => {
      timers.current.push(
        setTimeout(() => {
          setLogs((l) => [...l, { id: step.id, ts: stamp(), text: step.label, status: 'pending' }])
        }, elapsed),
      )
      elapsed += step.durationMs
      timers.current.push(
        setTimeout(() => {
          setLogs((l) => l.map((e) => (e.id === step.id ? { ...e, status: step.status, detail: step.detail } : e)))
          setProgress(Math.round(((i + 1) / scanScript.length) * 100))
        }, elapsed),
      )
    })

    timers.current.push(
      setTimeout(() => {
        setResult(payload)
        setPhase('complete')
        setLogs((l) => [
          ...l,
          {
            id: 'done',
            ts: stamp(),
            text: `Scan complete · score ${payload.score}/100 · ${payload.tag.toUpperCase()}`,
            status: payload.tag === 'Adversarial Hazard' ? 'fail' : payload.tag === 'Warning' ? 'warn' : 'ok',
          },
        ])
      }, elapsed + 300),
    )
  }, [])

  return { phase, logs, result, progress, run, reset }
}
