import { defineChain } from 'viem'

/**
 * Somnia Shannon Testnet — EVM L1 (chainId 50312).
 * PLUSE is not live on Somnia Mainnet yet.
 * Source: https://docs.somnia.network/developer/network-info
 */
export const SOMNIA_CHAIN_ID = 50312
export const SOMNIA_CHAIN_ID_HEX = '0xc488'
export const SOMNIA_RPC_URLS = [
  'https://api.infra.testnet.somnia.network',
  'https://dream-rpc.somnia.network',
] as const
export const SOMNIA_EXPLORER = 'https://shannon-explorer.somnia.network'
export const METAMASK_DOWNLOAD = 'https://metamask.io/download/'

export const somnia = defineChain({
  id: SOMNIA_CHAIN_ID,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: {
      http: [...SOMNIA_RPC_URLS],
      webSocket: ['wss://api.infra.testnet.somnia.network/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Shannon Explorer', url: SOMNIA_EXPLORER },
  },
  testnet: true,
})

export function somniaWalletParams(iconUrl?: string) {
  return {
    chainId: SOMNIA_CHAIN_ID_HEX,
    chainName: 'Somnia Testnet',
    nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
    rpcUrls: [...SOMNIA_RPC_URLS],
    blockExplorerUrls: [SOMNIA_EXPLORER],
    ...(iconUrl ? { iconUrls: [iconUrl] } : {}),
  }
}
