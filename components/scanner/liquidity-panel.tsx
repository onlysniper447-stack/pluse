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
  Wallet: 'liq.wallet',
  Native: 'liq.native',
}

const tagTone: Record<EntityTag, 'high' | 'emerald' | 'amber' | 'muted' | 'cyan'> = {
  'Pool Creator': 'high',
  'Public Pool': 'emerald',
  'Big Wallet': 'amber',
  Wallet: 'emerald',
  Native: 'cyan',
}

export function LiquidityPanel({ result }: { result: ScanResult | null }) {
  const { t } = useI18n()
  const holders = result?.holders ?? []
  const deployed = result?.liquidityDeployed ?? false
  const top = holders[0]?.share ?? 0
  const warn = deployed && top > 50 && result?.kind === 'prediction-market'
  const total = result?.liquidityUsd ?? 0
  const walletView = result?.kind === 'eoa' || result?.kind === 'erc20' || result?.kind === 'erc721' || result?.kind === 'generic'
  const native = holders.reduce((sum, h) => sum + (h.amountStt ?? 0), 0)

  return (
    <Panel>
      <PanelHeader
        eyebrow={walletView ? 'On-chain balance' : t('liq.deposited')}
        title={walletView ? 'Wallet holdings' : t('liq.title')}
        action={
          result ? (
            <Tag tone={deployed ? 'emerald' : 'muted'}>
              {walletView ? (deployed ? 'Balance found' : 'Zero balance') : deployed ? t('liq.active') : t('liq.none')}
            </Tag>
          ) : (
            <Tag tone="muted">{t('triage.idle')}</Tag>
          )
        }
      />

      {result && (
        <p className="border-b border-slate-800/80 px-4 py-3 font-mono text-lg font-semibold tabular-nums text-foreground">
          {walletView ? `${native.toLocaleString('en-US', { maximumFractionDigits: 4 })} STT` : formatUsd(total, false)}
          <span className="ml-2 text-xs font-normal text-muted-foreground">{walletView ? 'native' : 'USD'}</span>
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
              <th className="pb-2 font-medium">{walletView ? 'Type' : t('liq.entity')}</th>
              <th className="pb-2 font-medium">{t('liq.share')}</th>
              <th className="pb-2 text-right font-medium">{walletView ? 'Amount' : t('liq.volume')}</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((h) => (
              <tr key={`${h.address}-${h.tag}`} className="border-t border-slate-800/70">
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
                <td className="py-2.5 text-right font-mono text-xs tabular-nums">
                  {h.amountStt != null
                    ? `${h.amountStt.toLocaleString('en-US', { maximumFractionDigits: 4 })} STT`
                    : formatUsd(h.usd, false)}
                </td>
              </tr>
            ))}
            {!holders.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                  {result ? 'No holdings decoded for this target.' : t('triage.idle')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
