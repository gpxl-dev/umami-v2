import { erc20ABI, useContractRead } from 'wagmi'

const useERC20Balance = (tokenAddress?: string, ownerAddress?: string) => {
  const _tokenAddress = tokenAddress?.toLowerCase()
  const _ownerAddress = ownerAddress?.toLowerCase()
  return useContractRead(
    {
      addressOrName: _tokenAddress?.toLowerCase() || '',
      contractInterface: erc20ABI,
    },
    'balanceOf',
    {
      args: [_ownerAddress],
      watch: true,
      staleTime: 10 * 1000,
    }
  )
}

export default useERC20Balance
