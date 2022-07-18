import { FC } from 'react'
import { Field, FormikErrors } from 'formik'
import classnames from 'classnames'
import useERC20Balance from '../hooks/useERC20Balance'
import { useAccount } from 'wagmi'
import { formatBalance } from '../utils/formatting'
import { BigNumber } from 'ethers'
import useTokenInfo from '../hooks/useTokenInfo'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import classNames from 'classnames'

const BalanceInput: FC<{
  fieldName: string
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
  errors: FormikErrors<any>
  className?: string
  tokenAddress: string
  ownerAddress?: string
}> = ({
  className,
  tokenAddress,
  ownerAddress,
  fieldName,
  setFieldValue,
  errors,
}) => {
  const { data: useAccountData } = useAccount()
  const connectedWalletAddress = useAccountData?.address
  const { data: tokenInfo } = useTokenInfo(tokenAddress)
  const { data: balance } = useERC20Balance(
    tokenAddress,
    ownerAddress || connectedWalletAddress
  )

  return (
    <label className={classnames(['flex flex-col', className])}>
      <div className="flex flex-row justify-between font-bold text-sm text-[#ccc] mb-2">
        <span>Balance</span>
        <span>
          {balance &&
            formatBalance(
              balance as unknown as BigNumber,
              tokenInfo?.decimals,
              4
            )}
        </span>
      </div>
      <div className={'flex flex-row border border-gray-500 rounded-md'}>
        <div className="relative flex flex-row flex-1 items-center">
          <Field
            type="number"
            className={classNames([
              'absolute inset-0 bg-transparent px-4',
              {
                'text-red-500': errors[fieldName],
              },
            ])}
            name={fieldName}
            validate={(value: number | string) => {
              if (typeof value == 'string' && !value.length)
                return 'Please enter a value'
              if (
                parseUnits(value.toString(), tokenInfo?.decimals).gt(
                  balance || 0
                )
              )
                return 'Insufficient balance'
            }}
          />
          <button
            type="button"
            className="absolute right-0 px-4 py-3 text-umami-pink font-bold text-[11px] bg-black"
            onClick={() => {
              setFieldValue(
                fieldName,
                formatUnits(
                  balance as unknown as BigNumber,
                  tokenInfo?.decimals
                ),
                true
              )
            }}
          >
            MAX
          </button>
        </div>
        <div className="font-bold text-base p-3 border-l border-gray-500 h-12 min-w-[128px]">
          {tokenInfo?.symbol}
        </div>
      </div>
    </label>
  )
}

export default BalanceInput
