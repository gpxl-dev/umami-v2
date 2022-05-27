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
      if (contracts.providerType === 'arb1' || !isArbitrum || !account) {
        return initialData
      }

      const address = account?.address
      const [
        umamiBalance,
        mumamiBalance,
        cmumamiBalance,
        umamiAllowance,
        mumamiAllowance,
        cmumamiAllowance,
      ] = await Promise.all([
        contracts.umami.balanceOf(address),
        contracts.mumami.balanceOf(address),
        contracts.cmumami.balanceOf(address),
        contracts.umami.allowance(address, TOKEN_ADDRESSES.mumami),
        contracts.mumami.allowance(address, TOKEN_ADDRESSES.cmumami),
        contracts.cmumami.allowance(address, TOKEN_ADDRESSES.cmumamiBooster),
      ])

      return {
        umami: umamiAllowance.gt(0) && umamiAllowance.gt(umamiBalance),
        mumami: mumamiAllowance.gt(0) && mumamiAllowance.gt(mumamiBalance),
        cmumami: cmumamiAllowance.gt(0) && cmumamiAllowance.gt(cmumamiBalance),
      }
    } catch (err) {
      console.log(err)
      notify('Unable to fetch token allowances', 'error')
    }
  }, [contracts, isArbitrum, initialData, account, notify])

  return useQuery('allowances', fetchAllowances, {
    initialData: queryClient.getQueryData('allowances') ?? initialData,
    refetchInterval: 40000,
    enabled: !!account && isArbitrum,
  })
}
