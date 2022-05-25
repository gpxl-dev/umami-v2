import React from 'react'
import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const infuraId = process.env.REACT_APP_INFURA_ID

const { chains, provider } = configureChains(
	[chain.arbitrum],
	[
		infuraProvider({ infuraId, priority: 0 }),
		alchemyProvider({ alchemyId: '', priority: 0 }),
	]
)

const wagmiClient = createClient({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({ chains }),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: 'umami.finance',
				jsonRpcUrl: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`,
			},
		}),
		new WalletConnectConnector({
			chains,
			options: {
				qrcode: true,
				rpc: {
					1: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`,
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
