import React from 'react'
import { useQuery, useQueryClient } from 'react-query'

export function useUsdcWithdrawPreview() {
  const queryClient = useQueryClient()

  const getPreviewFromCache = React.useCallback(
    () => queryClient.getQueryData('usdcWithdrawPreview'),
    [queryClient]
  )

  return useQuery('usdcWithdrawPreview', getPreviewFromCache)
}
