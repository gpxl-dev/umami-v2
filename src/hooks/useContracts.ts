import React from 'react'
import { ethers } from 'ethers'
import { useProvider, useSigner, erc20ABI } from 'wagmi'

import { useArb1Provider } from './useArb1Provider'

import UmamiABI from '../abis/Umami.abi'
import MarinateABI from '../abis/MarinatedUmami.abi'
import CMUmamiABI from '../abis/CompoundedMarinatedUmami.abi'
import GlpTcrUsdcPoolABI from '../abis/GlpTcrUsdcPool.abi'
import { TOKEN_ADDRESSES } from '../constants'

export function useContracts() {
  const arb1Provider = useArb1Provider()
  const wagmiProvider = useProvider()
  const { data: signer } = useSigner()

  return React.useMemo(() => {
    const provider = wagmiProvider ?? arb1Provider

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
      glpTcrUsdcPool: new ethers.Contract(
        TOKEN_ADDRESSES.glpTcrUsdcPool,
        GlpTcrUsdcPoolABI,
        signer ?? provider
      ),
      usdc: new ethers.Contract(
        TOKEN_ADDRESSES.usdc,
        erc20ABI,
        signer ?? provider
      ),
      providerType: wagmiProvider ? 'wagmi' : 'arb1',
      signer: Boolean(signer),
    }
  }, [arb1Provider, wagmiProvider, signer])
}
