import { defineChain } from 'viem'

export const somnia = defineChain({
  id: 5031,
  name: 'Somnia Mainnet',
  nativeCurrency: { name: 'Somnia', symbol: 'SOMI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.infra.mainnet.somnia.network'],
      webSocket: ['wss://api.infra.mainnet.somnia.network/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
})

export const SOMNIA_WALLET_PARAMS = {
  chainId: '0x13a7',
  chainName: 'Somnia Mainnet',
  nativeCurrency: { name: 'Somnia', symbol: 'SOMI', decimals: 18 },
  rpcUrls: ['https://api.infra.mainnet.somnia.network'],
  blockExplorerUrls: ['https://explorer.somnia.network'],
} as const

export const DEMO_ADDRESS = '0x3Fa8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6' as const
