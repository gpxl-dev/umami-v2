import { ethers } from 'ethers'
import { INFURA_RPC_URL } from '../constants'

export function useInfuraProvider() {
  return new ethers.providers.JsonRpcProvider(INFURA_RPC_URL)
}
