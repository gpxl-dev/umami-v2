import React from 'react'
import { ethers } from 'ethers'
import { useNotifications } from 'reapop'
import { useQueryClient } from 'react-query'

import { useContracts } from './useContracts'
import { useMarinateWithdrawStatus } from './useMarinateWithdrawStatus'
import { useIsArbitrum } from './useIsArbitrum'

export function useWithdraws() {
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const { data: marinateWithdrawStatus } = useMarinateWithdrawStatus()
  const isArbitrum = useIsArbitrum()

  const withdrawMarinatedUmami = React.useCallback(async () => {
    try {
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
      notify('Withdraw transaction initiated', 'info')
      await wait()
      notify('UMAMI withdrawn!')
      queryClient.invalidateQueries('balances')
    } catch (err) {
      console.log(err)
      notify(
        'Unable to withdraw UMAMI at this time. Please try again.',
        'error'
      )
    }
  }, [contracts, isArbitrum, marinateWithdrawStatus, notify, queryClient])

  const withdrawCompoundingMumami = React.useCallback(
    async (amount: string) => {
      try {
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
        notify('Withdraw transaction initiated', 'info')
        await wait()
        notify('cmUMAMI Withdrawn!', 'success')
        queryClient.invalidateQueries('balances')
      } catch (err) {
        console.log(err)
        notify(
          'Unable to withdraw cmUMAMI at this time. Please try again.',
          'error'
        )
      }
    },
    [contracts, isArbitrum, notify, queryClient]
  )

  return { withdrawMarinatedUmami, withdrawCompoundingMumami }
}
