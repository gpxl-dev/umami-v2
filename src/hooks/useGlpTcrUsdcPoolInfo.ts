import React from 'react'
import { ethers } from 'ethers'
// import { useAccount } from 'wagmi'
import { useQuery } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useGlpTcrUsdcPoolInfo() {
  // const { data: account } = useAccount()
  const { notify } = useNotifications()

  const contracts = useContracts()
  console.log(contracts.glpTcrUsdcPool)

  const initialData: {
    capacity: number;
    totalDeposits: number;
    symbol: string;
    asset: string;
    /* balance: number;
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
    }; */
  } = React.useMemo(
    () => ({
      capacity: 0,
      totalDeposits: 0,
      symbol: '',
      asset: '',
      /* balance: 0,
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
      }, */
    }),
    []
  )

  const getPoolInfo = React.useCallback(async () => {
    const [
      // balance,
      // vaultState,
      // withdrawals,
      decimals,
      symbol,
      capacity,
      totalDeposits,
      asset,
    ] = await Promise.all([
      // contracts.glpTcrUsdcPool.balanceOf(account?.address),
      // contracts.glpTcrUsdcPool.vaultState(),
      // contracts.glpTcrUsdcPool.withdrawals(account?.address),
      contracts.usdc.decimals(),
      contracts.glpTcrUsdcPool.symbol(),
      contracts.glpTcrUsdcPool.cap(),
      contracts.glpTcrUsdcPool.totalAssets(),
      contracts.glpTcrUsdcPool.asset(),
    ])
    /* const balanceConverted = Number(
      ethers.utils.formatUnits(balance, decimals)
    )
    const userShares = await contracts.glpTcrUsdcPool.convertToAssets(
      balanceConverted
    ) */

    return {
      capacity: Number(ethers.utils.formatUnits(capacity, decimals)),
      totalDeposits: Number(ethers.utils.formatUnits(totalDeposits, decimals)),
      symbol,
      asset,
      /* balance: balanceConverted,
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
      }, */
    }
  }, [contracts, /* account */])

  return useQuery('glpTcrPoolInfo', getPoolInfo, {
    initialData,
    onError() {
      notify('Error fetching GLP/TCR USDC Pool info', 'error')
    },
  })
}
