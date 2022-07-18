import { useEffect } from 'react'
import { erc20ABI, useContractRead } from 'wagmi'

const useAllowance = (
  tokenAddress?: string,
  ownerAddress?: string,
  spenderAddress?: string
) => {
  const _tokenAddress = tokenAddress?.toLowerCase()
  const _ownerAddress = ownerAddress?.toLowerCase()
  const _spenderAddress = spenderAddress?.toLowerCase()

  const enabled = !!(_tokenAddress && _ownerAddress && _spenderAddress)

  const contractRead = useContractRead(
    {
      addressOrName: _tokenAddress?.toLowerCase() || '',
      contractInterface: erc20ABI,
    },
    'allowance',
    {
      args: [_ownerAddress, _spenderAddress],
      enabled: !!(_tokenAddress && _ownerAddress && _spenderAddress),
      watch: true,
      staleTime: 5000,
    }
  )

  useEffect(() => {
    let interval: any
    if (enabled) {
      interval = setInterval(contractRead.refetch, 10 * 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [contractRead.refetch, enabled])

  return contractRead
}

export default useAllowance
