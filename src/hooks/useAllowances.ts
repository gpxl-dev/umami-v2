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
      usdc: false,
    }
  }, [])

  const fetchAllowances = React.useCallback(async () => {
    const address = account?.address
    const [umamiBalance, mumamiBalance, usdcBalance, umamiAllowance, mumamiAllowance, usdcAllowance] =
      await Promise.all([
        contracts.umami.balanceOf(address),
        contracts.mumami.balanceOf(address),
        contracts.usdc.balanceOf(address),
        contracts.umami.allowance(address, TOKEN_ADDRESSES.mumami),
        contracts.mumami.allowance(address, TOKEN_ADDRESSES.cmumami),
        contracts.usdc.allowance(address, TOKEN_ADDRESSES.glpTcrUsdcPool),
      ])

    return {
      umami: umamiAllowance.gt(0) && umamiAllowance.gt(umamiBalance),
      mumami: mumamiAllowance.gt(0) && mumamiAllowance.gt(mumamiBalance),
      usdc: usdcAllowance.gt(0) && usdcAllowance.gt(usdcBalance),
    }
  }, [contracts, account])

  return useQuery('allowances', fetchAllowances, {
    initialData: queryClient.getQueryData('allowances') ?? initialData,
    enabled: !!account && isArbitrum,
    onError() {
      notify('Unable to fetch token allowances', 'error')
    },
  })
}
