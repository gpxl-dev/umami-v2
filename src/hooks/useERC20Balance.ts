import { useEffect } from 'react'
import { erc20ABI, useAccount, useContractRead } from 'wagmi'

const useERC20Balance = (tokenAddress?: string, ownerAddress?: string) => {
  const { data } = useAccount()
  const connectedAccount = data?.address
  const _tokenAddress = tokenAddress?.toLowerCase()
  const _ownerAddress =
    ownerAddress?.toLowerCase() || connectedAccount?.toLowerCase()

  const enabled = !!(_tokenAddress && _ownerAddress)

  const contractRead = useContractRead(
    {
      addressOrName: _tokenAddress?.toLowerCase() || '',
      contractInterface: erc20ABI,
    },
    'balanceOf',
    {
      args: [_ownerAddress],
      watch: false,
      cacheTime: 30 * 1000 * 60,
      staleTime: 1000 * 30,
      cacheOnBlock: false,
      enabled,
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

export default useERC20Balance
