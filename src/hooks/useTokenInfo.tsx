import { BigNumber, Contract } from 'ethers'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { erc20ABI, useProvider } from 'wagmi'

type ContractTokenInfo = {
  symbol: string
  decimals: number
}

const useTokenInfo = (tokenContractAddress: string) => {
  const provider = useProvider()
  const _address = tokenContractAddress.toLowerCase()

  const fetchTokenInfoByAddress: () => Promise<ContractTokenInfo> =
    useCallback(async () => {
      const contract = new Contract(_address, erc20ABI, provider)
      const [symbol, decimals]: [string, BigNumber] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ])
      return {
        decimals: decimals.toNumber(),
        symbol,
      }
    }, [_address, provider])

  return useQuery<ContractTokenInfo, Error>([
    'tokenInfo',
    _address,
    fetchTokenInfoByAddress,
  ])
}

export default useTokenInfo
