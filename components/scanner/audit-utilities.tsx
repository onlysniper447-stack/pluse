'use client'

import { FileText, Binary, FlaskConical } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { useI18n } from '@/lib/i18n'
import type { ScanPhase } from './use-scan-engine'

interface Props {
  disabled: boolean
  phase: ScanPhase
  onPdf: () => void
  onBytecode: () => void
  onDryRun: () => void
}

export function AuditUtilities({ disabled, onPdf, onBytecode, onDryRun }: Props) {
  const { t } = useI18n()
  const items = [
    { id: 'pdf', icon: FileText, title: t('util.pdf'), desc: t('util.pdf.desc'), onClick: onPdf },
    { id: 'bc', icon: Binary, title: t('util.bytecode'), desc: t('util.bytecode.desc'), onClick: onBytecode },
    { id: 'dry', icon: FlaskConical, title: t('util.dryrun'), desc: t('util.dryrun.desc'), onClick: onDryRun },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          disabled={disabled}
          className="text-left disabled:opacity-40"
        >
          <Panel interactive className="flex h-full gap-3 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
              <item.icon className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium tracking-tight text-foreground">{item.title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.desc}</span>
            </span>
          </Panel>
        </button>
      ))}
    </div>
  )
}
