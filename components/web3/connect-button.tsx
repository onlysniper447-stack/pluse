'use client'

import { Wallet, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWallet } from './wallet-provider'
import { shortAddr } from '@/lib/mock-data'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { isConnected, isConnecting, isDemo, address, balance, connect, disconnect } = useWallet()
  const { t } = useI18n()

  if (isConnected && address) {
    return (
      <motion.button
        type="button"
        onClick={disconnect}
        whileTap={{ scale: 0.97 }}
        title="Disconnect wallet"
        className={cn(
          'group flex items-center gap-2 rounded-md border border-emerald/50 bg-emerald/10 font-mono text-xs text-emerald transition-all hover:border-crimson/50 hover:bg-crimson/10 hover:text-crimson hover:scale-[1.01]',
          compact ? 'h-9 px-2.5' : 'h-9 px-3',
        )}
      >
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-emerald group-hover:bg-crimson" />
        </span>
        {!compact && <span className="text-muted-foreground">{isDemo ? 'DEMO' : `${balance} STT`}</span>}
        <span>{shortAddr(address)}</span>
      </motion.button>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={connect}
      disabled={isConnecting}
      whileTap={{ scale: 0.97 }}
      className="flex h-9 items-center gap-2 rounded-md border border-emerald bg-emerald/10 px-3 text-xs font-semibold tracking-tight text-emerald shadow-glow-emerald transition-all hover:bg-emerald hover:text-primary-foreground hover:scale-[1.01] disabled:opacity-70"
    >
      {isConnecting ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}
      {compact ? t('connect') : isConnecting ? '…' : t('connect')}
    </motion.button>
  )
}
