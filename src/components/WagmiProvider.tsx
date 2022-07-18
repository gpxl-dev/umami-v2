import React from 'react'
import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { INFURA_RPC_URL } from '../constants'

const providers = []

if (process.env.NODE_ENV === 'development') {
  if (process.env.REACT_APP_INFURA_ID) {
    providers.push(
      infuraProvider({
        infuraId: process.env.REACT_APP_INFURA_ID,
        pollingInterval: 10000,
      })
    )
  }
  if (process.env.REACT_APP_ALCHEMY_ID) {
    providers.push(
      alchemyProvider({
        alchemyId: process.env.REACT_APP_ALCHEMY_ID,
        pollingInterval: 10000,
      })
    )
  }
} else {
  providers.push(
    infuraProvider({
      infuraId: process.env.REACT_APP_PROD_ID,
      pollingInterval: 10000,
    })
  )
}

const { chains, provider } = configureChains(
  [chain.arbitrum],
  [...providers, publicProvider({ pollingInterval: 10000 })],
  { stallTimeout: 30000 }
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser Wallet',
        shimDisconnect: true,
      },
    }),
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
  children: React.ReactNode
}

export default function WagmiProvider({ children }: Props) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
