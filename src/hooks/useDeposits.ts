import React from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { useQueryClient } from 'react-query'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useDeposits() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const marinateUmami = React.useCallback(
    async (amount: string) => {
      try {
        if (!account) {
          notify('Please connect wallet to marinate your UMAMI', 'error')
          throw new Error('stake() needs a signer')
        }

        if (!isArbitrum) {
          notify(
            'Please switch network to Arbitrum to marinate your UMAMI',
            'error'
          )
          throw new Error('wrong network')
        }

        const [stakeEnabled, totalStaked, depositLimit, decimals] =
          await Promise.all([
            contracts.mumami.stakeEnabled(),
            contracts.mumami.totalStaked(),
            contracts.mumami.depositLimit(),
            contracts.mumami.decimals(),
          ])

        if (!stakeEnabled || totalStaked.gte(depositLimit)) {
          const message =
            'Staking not enabled at this time or deposit limit reached'
          notify(message, 'error')
          throw new Error(message)
        }

        const stakeValue = ethers.utils.parseUnits(amount, decimals)
        const { wait } = await contracts.mumami.stake(stakeValue)
        notify('Staking transaction initiated', 'info')
        await wait()
        notify('Staked!', 'success')
        queryClient.invalidateQueries('balances')
      } catch (err) {
        console.log(err)
        notify('Unable to stake UMAMI at this time', 'error')
      }
    },
    [account, contracts, isArbitrum, notify, queryClient]
  )

  const compoundMumami = React.useCallback(
    async (amount: string) => {
      try {
        if (!account || !isArbitrum) {
          notify(
            'Please connect wallet on Arbitrum to deposit mUMAMI',
            'error'
          )
          throw new Error('No account or wrong network')
        }
        const decimals = await contracts.cmumami.decimals()
        const depositAmount = ethers.utils.parseUnits(amount, decimals)
        const { wait } = await contracts.cmumami.deposit(depositAmount)
        notify('Deposit transaction initiated', 'info')
        await wait()
        notify('Deposited!', 'success')
        queryClient.invalidateQueries('balances')
      } catch (err) {
        console.log(err)
        notify('Unable to deposit mUMAMI at this time', 'error')
      }
    },
    [account, contracts, isArbitrum, notify, queryClient]
  )

  return { marinateUmami, compoundMumami }
}
