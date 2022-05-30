import React from 'react'
import { ethers } from 'ethers'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useCompoundTokensPerShare() {
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()

  const getCompoundTokensPerShare = React.useCallback(async () => {
    try {
      const decimals = await contracts.cmumami.decimals()

      const bigNumber1 = ethers.utils.parseUnits('1.0', decimals)

      const tokensPerShare = await contracts.cmumami.getDepositTokensForShares(
        bigNumber1
      )

      return ethers.utils.parseUnits(tokensPerShare, decimals)
    } catch (err) {
      console.log(err)
      notify('Unable to fetch Compound tokens per share', 'error')
    }
  }, [contracts, notify])

  return useQuery('compoundTokensPerShare', getCompoundTokensPerShare, {
    initialData: queryClient.getQueryData('compoundTokensPerShare') ?? null,
  })
}
