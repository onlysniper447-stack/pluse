'use client'

import { motion } from 'framer-motion'
import { Award, TrendingUp, Wallet } from 'lucide-react'
import { Panel, Tag } from '@/components/ui/panel'
import { ConnectButton } from '@/components/web3/connect-button'
import { useWallet } from '@/components/web3/wallet-provider'
import { currentUser, shortAddr } from '@/lib/mock-data'
import { GradeBadge } from './grade-badge'

export function DeveloperBanner() {
  const { isConnected } = useWallet()

  if (!isConnected) {
    return (
      <Panel className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-slate-800 text-muted-foreground">
            <Wallet className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium tracking-tight text-foreground">Personal security scorecard</p>
            <p className="text-xs text-muted-foreground">
              Connect a Somnia testnet wallet to load your percentile, audit history, and earned badges.
            </p>
          </div>
        </div>
        <ConnectButton />
      </Panel>
    )
  }

  const u = currentUser
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Panel className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F080]/70 to-transparent" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_left,black,transparent_60%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <GradeBadge grade={u.grade} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-semibold text-foreground">{u.handle}</p>
                <Tag tone="emerald">You</Tag>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{shortAddr(u.address, 6)}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Percentile</dt>
              <dd className="flex items-center gap-1.5 font-mono text-xl font-bold tabular-nums text-emerald">
                Top {u.percentile}%
                <span className="flex items-center text-xs font-medium">
                  <TrendingUp className="size-3.5" />
                  {u.trend}
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Global rank</dt>
              <dd className="font-mono text-xl font-bold tabular-nums text-foreground">#{u.rank}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Audit history</dt>
              <dd className="font-mono text-xl font-bold tabular-nums text-foreground">{u.marketsCreated}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Pass rate</dt>
              <dd className="font-mono text-xl font-bold tabular-nums text-emerald">{u.passRate}%</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-1.5 lg:max-w-[220px] lg:justify-end">
            {u.badges.map((b) => (
              <Tag key={b} tone="emerald">
                <Award className="size-3" /> {b}
              </Tag>
            ))}
          </div>
        </div>
      </Panel>
    </motion.div>
  )
}
