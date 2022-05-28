import React from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'

export function useDeposits() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const contracts = useContracts()

  const marinateUmami = React.useCallback(
    async (amount: string) => {
      try {
        if (!account) {
          notify('Please connect wallet to marinate your UMAMI', 'error')
          throw new Error('stake() needs a signer')
        }
        const [stakeEnabled, totalStaked, depositLimit] = await Promise.all([
          contracts.mumami.stakeEnabled(),
          contracts.mumami.totalStaked(),
          contracts.mumami.depositLimit(),
        ])

        if (!stakeEnabled || totalStaked.gte(depositLimit)) {
          const message =
            'Staking not enabled at this time or deposit limit reached'
          notify(message, 'error')
          throw new Error(message)
        }

        const stakeValue = ethers.utils.parseUnits(amount, 9)
        const tx = await contracts.mumami.stake(stakeValue)
        console.log(tx)
        notify('Staking transaction initiated', 'info')
      } catch (err) {
        console.log(err)
        notify('Unable to stake at this time', 'error')
      }
    },
    [account, contracts, notify]
  )

  return { marinateUmami }
}
