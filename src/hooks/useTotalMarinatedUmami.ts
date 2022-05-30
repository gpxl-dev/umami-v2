import React from 'react'
import { ethers } from 'ethers'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useTotalMarinatedUmami() {
  const contracts = useContracts()
  const queryClient = useQueryClient()
  const { notify } = useNotifications()

  const getTotalMarinatedUmami = React.useCallback(async () => {
    try {
      const [totalStaked, decimals] = await Promise.all([
        contracts.mumami.totalStaked(),
        contracts.mumami.decimals(),
      ])
      return ethers.utils.formatUnits(totalStaked, decimals)
    } catch (err) {
      console.log(err)
      notify('Unable to fetch total marinated UMAMI', 'error')
    }
  }, [contracts, notify])

  return useQuery('totalMarinatedUmami', getTotalMarinatedUmami, {
    initialData: queryClient.getQueryData('totalMarinatedUmami') ?? null,
  })
}
