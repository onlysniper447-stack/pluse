'use client'

import { useState } from 'react'
import { Wallet, Loader2, AlertTriangle } from 'lucide-react'
import { useWallet } from './wallet-provider'
import { shortAddr } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const {
    isConnected,
    isConnecting,
    isCorrectNetwork,
    hasProvider,
    address,
    balance,
    error,
    connect,
    disconnect,
    switchToSomnia,
    clearError,
  } = useWallet()
  const { t } = useI18n()
  const [explainOpen, setExplainOpen] = useState(false)

  const errorLabel =
    error === 'nowallet'
      ? t('connect.error.nowallet')
      : error === 'rejected'
        ? t('connect.error.rejected')
        : error === 'pending'
          ? t('connect.error.pending')
          : error === 'wrongnet'
            ? t('connect.error.wrongnet')
            : error === 'generic'
              ? t('connect.error.generic')
              : undefined

  if (isConnected && address && !isCorrectNetwork) {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => void switchToSomnia()}
        disabled={isConnecting}
        title={t('connect.error.wrongnet')}
        className="border-amber-400/50 bg-amber-400/10 font-mono text-xs text-amber-300 hover:border-amber-300 hover:text-amber-200"
      >
        {isConnecting ? <Loader2 className="size-4 animate-spin" /> : <AlertTriangle className="size-4" />}
        {!compact && t('connect.switch')}
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => void disconnect()}
        title="Disconnect wallet"
        className="border-primary/50 bg-primary/10 font-mono text-xs text-primary hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-primary group-hover:bg-destructive" />
        </span>
        {!compact && <span className="text-muted-foreground">{balance} STT</span>}
        <span>{shortAddr(address)}</span>
      </Button>
    )
  }

  const onConnectClick = () => {
    clearError()
    if (!hasProvider) {
      void connect()
      return
    }
    setExplainOpen(true)
  }

  const onConfirm = () => {
    setExplainOpen(false)
    void connect()
  }

  return (
    <>
      <Button
        type="button"
        size={compact ? 'icon' : 'lg'}
        onClick={onConnectClick}
        disabled={isConnecting}
        aria-label={error === 'nowallet' ? t('connect.install') : t('connect')}
        title={errorLabel}
        className="shadow-glow-emerald"
      >
        {isConnecting ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
        {!compact ? (error === 'nowallet' ? t('connect.install') : t('connect')) : null}
      </Button>

      <Dialog open={explainOpen} onOpenChange={setExplainOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('connect.explain.title')}</DialogTitle>
            <DialogDescription>{t('connect.explain.body')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setExplainOpen(false)}>
              {t('connect.cancel')}
            </Button>
            <Button type="button" onClick={onConfirm}>
              <Wallet className="size-4" />
              {t('connect.explain.go')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
