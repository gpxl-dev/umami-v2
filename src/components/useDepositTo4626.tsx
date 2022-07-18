import { BigNumberish } from 'ethers'
import { useAccount, useContractWrite } from 'wagmi'
import ERC4626Abi from '../abis/ERC4626.abi'

const useDepositTo4626 = (
  vaultAddress: string,
  amount: BigNumberish,
  receiver?: string
) => {
  const { data } = useAccount()
  const connectedAccount = data?.address

  return useContractWrite(
    {
      addressOrName: vaultAddress,
      contractInterface: ERC4626Abi,
    },
    'deposit',
    {
      args: [amount, receiver || connectedAccount],
    }
  )
}

export default useDepositTo4626
