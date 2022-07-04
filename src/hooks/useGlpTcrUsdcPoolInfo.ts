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

  const initialData: {
    symbol: string;
    balance: number;
    userShares: number;
    vaultState: {
      epochStart: number;
      lastLockedAmount: number;
      round: number;
      totalPending: number;
    };
    withdrawals: {
      round: number;
      shares: number;
    };
  } = React.useMemo(
    () => ({
      symbol: '',
      balance: 0,
      userShares: 0,
      vaultState: {
        epochStart: 0,
        lastLockedAmount: 0,
        round: 0,
        totalPending: 0,
      },
      withdrawals: {
        round: 0,
        shares: 0,
      },
    }),
    []
  )

  const getPoolInfo = React.useCallback(async () => {
    console.log(contracts.glpTcrUsdcPool)
    const [balance, vaultState, withdrawals, decimals, symbol] =
      await Promise.all([
        contracts.glpTcrUsdcPool.balanceOf(account?.address),
        contracts.glpTcrUsdcPool.vaultState(),
        contracts.glpTcrUsdcPool.withdrawals(account?.address),
        contracts.glpTcrUsdcPool.decimals(),
        contracts.glpTcrUsdcPool.symbol(),
      ])
    const balanceConverted = Number(
      ethers.utils.formatUnits(balance, decimals)
    )
    const userShares = await contracts.glpTcrUsdcPool.convertToAssets(
      balanceConverted
    )

    return {
      symbol,
      balance: balanceConverted,
      userShares: Number(ethers.utils.formatUnits(userShares, decimals)),
      vaultState: {
        epochStart: vaultState.epochStart.toNumber(),
        lastLockedAmount: vaultState.lastLockedAmount.toNumber(),
        round: vaultState.round.toNumber(),
        totalPending: vaultState.totalPending.toNumber(),
      },
      withdrawals: {
        round: withdrawals.round,
        shares: Number(ethers.utils.formatUnits(withdrawals.shares, decimals)),
      },
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
