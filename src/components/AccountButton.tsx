import React from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useNotifications } from 'reapop'

import Button from './Button'
import Modal from './Modal'
import { ARBITRUM_ID } from '../constants'

export default function AccountButton() {
  const { connect, connectors: wagmiConnectors } = useConnect({
    onBeforeConnect() {
      notify('Connecting to wallet', 'info')
    },
    onConnect() {
      notify('Connected to wallet', 'success')
    },
    onError() {
      notify('Error connecting to wallet', 'error')
    }
  })
  const { disconnect } = useDisconnect({
    onSuccess() {
      notify('Disconnected from wallet', 'success')
    }
  })
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const { notify } = useNotifications()

  const isArbitrum = React.useMemo(() => {
    return account && activeChain && activeChain?.id === ARBITRUM_ID
  }, [activeChain, account])

  const triggerButton = React.useMemo(() => {
    if (account && !isArbitrum) {
      return (
        <Button className="md:text-sm md:max-w-[10rem] text-red-600">
          Wrong Network!
        </Button>
      )
    }

    return (
      <Button className="md:text-sm md:max-w-[8rem]">
        {account
          ? `${account?.address
              ?.replace('0x', '')
              .slice(0, 4)}...${account?.address?.slice(
              -4,
              account?.address.length
            )}`
          : 'Connect'}
      </Button>
    )
  }, [account, isArbitrum])

  const connectors = React.useMemo(() => {
    return wagmiConnectors.filter((conn) => conn.ready) ?? []
  }, [wagmiConnectors])

  const modalTitle = React.useMemo(() => {
    return account ? 'Account' : 'Select a Wallet'
  }, [account])

  const getConnectorLogo = React.useCallback((name: string) => {
    switch (name) {
      case 'MetaMask':
        return '/assets/metamask.svg'
      case 'Coinbase Wallet':
        return '/assets/coinbase-wallet.svg'
      case 'WalletConnect':
        return '/assets/wallet-connect.svg'
      default:
        return null
    }
  }, [])

  const connectOptions = React.useMemo(() => {
    return (
      <ul>
        {connectors.map((conn) => (
          <li key={conn.id} className="mt-4">
            <button
              type="button"
              className="w-full py-4 flex items-center justify-center bg-white bg-opacity-5 rounded-md duration-200 hover:bg-opacity-10"
              onClick={() => connect(conn)}
            >
              {getConnectorLogo(conn.name) ? (
                <img
                  src={getConnectorLogo(conn.name) as string}
                  alt=""
                  className="w-5 h-5 object-contain mr-2"
                />
              ) : null}
              {conn.name}
            </button>
          </li>
        ))}
      </ul>
    )
  }, [connectors, getConnectorLogo, connect])

  const accountDisplay = React.useMemo(() => {
    return (
      <a
        href={`https://arbiscan.io/address/${account?.address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-8 hover:underline"
      >
        <div className="flex items-center justify-center">
          <div className="mr-2">
            <span>View {account?.address?.replace('0x', '').slice(0, 6)}</span>
            <span> on Arbiscan</span>
          </div>
          <FaExternalLinkAlt />
        </div>
      </a>
    )
  }, [account])

  const disconnectButton = React.useMemo(() => {
    return account ? (
      <Button onClick={disconnect} className="mt-8">
        Disconnect
      </Button>
    ) : null
  }, [account, disconnect])

  return (
    <Modal trigger={triggerButton}>
      <strong className="block text-center text-lg w-full">{modalTitle}</strong>
      {account ? accountDisplay : connectOptions}
      {disconnectButton}
    </Modal>
  )
}
