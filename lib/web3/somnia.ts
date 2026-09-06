import { defineChain } from 'viem'

/**
 * Somnia Shannon Testnet — EVM L1 (chainId 50312).
 * PLUSE is not live on Somnia Mainnet yet.
 * Source: https://docs.somnia.network/developer/network-info
 */
export const somnia = defineChain({
  id: 50312,
  name: 'Somnia Shannon Testnet',
  nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.infra.testnet.somnia.network'],
      webSocket: ['wss://api.infra.testnet.somnia.network/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Shannon Explorer', url: 'https://shannon-explorer.somnia.network' },
  },
})

export const SOMNIA_WALLET_PARAMS = {
  chainId: '0xc488',
  chainName: 'Somnia Shannon Testnet',
  nativeCurrency: { name: 'Somnia Test Token', symbol: 'STT', decimals: 18 },
  rpcUrls: ['https://api.infra.testnet.somnia.network'],
  blockExplorerUrls: ['https://shannon-explorer.somnia.network'],
} as const

export const DEMO_ADDRESS = '0x3Fa8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6' as const
