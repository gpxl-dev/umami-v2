import React from 'react'
import { ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { useProvider } from 'wagmi'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import IUniswapV3PoolABI from '../abis/IUniswapV3Pool.abi'
import { useArb1Provider } from './useArb1Provider'
import { POOL_ADDRESSES, ARBITRUM_ID } from '../constants'

const arbitrumId = ARBITRUM_ID

export function useUmamiPrice() {
  const { notify } = useNotifications()
  const wagmiProvider = useProvider()
  const arb1Provider = useArb1Provider()

  const provider = React.useMemo(() => {
    return wagmiProvider ?? arb1Provider
  }, [arb1Provider, wagmiProvider])

  const getUmamiEthPrice = React.useCallback(async () => {
    try {
      if (!provider) {
        throw new Error('No provider')
      }

      const poolContract = new ethers.Contract(
        POOL_ADDRESSES.umamiEth,
        IUniswapV3PoolABI,
        provider
      )

      const [token0, token1, fee, slot, liquidiy] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.slot0(),
        poolContract.liquidity(),
      ])

      const UmamiToken = new Token(arbitrumId, token0, 9)
      const WethToken = new Token(arbitrumId, token1, 18)

      const [sqrtPriceX96, tick] = slot

      const pool = new Pool(
        UmamiToken,
        WethToken,
        fee,
        sqrtPriceX96.toString(),
        liquidiy.toString(),
        tick
      )

      return pool.token0Price
    } catch (err) {
      console.log(err)
      notify('Problem fetching UMAMI/ETH pool info', 'error')
      return null
    }
  }, [notify, provider])

  const getEthUsdcPrice = React.useCallback(async () => {
    try {
      if (!provider) {
        throw new Error('No provider')
      }

      const poolContract = new ethers.Contract(
        POOL_ADDRESSES.ethUsdc,
        IUniswapV3PoolABI,
        provider
      )

      const [token0, token1, fee, slot, liquidiy] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.slot0(),
        poolContract.liquidity(),
      ])

      const WethToken = new Token(arbitrumId, token0, 18)
      const UsdcToken = new Token(arbitrumId, token1, 6)

      const [sqrtPriceX96, tick] = slot

      const pool = new Pool(
        WethToken,
        UsdcToken,
        fee,
        sqrtPriceX96.toString(),
        liquidiy.toString(),
        tick
      )

      return pool.token1Price
    } catch (err) {
      console.log(err)
      notify('Problem fetching UMAMI/ETH pool info', 'error')
      return null
    }
  }, [notify, provider])

  const getUmamiUsdPrice = React.useCallback(async () => {
    const [umamiPrice, wethPrice] = await Promise.all([
      getUmamiEthPrice(),
      getEthUsdcPrice(),
    ])

    if (!umamiPrice || !wethPrice) {
      throw new Error('UMAMI/ETH price or ETH/USDC price not available')
    }

    const price =
      Number(umamiPrice?.toFixed(9)) / Number(wethPrice?.toFixed(9))

    if (Number.isNaN(price)) {
      throw new Error('problem fetching token prices from uniswap')
    }

    return price
  }, [getUmamiEthPrice, getEthUsdcPrice])

  const queryClient = useQueryClient()

  return useQuery('umamiPrice', () => queryClient.getQueryData('umamiPrice'), {
    initialData: getUmamiUsdPrice(),
    onError() {
      notify('Problem computing UMAMI/USDC price', 'error')
    },
  })
}
