import React from 'react'
import { useAccount, useNetwork } from 'wagmi'

import { ARBITRUM_ID } from '../constants'

export function useIsArbitrum() {
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()

  return React.useMemo(() => {
    return account && activeChain && activeChain?.id === ARBITRUM_ID
  }, [activeChain, account])
}
