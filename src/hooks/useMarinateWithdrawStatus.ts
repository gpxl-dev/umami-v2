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
    const withdrawEnabled = await contracts?.mumami.withdrawEnabled()
    return { withdrawEnabled }
  }, [contracts])

  return useQuery('marinateWithdrawEnabled', getWithdrawStatus, {
    initialData: queryClient.getQueryData('marinateWithdrawEnabled') ?? {
      withdrawEnabled: false,
    },
    enabled: !!account && isArbitrum && !!contracts.mumami,
    onError() {
      notify('Unable to check if Marinate withdraw is enabled', 'error')
    }
  })
}
