import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { useMutation, useQueryClient } from 'react-query'

import { useBalances } from './useBalances'
import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'
import { TOKEN_ADDRESSES } from '../constants'

export function useApprovals() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const { data: balances } = useBalances()
  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const { mutate: approveUmami } = useMutation(
    async () => {
      if (!account) {
        notify('Please connect wallet to approve spend of UMAMI', 'error')
        throw new Error('no account')
      }

      if (!isArbitrum) {
        notify('Please switch network to Arbitrum to approve UMAMI', 'error')
        throw new Error('wrong network')
      }

      const decimals = await contracts.umami.decimals()
      const approvalAmount = ethers.utils.parseUnits(
        String(Math.floor(Number(balances?.umami)) + 1),
        decimals
      )
      const { wait } = await contracts.umami.approve(
        TOKEN_ADDRESSES.mumami,
        approvalAmount
      )
      await wait()
    },
    {
      onMutate() {
        notify('UMAMI Approval transaction initiated', 'info')
      },
      onError() {
        notify('Error approving UMAMI, please try again', 'error')
      },
      onSuccess() {
        notify('UMAMI spend approved', 'success')
        queryClient.invalidateQueries('allowances')
      },
    }
  )

  const { mutate: approveMumami } = useMutation(
    async () => {
      if (!account) {
        notify('Please connect wallet to approve spend of mUMAMI', 'error')
        throw new Error('no account')
      }
      if (!isArbitrum) {
        notify(
          'Please switch network to Arbitrum to approve spend of mUMAMI',
          'error'
        )
        throw new Error('wrong network')
      }
      const decimals = await contracts.mumami.decimals()
      const approvalAmount = ethers.utils.parseUnits(
        String(Math.floor(Number(balances?.mumami)) + 1),
        decimals
      )
      const { wait } = await contracts.mumami.approve(
        TOKEN_ADDRESSES.cmumami,
        approvalAmount
      )
      await wait()
    },
    {
      onMutate() {
        notify('mUMAMI Approval transaction initiated', 'info')
      },
      onError() {
        notify('Error approving mUMAMI, please try again', 'error')
      },
      onSuccess() {
        notify('mUMAMI spend approved', 'success')
        queryClient.invalidateQueries('allowances')
      },
    }
  )

  return { approveUmami, approveMumami }
}
