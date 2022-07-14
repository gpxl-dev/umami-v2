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
    const [balance, withdrawals, vaultState, decimals, usdcDecimals] =
      await Promise.all([
        contracts.glpTcrUsdcPool.balanceOf(account?.address),
        contracts.glpTcrUsdcPool.withdrawals(account?.address),
        contracts.glpTcrUsdcPool.vaultState(),
        contracts.glpTcrUsdcPool.decimals(),
        contracts.usdc.decimals(),
      ])

    const queuedWithdrawShares = Number(
      ethers.utils.formatUnits(vaultState.queuedWithdrawShares, usdcDecimals)
    )
    const isWithdrawalActive = withdrawals.round <= vaultState.round

    return {
      balance: Number(ethers.utils.formatUnits(balance, decimals)),
      isWithdrawalActive,
      isWithdrawalReady: withdrawals.round > vaultState.round,
      vaultState: {
        round: vaultState.round.toNumber(),
        epochStart: vaultState.epochStart.toNumber() * 1000,
        epochEnd: vaultState.epochEnd.toNumber() * 1000,
        lastLockedAmount: Number(
          ethers.utils.formatUnits(vaultState.lastLockedAmount, usdcDecimals)
        ),
        lockedAmount: Number(
          ethers.utils.formatUnits(vaultState.lockedAmount, usdcDecimals)
        ),
        queuedWithdrawShares,
        totalPending: vaultState.totalPending.toNumber(),
      },
      withdrawals: {
        round: withdrawals.round,
        shares: Number(
          ethers.utils.formatUnits(withdrawals['shares'], usdcDecimals)
        ),
      },
    }
  }, [account, contracts])

  return useQuery('glpTcrUsdcPoolUserInfo', getUserInfo, {
    enabled: isArbitrum,
    initialData: {
      balance: 0,
      isWithdrawalActive: false,
      isWithdrawalReady: false,
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
