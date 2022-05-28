import React from 'react'
import { useSigner } from 'wagmi'
import { useNotifications } from 'reapop'
import { useQueryClient } from 'react-query'

import { useContracts } from './useContracts'

export function useClaimRewards() {
  const { data: signer } = useSigner()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()

  const claimMarinateRewards = React.useCallback(async () => {
    try {
      if (!signer) {
        throw new Error('no signer')
      }

      const { wait } = await contracts.mumami.claimRewards()
      notify('Claim rewards transaction initiated', 'info')
      await wait()
      notify('Rewards claimed!')
      queryClient.invalidateQueries('rewards')
    } catch (err) {
      notify('Error claiming Marinate rewards')
    }
  }, [signer, contracts, notify, queryClient])

  return { claimMarinateRewards }
}
