import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useMarinateWithdrawStatus() {
  const { notify } = useNotifications()
  const queryClient = useQueryClient()
  const contracts = useContracts()

  const initialData = React.useMemo(() => ({ withdrawEnabled: false }), [])

  const getWithdrawStatus = React.useCallback(async () => {
    try {
      if (!contracts?.mumami) {
        return initialData
      }

      return await contracts?.mumami.withdrawEnabled()
    } catch (err) {
      console.log(err)
      notify('Unable to check if Marinate withdraw is enabled')
    }
  }, [contracts, initialData, notify])

  return useQuery('marinateWithdrawEnabled', getWithdrawStatus, {
    initialData:
      queryClient.getQueryData('marinateWithdrawEnabled') ?? initialData,
  })
}
