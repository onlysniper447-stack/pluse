'use client'

import { Wallet, Loader2 } from 'lucide-react'
import { useWallet } from './wallet-provider'
import { shortAddr } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { isConnected, isConnecting, isDemo, address, balance, connect, disconnect } = useWallet()
  const { t } = useI18n()

  if (isConnected && address) {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={disconnect}
        title="Disconnect wallet"
        className="border-primary/50 bg-primary/10 font-mono text-xs text-primary hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-primary group-hover:bg-destructive" />
        </span>
        {!compact && <span className="text-muted-foreground">{isDemo ? 'TESTNET DEMO' : `${balance} STT`}</span>}
        <span>{shortAddr(address)}</span>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size={compact ? 'icon' : 'lg'}
      onClick={connect}
      disabled={isConnecting}
      aria-label={t('connect')}
      className="shadow-glow-emerald"
    >
      {isConnecting ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
      {!compact ? t('connect') : null}
    </Button>
  )
}
