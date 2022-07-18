import { Contract } from 'ethers'
import { useQuery } from 'react-query'
import { erc20ABI, useProvider } from 'wagmi'

type ContractTokenInfo = {
  symbol: string
  decimals: number
}

const useTokenInfo = (tokenContractAddress?: string) => {
  const provider = useProvider()
  const _address = tokenContractAddress?.toLowerCase()

  const fetchTokenInfoByAddress = async () => {
    // NOTE: safe to assert non-empty address here due to `enabled` condition for `useQuery`
    const contract = new Contract(_address!, erc20ABI, provider)
    const [symbol, decimals]: [string, number] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
    ])
    return {
      decimals,
      symbol,
    }
  }

  return useQuery<ContractTokenInfo, Error>(
    ['tokenInfo', _address],
    fetchTokenInfoByAddress,
    {
      enabled: _address != null,
      staleTime: Infinity, // Token info never changes.
    }
  )
}

export default useTokenInfo
