import React from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useQuery } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useGlpTcrUsdcPoolInfo() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()

  const isArbitrum = useIsArbitrum()
  const contracts = useContracts()

  const initialData = React.useMemo(
    () => ({
      balance: 0,
      userShares: 0,
      vaultState: null,
      withdrawals: null,
    }),
    []
  )

  const getPoolInfo = React.useCallback(async () => {
    const [balance, vaultState, withdrawals, decimals] = await Promise.all([
      contracts.glpTcrUsdcPool.balanceOf(account?.address),
      contracts.glpTcrUsdcPool.vaultState(),
      contracts.glpTcrUsdcPool.withdrawals(account?.address),
      contracts.glpTcrUsdcPool.decimals(),
    ])
    const balanceConverted = Number(
      ethers.utils.formatUnits(balance, decimals)
    )
    const userShares = await contracts.glpTcrUsdcPool.convertToAssets(
      balanceConverted
    )

    return {
      balance: balanceConverted,
      userShares: Number(ethers.utils.formatUnits(userShares, decimals)),
      vaultState,
      withdrawals,
    }
  }, [contracts, account])

  return useQuery('glpTcrPoolInfo', getPoolInfo, {
    enabled: !!account && isArbitrum,
    initialData,
    onError() {
      notify('Error fetching GLP/TCR USDC Pool info', 'error')
    },
  })
}
