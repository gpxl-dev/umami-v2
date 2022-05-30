import React from 'react'
import { ethers } from 'ethers'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useTotalCompoundingMumami() {
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()

  const getCompoundingMumami = React.useCallback(async () => {
    try {
      const [totalDeposits, decimals] = await Promise.all([
        contracts.cmumami.totalDeposits(),
        contracts.cmumami.decimals(),
      ])
      return ethers.utils.formatUnits(totalDeposits, decimals)
    } catch (err) {
      console.log(err)
      notify('Unable to fetch total compounding mUMAMI', 'error')
    }
  }, [contracts, notify])

  return useQuery('totalCompoundingMumami', getCompoundingMumami, {
    initialData: queryClient.getQueryData('totalCompoundingMumami') ?? null,
  })
}
