import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'

import { useIsArbitrum } from './useIsArbitrum'
import { useContracts } from './useContracts'
import { TOKEN_ADDRESSES } from '../constants'

export function useAllowances() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const initialData = React.useMemo(() => {
    return {
      umami: false,
      mumami: false,
      cmumami: false,
    }
  }, [])

  const fetchAllowances = React.useCallback(async () => {
    try {
      const address = account?.address
      const [
        umamiBalance,
        mumamiBalance,
        umamiAllowance,
        mumamiAllowance,
      ] = await Promise.all([
        contracts.umami.balanceOf(address),
        contracts.mumami.balanceOf(address),
        contracts.umami.allowance(address, TOKEN_ADDRESSES.mumami),
        contracts.mumami.allowance(address, TOKEN_ADDRESSES.cmumami),
      ])

      return {
        umami: umamiAllowance.gt(0) && umamiAllowance.gt(umamiBalance),
        mumami: mumamiAllowance.gt(0) && mumamiAllowance.gt(mumamiBalance),
      }
    } catch (err) {
      console.log(err)
      notify('Unable to fetch token allowances', 'error')
      return initialData
    }
  }, [contracts, initialData, account, notify])

  return useQuery('allowances', fetchAllowances, {
    initialData: queryClient.getQueryData('allowances') ?? initialData,
    enabled: !!account && isArbitrum,
  })
}
