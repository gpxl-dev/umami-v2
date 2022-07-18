import classnames from 'classnames'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import useTokenInfo from '../hooks/useTokenInfo'
import BalanceInput from './BalanceInput'

type FormValues = {
  amount: number
}

const depositModes = [
  {
    title: 'Zap In',
    description:
      'Create your balancer LP position and deposit the LP tokens into this vault in one transaction.',
  },
  {
    title: 'Deposit LP Tokens',
    description:
      'If you have balancer LP tokens, you can deposit them directly into the vault.',
  },
]

const DepositForm: FC<{
  depositTokenAddress: string
  onPreviewDeposit: (amount: BigNumber) => void
}> = ({ depositTokenAddress, onPreviewDeposit }) => {
  const { data: depositTokenInfo } = useTokenInfo(depositTokenAddress)
  const [depositMode, setDepositMode] = useState<number>(1)

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-3">
        {depositModes.map((depositModeInfo, i) => {
          const selected = depositMode === i
          return (
            <div
              key={`depositmode-${i}`}
              onClick={() => setDepositMode(i)}
              className={classnames([
                'flex flex-col p-3',
                'rounded-[4px] border cursor-pointer',
                'transition-colors',
                {
                  'border-gray-500': !selected,
                  'border-[#f8e1a6] bg-[#f8e1a6] bg-opacity-[14%]': selected,
                },
              ])}
            >
              <h4 className="font-bold text-sm uppercase mb-[2px]">
                {depositModeInfo.title}{' '}
                <FaCheckCircle
                  className={classnames([
                    'inline ml-1 relative -top-px text-xs text-[#f8e1a6]',
                    'transition-opacity',
                    {
                      'opacity-0': !selected,
                      'opacity-100': selected,
                    },
                  ])}
                />
              </h4>
              <p className="text-xs">{depositModeInfo.description}</p>
            </div>
          )
        })}
      </div>
      {depositMode === 0 ? (
        <span className="flex items-center justify-center w-full h-28 opacity-50 uppercase">
          Not implemented
        </span>
      ) : (
        <Formik
          initialValues={{
            amount: 0,
          }}
          onSubmit={(values: FormValues) =>
            onPreviewDeposit(
              parseUnits(values.amount.toString(), depositTokenInfo?.decimals)
            )
          }
        >
          {({ setFieldValue, errors, values, isValid }) => (
            <Form>
              <BalanceInput
                errors={errors}
                setFieldValue={setFieldValue}
                fieldName="amount"
                className="w-full mt-5"
                tokenAddress={depositTokenAddress}
              />
              <button
                disabled={!isValid || values.amount <= 0}
                type="submit"
                className={classNames([
                  'w-full p-2 rounded-md mt-5',
                  'font-bold uppercase text-xl bg-umami-pink text-white',
                  'transition-opacity disabled:opacity-50',
                ])}
              >
                Preview Deposit
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default DepositForm
