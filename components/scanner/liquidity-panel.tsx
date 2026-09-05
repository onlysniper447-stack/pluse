'use client'

import { AlertTriangle } from 'lucide-react'
import { Panel, PanelHeader, Tag } from '@/components/ui/panel'
import { formatUsd, shortAddr, type EntityTag, type ScanResult } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const tagKey: Record<EntityTag, string> = {
  'Pool Creator': 'liq.creator',
  'Public Pool': 'liq.pool',
  'Big Wallet': 'liq.whale',
}

const tagTone: Record<EntityTag, 'high' | 'emerald' | 'amber'> = {
  'Pool Creator': 'high',
  'Public Pool': 'emerald',
  'Big Wallet': 'amber',
}

export function LiquidityPanel({ result }: { result: ScanResult | null }) {
  const { t } = useI18n()
  const holders = result?.holders ?? []
  const deployed = result?.liquidityDeployed ?? false
  const top = holders[0]?.share ?? 0
  const warn = deployed && top > 50
  const total = result?.liquidityUsd ?? 0

  return (
    <Panel>
      <PanelHeader
        eyebrow={t('liq.deposited')}
        title={t('liq.title')}
        action={
          result ? (
            <Tag tone={deployed ? 'emerald' : 'crimson'}>{deployed ? t('liq.active') : t('liq.none')}</Tag>
          ) : (
            <Tag tone="muted">{t('triage.idle')}</Tag>
          )
        }
      />

      {result && (
        <p className="border-b border-slate-800/80 px-4 py-3 font-mono text-lg font-semibold tabular-nums text-foreground">
          {formatUsd(total, false)}
          <span className="ml-2 text-xs font-normal text-muted-foreground">USD</span>
        </p>
      )}

      {warn && (
        <div className="mx-4 mt-4 flex items-start gap-2 rounded-md border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>{t('liq.warning', { pct: top.toFixed(1) })}</p>
        </div>
      )}

      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-[11px] text-muted-foreground">
              <th className="pb-2 font-medium">Address</th>
              <th className="pb-2 font-medium">{t('liq.entity')}</th>
              <th className="pb-2 font-medium">{t('liq.share')}</th>
              <th className="pb-2 text-right font-medium">{t('liq.volume')}</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((h) => (
              <tr key={h.address} className="border-t border-slate-800/70">
                <td className="py-2.5 font-mono text-xs text-foreground">{shortAddr(h.address, 5)}</td>
                <td className="py-2.5">
                  <Tag tone={tagTone[h.tag]}>{t(tagKey[h.tag])}</Tag>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full', h.share > 50 ? 'bg-crimson' : h.share > 30 ? 'bg-amber' : 'bg-emerald')}
                        style={{ width: `${Math.min(100, h.share)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums">{h.share.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-2.5 text-right font-mono text-xs tabular-nums">{formatUsd(h.usd, false)}</td>
              </tr>
            ))}
            {!holders.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                  {t('triage.idle')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
