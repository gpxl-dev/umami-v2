import React from 'react'
import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { INFURA_RPC_URL } from '../constants'

const providers = []

if (process.env.NODE_ENV === 'development') {
  providers.push(
    infuraProvider({
      infuraId: process.env.REACT_PUBLIC_INFURA_ID,
      pollingInterval: 10000,
    })
  )
} else {
  providers.push(
    infuraProvider({
      infuraId: process.env.REACT_PUBLIC_PROD_ID,
      pollingInterval: 10000,
    })
  )
}
console.log(providers)

const { chains, provider } = configureChains(
  [chain.arbitrum],
  [...providers, publicProvider({ pollingInterval: 10000 })],
  { stallTimeout: 30000 }
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'umami.finance',
        jsonRpcUrl: INFURA_RPC_URL,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          1: INFURA_RPC_URL,
        },
      },
    }),
  ],
  provider,
})

type Props = {
  children: React.ReactNode;
};

export default function WagmiProvider({ children }: Props) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
