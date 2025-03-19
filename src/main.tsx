import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, walletConnectWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import binanceWallet from '@binance/w3w-rainbow-connector-v2'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App'
import './index.css'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string

// Define Sepolia chain with proper RPC URL
const chains = [
  {
    ...sepolia,
    rpcUrls: {
      ...sepolia.rpcUrls,
      default: { http: ['https://eth-sepolia.api.onfinality.io/public'] },
      public: { http: ['https://eth-sepolia.api.onfinality.io/public'] },
    },
  },
] as const

// Create transport for Sepolia
const transports = {
  [sepolia.id]: http('https://eth-sepolia.api.onfinality.io/public', {
    batch: true,
    retryCount: 3,
  }),
}

// Create wagmi config with Sepolia transport
const config = createConfig({
  chains,
  transports,
  connectors: connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [
          metaMaskWallet,
          walletConnectWallet,
          binanceWallet,
          injectedWallet,
        ],
      },
    ],
    {
      appName: 'NFT Marketplace',
      projectId,
    }
  ),
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
