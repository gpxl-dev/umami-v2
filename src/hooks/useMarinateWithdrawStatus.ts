import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'
import { useAccount } from 'wagmi'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useMarinateWithdrawStatus() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const getWithdrawStatus = React.useCallback(async () => {
    try {
      if (!contracts?.mumami) {
        return false
      }

      return await contracts?.mumami.withdrawEnabled()
    } catch (err) {
      console.log(err)
      notify('Unable to check if Marinate withdraw is enabled')
    }
  }, [contracts, notify])

  return useQuery('marinateWithdrawEnabled', getWithdrawStatus, {
    initialData:
      queryClient.getQueryData('marinateWithdrawEnabled') ?? false,
    enabled: !!account && isArbitrum,
  })
}
