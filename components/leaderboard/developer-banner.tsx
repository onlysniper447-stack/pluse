'use client'

import { TrendingUp, Wallet } from 'lucide-react'
import { ConnectButton } from '@/components/web3/connect-button'
import { useWallet } from '@/components/web3/wallet-provider'
import { currentUser, shortAddr } from '@/lib/mock-data'

export function DeveloperBanner() {
  const { isConnected } = useWallet()

  if (!isConnected) {
    return (
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-[#0A0C10] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-slate-800 text-slate-500">
            <Wallet className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Your security scorecard</p>
            <p className="text-xs text-slate-400">Connect a Somnia testnet wallet to load rank, history, and attributes.</p>
          </div>
        </div>
        <ConnectButton />
      </div>
    )
  }

  const u = currentUser
  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-[#0A0C10] px-5 py-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-white">{u.handle}</p>
          <p className="font-mono text-xs text-slate-500">{shortAddr(u.address, 6)}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <div>
            <dt className="text-[11px] text-slate-500">Percentile</dt>
            <dd className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
              Top {u.percentile}%
              <TrendingUp className="size-3.5" />
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">Global rank</dt>
            <dd className="text-sm font-semibold tabular-nums text-white">#{u.rank}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">Audited</dt>
            <dd className="text-sm font-semibold tabular-nums text-white">{u.marketsCreated}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">Rating</dt>
            <dd className="text-sm font-semibold tabular-nums text-emerald-400">{u.passRate}%</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
