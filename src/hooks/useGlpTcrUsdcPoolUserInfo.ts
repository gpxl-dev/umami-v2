import React from 'react'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import { useAccount } from 'wagmi'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useGlpTcrUsdcPoolUserInfo() {
  const { data: account } = useAccount()
  // const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const getUserInfo = React.useCallback(async () => {
    const [balance, withdrawals, vaultState, decimals] = await Promise.all([
      contracts.glpTcrUsdcPool.balanceOf(account?.address),
      contracts.glpTcrUsdcPool.withdrawals(account?.address),
      contracts.glpTcrUsdcPool.vaultState(),
      contracts.glpTcrUsdcPool.decimals(),
    ])

    return {
      balance: Number(ethers.utils.formatUnits(balance, decimals)),
      vaultState: {
        round: vaultState.round.toNumber(),
        epochStart: vaultState.epochStart.toNumber(),
        epochEnd: vaultState.epochEnd.toNumber(),
        lastLockedAmount: vaultState.lastLockedAmount.toNumber(),
        lockedAmount: vaultState.lockedAmount.toNumber(),
        queuedWithdrawShares: vaultState.queuedWithdrawShares.toNumber(),
        totalPending: vaultState.totalPending.toNumber(),
      },
      withdrawals: {
        round: withdrawals.round,
        shares: withdrawals['shares'].toNumber(),
      },
    }
  }, [account, contracts])

  return useQuery('glpTcrUsdcPoolUserInfo', getUserInfo, {
    enabled: isArbitrum,
    initialData: {
      balance: 0,
      vaultState: {
        round: 0,
        epochStart: 0,
        epochEnd: 0,
        lastLockedAmount: 0,
        lockedAmount: 0,
        queuedWithdrawShares: 0,
        totalPending: 0,
      },
      withdrawals: {
        round: 0,
        shares: 0,
      },
    },
  })
}
