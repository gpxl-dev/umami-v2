import React from 'react'
import { useSigner } from 'wagmi'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useClaimRewards() {
  const { data: signer } = useSigner()
  const { notify } = useNotifications()

  const contracts = useContracts()

  const claimMarinateRewards = React.useCallback(async () => {
    try {
      if (!signer) {
        throw new Error('no signer')
      }

      await contracts.mumami.claimRewards()
      notify('Claim rewards transaction initiated', 'info')
    } catch (err) {
      notify('Error claiming Marinate rewards')
    }
  }, [signer, contracts, notify])

  return { claimMarinateRewards }
}
