import { BigNumberish } from 'ethers'
import { erc20ABI, useContractWrite } from 'wagmi'

const useApproveERC20 = (
  tokenAddress: string,
  spenderAddress: string,
  amount: BigNumberish
) => {
  return useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
    },
    'approve',
    {
      args: [spenderAddress, amount],
      onSuccess: () => {
        // TODO: invalidate allowance query.
      },
    }
  )
}

export default useApproveERC20
