import React from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useNotifications } from 'reapop'
import { useQueryClient } from 'react-query'

import { useBalances } from './useBalances'
import { useContracts } from './useContracts'
import { TOKEN_ADDRESSES } from '../constants'

export function useApprovals() {
  const { data: account } = useAccount()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const { data: balances } = useBalances()
  const contracts = useContracts()

  const approveUmami = React.useCallback(async () => {
    try {
      if (!account) {
        notify('Please connect wallet to approve spend of UMAMI', 'error')
      }
      const approvalAmount = ethers.utils.parseUnits(
        String(Number(balances?.umami) + 1),
        9
      )
      const { wait } = await contracts.umami.approve(TOKEN_ADDRESSES.mumami, approvalAmount)
      notify('UMAMI Approval transaction initiated', 'info')
      await wait()
      queryClient.invalidateQueries('allowances')
      notify('UMAMI spend approved', 'success')
    } catch (err) {
      notify('Error approving UMAMI, please try again', 'error')
    }
  }, [account, notify, balances, contracts, queryClient])

  const approveMumami = React.useCallback(async () => {
    try {
      if (!account) {
        notify('Please connect wallet to approve spend of mUMAMI', 'error')
      }
      const approvalAmount = ethers.utils.parseUnits(
        String(Number(balances?.mumami) + 1),
        9
      )
      const { wait } = await contracts.mumami.approve(
        TOKEN_ADDRESSES.cmumami,
        approvalAmount
      )
      notify('mUMAMI Approval transaction initiated', 'info')
      await wait()
      queryClient.invalidateQueries('allowances')
      notify('mUMAMI spend approved', 'success')
    } catch (err) {
      console.log(err)
      notify('Error approving mUMAMI, please try again', 'error')
    }
  }, [account, notify, balances, contracts, queryClient])

  const approveCmumami = React.useCallback(async () => {
    try {
      if (!account) {
        notify('Please connect wallet to approve spend of cmUMAMI', 'error')
      }
      const approvalAmount = ethers.utils.parseUnits(
        String(Number(balances?.cmumami) + 1),
        9
      )
      await contracts.cmumami.approve(
        TOKEN_ADDRESSES.cmumamiBooster,
        approvalAmount
      )
    } catch (err) {
      console.log(err)
      notify('Error approving cmUMAMI, please try again', 'error')
    }
  }, [account, notify, balances, contracts])

  return { approveUmami, approveMumami, approveCmumami }
}
