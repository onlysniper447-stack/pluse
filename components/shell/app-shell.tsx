'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WalletProvider } from '@/components/web3/wallet-provider'
import { I18nProvider } from '@/lib/i18n'
import { TopBar } from './top-bar'
import { MobileDock } from './mobile-dock'
import { NetworkStats } from './network-stats'
import { Sidebar } from './sidebar'
import { ShellProvider } from './shell-context'

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        router.push('/?quick=1')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-primary-foreground"
      >
        Skip to workspace
      </a>
      <TopBar />
      <NetworkStats />
      <main id="main" className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-24 pt-6 lg:pb-10 lg:px-6">
        {children}
      </main>
      <MobileDock />
      <Sidebar />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <WalletProvider>
        <ShellProvider>
          <ShellInner>{children}</ShellInner>
        </ShellProvider>
      </WalletProvider>
    </I18nProvider>
  )
}
