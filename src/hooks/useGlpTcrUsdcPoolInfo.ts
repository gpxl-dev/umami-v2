import React from 'react'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useGlpTcrUsdcPoolInfo() {
  const { notify } = useNotifications()

  const contracts = useContracts()

  const initialData: {
    capacity: number;
    totalDeposits: number;
    symbol: string;
    asset: string;
  } = React.useMemo(
    () => ({
      capacity: 0,
      totalDeposits: 0,
      symbol: '',
      asset: '',
    }),
    []
  )

  const getPoolInfo = React.useCallback(async () => {
    const [
      decimals,
      symbol,
      capacity,
      totalDeposits,
      asset,
    ] = await Promise.all([
      contracts.usdc.decimals(),
      contracts.glpTcrUsdcPool.symbol(),
      contracts.glpTcrUsdcPool.cap(),
      contracts.glpTcrUsdcPool.totalAssets(),
      contracts.glpTcrUsdcPool.asset(),
    ])

    return {
      capacity: Number(ethers.utils.formatUnits(capacity, decimals)),
      totalDeposits: Number(ethers.utils.formatUnits(totalDeposits, decimals)),
      symbol,
      asset,
    }
  }, [contracts])

  return useQuery('glpTcrPoolInfo', getPoolInfo, {
    initialData,
    onError() {
      notify('Error fetching GLP/TCR USDC Pool info', 'error')
    },
  })
}
