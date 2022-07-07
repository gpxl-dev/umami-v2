import React from 'react'
import { useQuery, useQueryClient } from 'react-query'

export function useUsdcDepositPreview() {
  const queryClient = useQueryClient()

  const getPreviewFromCache = React.useCallback(
    () => queryClient.getQueryData('usdcDepositPreview'),
    [queryClient]
  )

  return useQuery('usdcDepositPreview', getPreviewFromCache)
}
