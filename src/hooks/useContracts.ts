import React from 'react'
import { ethers } from 'ethers'
import { useProvider, useSigner } from 'wagmi'

import { useInfuraProvider } from './useInfuraProvider'

import UmamiABI from '../abis/Umami.abi'
import MarinateABI from '../abis/MarinatedUmami.abi'
import CMUmamiABI from '../abis/CompoundedMarinatedUmami.abi'
import { TOKEN_ADDRESSES } from '../constants'

export function useContracts() {
  const infuraProvider = useInfuraProvider()
  const wagmiProvider = useProvider()
  const { data: signer } = useSigner()

  return React.useMemo(() => {
    const provider = wagmiProvider ?? infuraProvider

    return {
      umami: new ethers.Contract(
        TOKEN_ADDRESSES.umami,
        UmamiABI,
        signer ?? provider
      ),
      mumami: new ethers.Contract(
        TOKEN_ADDRESSES.mumami,
        MarinateABI,
        signer ?? provider
      ),
      cmumami: new ethers.Contract(
        TOKEN_ADDRESSES.cmumami,
        CMUmamiABI,
        signer ?? provider
      ),
      providerType: wagmiProvider ? 'wagmi' : 'infura',
      signer: Boolean(signer),
    }
  }, [infuraProvider, wagmiProvider, signer])
}
