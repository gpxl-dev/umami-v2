import { ethers } from 'ethers'
import { ARB1_RPC_URL } from '../constants'

export function useArb1Provider() {
  return new ethers.providers.JsonRpcProvider(ARB1_RPC_URL)
}
