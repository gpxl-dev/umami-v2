import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { useMutation, useQueryClient } from 'react-query'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useDeposits() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const { mutate: marinateUmami } = useMutation(
    async (amount: string) => {
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

      if (Number(amount) === 0) {
        notify('Cannot marinate 0 UMAMI', 'error')
        throw new Error('no amount')
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
      await wait()
    },
    {
      onMutate() {
        notify('Staking transaction initiated', 'info')
      },
      onSuccess() {
        notify('UMAMI Staked!', 'success')
        queryClient.invalidateQueries('balances')
      },
      onError() {
        notify(
          'Unable to stake UMAMI at this time, please try again.',
          'error'
        )
      },
    }
  )

  const { mutate: compoundMumami } = useMutation(
    async (amount: string) => {
      if (!account || !isArbitrum) {
        notify('Please connect wallet on Arbitrum to deposit mUMAMI', 'error')
        throw new Error('No account or wrong network')
      }
      const decimals = await contracts.cmumami.decimals()
      const depositAmount = ethers.utils.parseUnits(amount, decimals)
      const { wait } = await contracts.cmumami.deposit(depositAmount)
      await wait()
    },
    {
      onMutate() {
        notify('Deposit transaction initiated', 'info')
      },
      onSuccess() {
        notify('Deposited!', 'success')
        queryClient.invalidateQueries('balances')
      },
      onError() {
        notify('Unable to deposit mUMAMI at this time', 'error')
      },
    }
  )

  return { marinateUmami, compoundMumami }
}
