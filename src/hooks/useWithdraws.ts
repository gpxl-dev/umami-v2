import { ethers } from 'ethers'
import { useNotifications } from 'reapop'
import { useMutation, useQueryClient } from 'react-query'
import { useAccount } from 'wagmi'

import { useContracts } from './useContracts'
import { useMarinateWithdrawStatus } from './useMarinateWithdrawStatus'
import { useIsArbitrum } from './useIsArbitrum'

export function useWithdraws() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const { data: marinateWithdrawStatus } = useMarinateWithdrawStatus()
  const isArbitrum = useIsArbitrum()

  const { mutate: withdrawMarinatedUmami } = useMutation(
    async () => {
      if (!contracts.signer) {
        notify('Unable to sign transaction to withdraw UMAMI', 'error')
        throw new Error('No signer')
      }

      if (!marinateWithdrawStatus?.withdrawEnabled) {
        notify(
          'Withdrawing marinated UMAMI is not enabled at this time',
          'error'
        )
        throw new Error('Withdraw not enabled')
      }

      if (!isArbitrum) {
        notify(
          'Please switch network to Arbitrum to withdraw your UMAMI',
          'error'
        )
        throw new Error('wrong network')
      }

      const { wait } = await contracts.mumami.withdraw()
      await wait()
    },
    {
      onMutate() {
        notify('Withdraw transaction initiated', 'info')
      },
      onSuccess() {
        notify('UMAMI withdrawn!')
        queryClient.invalidateQueries('balances')
      },
      onError() {
        notify(
          'Unable to withdraw UMAMI as this time, please try again.',
          'error'
        )
      },
    }
  )

  const { mutate: withdrawCompoundingMumami } = useMutation(
    async (amount: string) => {
      if (!isArbitrum) {
        notify('Please connect to Arbitrum to withdraw cmUMAMI', 'error')
        throw new Error('wrong network')
      }

      if (!contracts.signer) {
        notify('Please connect wallet to withdraw cmUMAMI', 'error')
        throw new Error('No signer')
      }

      const decimals = await contracts.cmumami.decimals()
      const withdrawAmount = ethers.utils.parseUnits(amount, decimals)
      const { wait } = await contracts.cmumami.withdraw(withdrawAmount)
      await wait()
    },
    {
      onMutate() {
        notify('Withdraw transaction initiated', 'info')
      },
      onSuccess() {
        notify('cmUMAMI Withdrawn!', 'success')
        queryClient.invalidateQueries('balances')
      },
      onError() {
        notify(
          'Unable to withdraw cmUMAMI at this time. Please try again.',
          'error'
        )
      },
    }
  )

  const { mutate: previewUSDCWithdraw } = useMutation(
    async (amount: string) => {
      if (!account || !isArbitrum) {
        notify('Please connect wallet on Arbitrum to deposit USDC', 'error')
        throw new Error('No account or wrong network')
      }
      const decimals = await contracts.glpTcrUsdcPool.decimals()
      const withdrawAmount = ethers.utils.parseUnits(amount, decimals)
      const previewAmount = await contracts.glpTcrUsdcPool.previewWithdraw(
        withdrawAmount
      )

      return ethers.utils.formatUnits(previewAmount, decimals)
    },
    {
      onSuccess(data) {
        queryClient.setQueryData('usdcWithdrawPreview', data)
      },
      onError() {
        notify('Unable to preview USDC withdraw at this time', 'error')
      },
    }
  )

  const initiateUsdcWithdrawFromGlpTcrPool = useMutation(
    async (amount: string) => {
      if (!account || !isArbitrum) {
        notify(
          'Please connect wallet on Arbitrum to initiate USDC withdrawal',
          'error'
        )
        throw new Error('No account or wrong network')
      }
      const decimals = await contracts.usdc.decimals()
      const withdrawAmount = ethers.utils.parseUnits(amount, decimals)
      const { wait } = await contracts.glpTcrUsdcPool[
        'initiateWithdraw(uint256)'
      ](withdrawAmount)
      await wait()
    },
    {
      onMutate() {
        notify('Initiate withdrawal transaction initiated', 'info')
      },
      onSuccess() {
        notify('USDC Withdrawal Initiated!', 'success')
        queryClient.invalidateQueries(['balances', 'glpTcrUsdcPoolUserInfo'])
      },
      onError() {
        notify('Unable to initiate USDC withdrawal at this time', 'error')
      },
    }
  )

  return {
    withdrawMarinatedUmami,
    withdrawCompoundingMumami,
    previewUSDCWithdraw,
    initiateUsdcWithdrawFromGlpTcrPool,
  }
}
