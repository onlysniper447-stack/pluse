'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPublicClient, custom, formatEther, type Address } from 'viem'
import {
  METAMASK_DOWNLOAD,
  SOMNIA_CHAIN_ID,
  SOMNIA_CHAIN_ID_HEX,
  somnia,
  somniaWalletParams,
} from '@/lib/web3/somnia'

export type ConnectError =
  | 'nowallet'
  | 'rejected'
  | 'pending'
  | 'wrongnet'
  | 'generic'
  | null

export interface WalletState {
  address?: Address
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  isCorrectNetwork: boolean
  hasProvider: boolean
  error: ConnectError
  balance: string
}

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchToSomnia: () => Promise<void>
  clearError: () => void
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
  isMetaMask?: boolean
}

type EIP6963Detail = {
  info: { name: string; rdns: string }
  provider: EthereumProvider
}

declare global {
  interface Window {
    ethereum?: EthereumProvider & { providers?: EthereumProvider[] }
  }
}

const WalletContext = createContext<WalletContextValue | null>(null)

function rpcErrorCode(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined
  const e = err as { code?: number; data?: { originalError?: { code?: number } } }
  return e.data?.originalError?.code ?? e.code
}

function isUserRejected(err: unknown) {
  const code = rpcErrorCode(err)
  if (code === 4001 || code === 4100) return true
  return /user rejected|rejected the request|denied/i.test(String((err as { message?: string })?.message ?? ''))
}

function isUnrecognizedChain(err: unknown) {
  const code = rpcErrorCode(err)
  if (code === 4902) return true
  return /unrecognized chain|unknown chain|chain not (found|added)|4902/i.test(
    String((err as { message?: string })?.message ?? ''),
  )
}

function parseChainId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value) return Number.parseInt(value, 16)
  return null
}

function discoverProvider(): EthereumProvider | undefined {
  if (typeof window === 'undefined') return undefined

  const announced: EIP6963Detail[] = []
  const onAnnounce = (event: Event) => {
    const detail = (event as CustomEvent<EIP6963Detail>).detail
    if (detail?.provider) announced.push(detail)
  }
  window.addEventListener('eip6963:announceProvider', onAnnounce)
  window.dispatchEvent(new Event('eip6963:requestProvider'))
  window.removeEventListener('eip6963:announceProvider', onAnnounce)

  const metamask = announced.find((p) => p.info.rdns === 'io.metamask' || /metamask/i.test(p.info.name))
  if (metamask) return metamask.provider
  if (announced[0]) return announced[0].provider

  const eth = window.ethereum
  if (!eth) return undefined
  if (Array.isArray(eth.providers) && eth.providers.length) {
    return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0]
  }
  return eth
}

async function addAndSwitch(eth: EthereumProvider) {
  const icon =
    typeof window !== 'undefined' ? `${window.location.origin}/icon-dark-32x32.png` : undefined
  await eth.request({
    method: 'wallet_addEthereumChain',
    params: [somniaWalletParams(icon)],
  })
  const current = parseChainId(await eth.request({ method: 'eth_chainId' }))
  if (current !== SOMNIA_CHAIN_ID) {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_CHAIN_ID_HEX }],
    })
  }
}

