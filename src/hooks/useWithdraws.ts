import React from 'react'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'
import { useMarinateWithdrawStatus } from './useMarinateWithdrawStatus'

export function useWithdraws() {
  const { notify } = useNotifications()
  const contracts = useContracts()
  const { data: marinateWithdrawEnabled } = useMarinateWithdrawStatus()

  const withdrawMarinatedUmami = React.useCallback(async () => {
    try {
      if (!contracts.signer) {
        notify('Unable to sign transaction to withdraw UMAMI', 'error')
        throw new Error('No signer')
      }

      if (!marinateWithdrawEnabled) {
        notify('Withdrawing marinated UMAMI is not enabled at this time')
        throw new Error('Withdraw not enabled')
      }

      await contracts.mumami.withdraw()
      notify('Withdraw transaction initiated', 'info')
    } catch (err) {
      console.log(err)
      notify(
        'Unable to withdraw UMAMI at this time. Please try again.',
        'error'
      )
    }
  }, [contracts, marinateWithdrawEnabled, notify])

  return { withdrawMarinatedUmami }
}
