import classNames from 'classnames'
import { BigNumber } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import ERC4626Abi from '../abis/ERC4626.abi'
import useAllowance from '../hooks/useAllowance'
import useApproveERC20 from '../hooks/useApproveERC20'
import useTokenInfo from '../hooks/useTokenInfo'
import { useVaultDetails } from '../hooks/useVaultDetails'
import { formatBalance } from '../utils/formatting'
import useDepositTo4626 from './useDepositTo4626'

const DepositPreview: FC<{
  vaultName: string
  amount: BigNumber
  onCancelDeposit: () => void
  onDeposit: (txHash: string) => void
}> = ({ vaultName, amount, onDeposit, onCancelDeposit }) => {
  // Additional state so we don't need to wait for approval to update from on chain read.
  const [hasApproved, setHasApproved] = useState<boolean>(false)
  const { data: accountData } = useAccount()
  const signedInAccount = accountData?.address
  const { data: vaultDetails } = useVaultDetails(vaultName)
  const { data: rTokenInfo } = useTokenInfo(vaultDetails?.address)
  const { data: aTokenInfo } = useTokenInfo(vaultDetails?.aToken)
  const { data: allowance } = useAllowance(
    vaultDetails?.aToken,
    signedInAccount,
    vaultDetails?.address
  )

  // NOTE: safe to assert existence because button won't be enabled otherwise.
  const { writeAsync: approve, isLoading: approvalLoading } = useApproveERC20(
    vaultDetails!.aToken,
    vaultDetails!.address,
    amount
  )
  const {
    write: deposit,
    isLoading: depositLoading,
    data: depositTxData,
  } = useDepositTo4626(vaultDetails!.address, amount, signedInAccount!)

  useEffect(() => {
    if (depositTxData?.hash) onDeposit(depositTxData.hash)
  }, [depositTxData?.hash, onDeposit])

  const { data: sharesOut, isLoading: depositPreviewLoading } = useContractRead(
    {
      addressOrName: vaultDetails!.address,
      contractInterface: ERC4626Abi,
    },
    'previewDeposit',
    {
      args: [amount],
      enabled: !!vaultDetails?.address,
    }
  )

  const needsApproval = !hasApproved && allowance && allowance.lt(amount)

  const buttonText = approvalLoading
    ? 'Approving...'
    : depositLoading
    ? 'Deposit pending...'
    : needsApproval
    ? 'Approve ' + aTokenInfo?.symbol
    : 'Confirm Deposit'

  return (
    <div className="flex flex-col">
      <div
        className="grid grid-cols-2 border border-gray-700 rounded-[4px] bg-white bg-opacity-10"
        style={{
          gridTemplateColumns: '1fr 2fr',
        }}
      >
        <div className="col-span-2 p-3 bg-black border-b border-inherit">
          Deposit Preview
        </div>
        <div className="px-3 py-1 pt-3">Deposit Amount:</div>
        <div className="px-3 py-1 pt-3 text-right">
          {' '}
          {formatBalance(amount, aTokenInfo?.decimals)} {aTokenInfo?.symbol}
        </div>
        <div className="px-3 py-1">Current EST APR:</div>
        <div className="px-3 py-1 text-right">---</div>
        <div className="px-3 py-1 pb-3">You Receive:</div>
        <div className="px-3 py-1 pb-3 text-right">
          {depositPreviewLoading ? (
            'Calculating...'
          ) : (
            <span>
              {formatBalance(
                sharesOut as unknown as BigNumber,
                rTokenInfo?.decimals
              )}{' '}
              {vaultDetails?.rToken}
            </span>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={depositLoading || approvalLoading}
        className={classNames([
          'w-full p-2 rounded-md mt-5',
          'font-bold uppercase text-xl bg-umami-pink text-white',
          'disabled:opacity-50',
          'transition-opacity',
        ])}
        onClick={
          needsApproval
            ? () => approve().then(() => setHasApproved(true))
            : () => deposit()
        }
      >
        {buttonText}
      </button>
      <button onClick={onCancelDeposit} className="underline text-[11px] mt-2">
        Cancel deposit
      </button>
    </div>
  )
}

export default DepositPreview