async function ensureSomnia(eth: EthereumProvider) {
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_CHAIN_ID_HEX }],
    })
  } catch (err) {
    if (isUserRejected(err)) throw err
    if (isUnrecognizedChain(err)) {
      await addAndSwitch(eth)
      return
    }
    throw err
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Address | undefined>()
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasProvider, setHasProvider] = useState(false)
  const [error, setError] = useState<ConnectError>(null)
  const [balance, setBalance] = useState('—')
  const providerRef = useRef<EthereumProvider | null>(null)
  const addressRef = useRef<Address | undefined>(undefined)
  addressRef.current = address

  const refreshBalance = useCallback(async (eth: EthereumProvider, next: Address, nextChain: number | null) => {
    if (nextChain !== SOMNIA_CHAIN_ID) {
      setBalance('—')
      return
    }
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
  }, [])

  const applySession = useCallback(
    async (eth: EthereumProvider, accounts: string[], nextChain?: number | null) => {
      const next = accounts[0] as Address | undefined
      const resolvedChain =
        nextChain ?? parseChainId(await eth.request({ method: 'eth_chainId' }).catch(() => null))
      setChainId(resolvedChain)
      if (!next) {
        setAddress(undefined)
        setBalance('—')
        return
      }
      setAddress(next)
      setError(resolvedChain === SOMNIA_CHAIN_ID ? null : 'wrongnet')
      await refreshBalance(eth, next, resolvedChain)
    },
    [refreshBalance],
  )

  useEffect(() => {
    let attached: EthereumProvider | null = null
    const onAccounts = (...args: unknown[]) => {
      const accounts = (args[0] as string[]) ?? []
      const eth = providerRef.current
      if (eth) void applySession(eth, accounts)
    }
    const onChain = (...args: unknown[]) => {
      const next = parseChainId(args[0])
      setChainId(next)
      if (next !== SOMNIA_CHAIN_ID) setError('wrongnet')
      else setError(null)
      const current = providerRef.current
      const currentAddress = addressRef.current
      if (current && currentAddress) void refreshBalance(current, currentAddress, next)
    }
    const onDisconnect = () => {
      setAddress(undefined)
      setChainId(null)
      setBalance('—')
    }

    const attach = (eth: EthereumProvider) => {
      if (attached === eth) return
      if (attached) {
        attached.removeListener?.('accountsChanged', onAccounts)
        attached.removeListener?.('chainChanged', onChain)
        attached.removeListener?.('disconnect', onDisconnect)
      }
      attached = eth
      providerRef.current = eth
      setHasProvider(true)
      eth.on?.('accountsChanged', onAccounts)
      eth.on?.('chainChanged', onChain)
      eth.on?.('disconnect', onDisconnect)
      void eth
        .request({ method: 'eth_accounts' })
        .then((accounts) => applySession(eth, (accounts as string[]) ?? []))
        .catch(() => undefined)
    }

    const boot = () => {
      const eth = discoverProvider()
      if (eth) attach(eth)
      else setHasProvider(false)
    }

    boot()
    const retry = window.setTimeout(boot, 400)
    return () => {
      window.clearTimeout(retry)
      attached?.removeListener?.('accountsChanged', onAccounts)
      attached?.removeListener?.('chainChanged', onChain)
      attached?.removeListener?.('disconnect', onDisconnect)
    }
  }, [applySession, refreshBalance])

  const connect = useCallback(async () => {
    setError(null)
    const eth = providerRef.current ?? discoverProvider()
    if (!eth) {
      setHasProvider(false)
      setError('nowallet')
      if (typeof window !== 'undefined') window.open(METAMASK_DOWNLOAD, '_blank', 'noopener,noreferrer')
      return
    }
    providerRef.current = eth
    setHasProvider(true)
    setIsConnecting(true)
    try {
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[]
      if (!accounts[0]) throw new Error('no account')
      await ensureSomnia(eth)
      await applySession(eth, accounts)
    } catch (err) {
      const code = rpcErrorCode(err)
      if (isUserRejected(err)) {
        setError('rejected')
        return
      }
      if (code === -32002) {
        setError('pending')
        return
      }
      setError('generic')
    } finally {
      setIsConnecting(false)
    }
  }, [applySession])

  const switchToSomnia = useCallback(async () => {
    const eth = providerRef.current ?? discoverProvider()
    if (!eth) {
      setError('nowallet')
      return
    }
    providerRef.current = eth
    setIsConnecting(true)
    setError(null)
    try {
      await ensureSomnia(eth)
      const accounts = (await eth.request({ method: 'eth_accounts' })) as string[]
      await applySession(eth, accounts, SOMNIA_CHAIN_ID)
    } catch (err) {
      if (isUserRejected(err)) setError('rejected')
      else setError('wrongnet')
    } finally {
      setIsConnecting(false)
    }
  }, [applySession])

  const disconnect = useCallback(async () => {
    const eth = providerRef.current
    try {
      await eth?.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      })
    } catch {
      /* older wallets may not support revoke */
    }
    setAddress(undefined)
    setChainId(null)
    setBalance('—')
    setError(null)
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      chainId,
      isConnected: Boolean(address),
      isConnecting,
      isCorrectNetwork: Boolean(address) && chainId === SOMNIA_CHAIN_ID,
      hasProvider,
      error,
      balance,
      connect,
      disconnect,
      switchToSomnia,
      clearError: () => setError(null),
    }),
    [address, chainId, isConnecting, hasProvider, error, balance, connect, disconnect, switchToSomnia],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within <WalletProvider>')
  return ctx
}
