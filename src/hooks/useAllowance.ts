import { erc20ABI, useContractRead } from 'wagmi'

const useAllowance = (
  tokenAddress?: string,
  ownerAddress?: string,
  spenderAddress?: string
) => {
  const _tokenAddress = tokenAddress?.toLowerCase()
  const _ownerAddress = ownerAddress?.toLowerCase()
  const _spenderAddress = spenderAddress?.toLowerCase()
  return useContractRead(
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
}

export default useAllowance
