import { useSigner } from 'wagmi'
import { useNotifications } from 'reapop'
import { useMutation, useQueryClient } from 'react-query'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useClaimRewards() {
  const { data: signer } = useSigner()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const { mutate: claimMarinateRewards } = useMutation(
    async () => {
      if (!signer) {
        throw new Error('no signer')
      }

      if (!isArbitrum) {
        notify(
          'Please switch network to Arbitrum to claim your rewards',
          'error'
        )
        throw new Error('wrong network')
      }

      const { wait } = await contracts.mumami.claimRewards()
      await wait()
    },
    {
      onMutate() {
        notify('Claim rewards transaction initiated', 'info')
      },
      onSuccess() {
        notify('Rewards claimed!', 'success')
        queryClient.invalidateQueries('rewards')
      },
      onError() {
        notify('Error claiming Marinate rewards')
      },
    }
  )

  return { claimMarinateRewards }
}
