import React from 'react'
import { useQuery } from 'react-query'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { ethers } from 'ethers'

import { useIsArbitrum } from './useIsArbitrum'
import { useContracts } from './useContracts'

export function useBalances() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const initialData = React.useMemo(() => {
    return {
      umami: 0,
      mumami: 0,
      cmumami: 0,
    }
  }, [])

  const fetchBalances = React.useCallback(async () => {
    const address = account?.address
    const [
      umamiBalance,
      mumamiBalance,
      cmumamiBalance,
      umamiDecimals,
      mumamiDecimals,
      cmumamiDecimals,
    ] = await Promise.all([
      contracts.umami.balanceOf(address),
      contracts.mumami.balanceOf(address),
      contracts.cmumami.balanceOf(address),
      contracts.umami.decimals(),
      contracts.mumami.decimals(),
      contracts.cmumami.decimals(),
    ])

    return {
      umami: Number(ethers.utils.formatUnits(umamiBalance, umamiDecimals)),
      mumami: Number(ethers.utils.formatUnits(mumamiBalance, mumamiDecimals)),
      cmumami: Number(
        ethers.utils.formatUnits(cmumamiBalance, cmumamiDecimals)
      ),
    }
  }, [contracts, account])

  return useQuery('balances', fetchBalances, {
    initialData,
    enabled: !!account && isArbitrum,
    onError() {
      notify('Unable to fetch token balances', 'error')
    },
  })
}
