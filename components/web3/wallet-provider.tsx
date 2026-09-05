'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPublicClient, custom, formatEther, type Address } from 'viem'
import { DEMO_ADDRESS, somnia, SOMNIA_WALLET_PARAMS } from '@/lib/web3/somnia'

export interface WalletState {
  address?: Address
  chainId: number
  chainName: string
  isConnected: boolean
  isConnecting: boolean
  isDemo: boolean
  balance: string
}

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

const WalletContext = createContext<WalletContextValue | null>(null)

async function ensureSomnia(eth: EthereumProvider) {
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_WALLET_PARAMS.chainId }],
    })
  } catch (err) {
    const code = (err as { code?: number })?.code
    if (code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [SOMNIA_WALLET_PARAMS],
      })
    }
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Address | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [balance, setBalance] = useState('1,284.20')

  const connect = useCallback(async () => {
    setIsConnecting(true)
    try {
      const eth = typeof window !== 'undefined' ? window.ethereum : undefined
      if (eth) {
        await ensureSomnia(eth)
        const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[]
        const next = accounts[0] as Address | undefined
        if (next) {
          setAddress(next)
          setIsDemo(false)
          try {
            const client = createPublicClient({ chain: somnia, transport: custom(eth) })
            const wei = await client.getBalance({ address: next })
            setBalance(
              Number(formatEther(wei)).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              }),
            )
          } catch {
            setBalance('—')
          }
          return
        }
      }
      await new Promise((r) => setTimeout(r, 700))
      setAddress(DEMO_ADDRESS)
      setIsDemo(true)
      setBalance('1,284.20')
    } catch (err) {
      const code = (err as { code?: number })?.code
      if (code === 4001) return
      setAddress(DEMO_ADDRESS)
      setIsDemo(true)
      setBalance('1,284.20')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(undefined)
    setIsDemo(false)
    setBalance('1,284.20')
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      chainId: somnia.id,
      chainName: somnia.name,
      isConnected: Boolean(address),
      isConnecting,
      isDemo,
      balance,
      connect,
      disconnect,
    }),
    [address, isConnecting, isDemo, balance, connect, disconnect],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within <WalletProvider>')
  return ctx
}
