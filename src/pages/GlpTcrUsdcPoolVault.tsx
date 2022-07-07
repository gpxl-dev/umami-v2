import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { Formik, Form, FormikHelpers } from 'formik'
import { useQueryClient } from 'react-query'

import PageContent from '../components/PageContent'
import VaultCard from '../components/VaultCard'
import VaultTransactionCard from '../components/VaultTransactionCard'
import { useActions } from '../hooks/useActions'
import { useBalances } from '../hooks/useBalances'
import { useGlpTcrUsdcPoolInfo } from '../hooks/useGlpTcrUsdcPoolInfo'
import { useDeposits } from '../hooks/useDeposits'
import { useUsdcDepositPreview } from '../hooks/useUsdcDepositPreview'
import { useAllowances } from '../hooks/useAllowances'
import { useApprovals } from '../hooks/useApprovals'
import { TOKEN_ADDRESSES } from '../constants'

export default function GlpTcrUsdcPoolVault() {
  const { data: balances } = useBalances()
  const { data: poolInfo } = useGlpTcrUsdcPoolInfo()
  const { data: usdcDepositPreview } = useUsdcDepositPreview()
  const { data: allowances } = useAllowances()

  const { action, selectDeposit, selectWithdraw } = useActions()
  const { previewUSDCDeposit } = useDeposits()
  const { approveUsdcForGlpTcrUsdcPool } = useApprovals()
  const queryClient = useQueryClient()

  const usdcBalance = React.useMemo(() => {
    return balances?.usdc.toFixed(2)
  }, [balances])

  const symbol = React.useMemo(() => {
    return action === 'deposit' ? 'USDC' : poolInfo?.symbol
  }, [action, poolInfo])

  const actionText = React.useMemo(() => {
    if (!allowances?.usdc) {
      return 'Approve'
    }

    if (action === 'deposit') {
      return usdcDepositPreview ? 'confirm deposit' : 'preview deposit'
    } else {
      return 'withdraw'
    }
  }, [action, usdcDepositPreview, allowances])

  const clearUSDCDepositPreview = React.useCallback(() => {
    queryClient.setQueryData('usdcDepositPreview', 0)
  }, [queryClient])

  const handleSubmit = React.useCallback(
    (
      values: { amount: number },
      { resetForm }: FormikHelpers<{ amount: number }>
    ) => {
      if (!allowances?.usdc) {
        approveUsdcForGlpTcrUsdcPool()
        resetForm()
        return
      }

      usdcDepositPreview
        ? console.log(values.amount)
        : previewUSDCDeposit(String(values.amount))
      resetForm()
    },
    [
      usdcDepositPreview,
      previewUSDCDeposit,
      allowances,
      approveUsdcForGlpTcrUsdcPool,
    ]
  )

  return (
    <>
      <Helmet>
        <title>Umami Finance | GLP/TCR USDC Pool Vault</title>
      </Helmet>

      <main>
        <div className="h-24 lg:h-[200px]">
          <div className="sr-only">
            <h1>Umami Finance | GLP/TCR USDC Pool Vault</h1>
          </div>
        </div>

        <PageContent>
          <div className="-translate-y-12 p-4 m-auto max-w-6xl w-full">
            <div className="grid gap-4 grid-rows-2 lg:grid-rows-1 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <VaultCard
                  title="GLP/TCR USDC Pool"
                  tokens={{ deposit: 'USDC', earn: 'USDC', receipt: 'umUSDC' }}
                  apr="23.4"
                  fees="1-15-0"
                  deposits={{
                    current: poolInfo?.totalDeposits ?? 0,
                    capacity: poolInfo?.capacity ?? 0,
                  }}
                  contractAddress={TOKEN_ADDRESSES.glpTcrUsdcPool}
                />
              </div>

              <div className="lg:col-span-2">
                <VaultTransactionCard>
                  <VaultTransactionCard.Header>
                    <VaultTransactionCard.HeaderAction
                      text="deposit"
                      onClick={selectDeposit}
                      active={action === 'deposit'}
                    />

                    <VaultTransactionCard.HeaderActionDivider />

                    <VaultTransactionCard.HeaderAction
                      text="withdraw"
                      onClick={selectWithdraw}
                      active={action === 'withdraw'}
                    />
                  </VaultTransactionCard.Header>

                  <VaultTransactionCard.Content>
                    <Formik
                      initialValues={{
                        amount: 0,
                      }}
                      onSubmit={handleSubmit}
                      enableReinitialize
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <fieldset>
                            <div className={usdcDepositPreview ? 'hidden' : ''}>
                              <div className="flex text-gray-500 font-bold items-center justify-between">
                                <div>Balance</div>
                                <div>{usdcBalance}</div>
                              </div>

                              <div className="mt-2">
                                <VaultTransactionCard.FormField
                                  name="amount"
                                  label={symbol}
                                  action={() =>
                                    setFieldValue('amount', balances?.usdc ?? 0)
                                  }
                                  actionLabel="max"
                                />
                              </div>
                            </div>

                            <div
                              className={
                                usdcDepositPreview ? 'block' : 'hidden'
                              }
                            >
                              <h3 className="font-bold text-lg">
                                Deposit Preview
                              </h3>

                              <ul className="grid grid-rows-3 gap-1 mt-4 text-gray-500 text-sm uppercase">
                                <li className="flex justify-between">
                                  <div>Amount:</div>
                                  <div>
                                    {values.amount
                                      ? values.amount.toFixed(2)
                                      : '0'}{' '}
                                    USDC
                                  </div>
                                </li>

                                <li className="flex justify-between">
                                  <div>Current APY:</div>
                                  <div>~20%</div>
                                </li>

                                <li className="flex justify-between">
                                  <div>You Receive:</div>
                                  <div>
                                    {Number(usdcDepositPreview).toFixed(2)}{' '}
                                    {poolInfo?.symbol}
                                  </div>
                                </li>
                              </ul>
                            </div>

                            <VaultTransactionCard.Action
                              text={actionText}
                              disabled={!values.amount}
                              type="submit"
                            />

                            {usdcDepositPreview ? (
                              <div className="flex items-center justify-center w-full">
                                <button
                                  type="button"
                                  className="duration-100 mt-4 text-sm underline hover:text-umami-yellow"
                                  onClick={clearUSDCDepositPreview}
                                >
                                  Cancel Deposit
                                </button>
                              </div>
                            ) : null}
                          </fieldset>
                        </Form>
                      )}
                    </Formik>
                  </VaultTransactionCard.Content>
                </VaultTransactionCard>
              </div>
            </div>

            <section>
              <div className="max-w-2xl mt-4 lg:mt-8">
                <div className="font-bold text-gray-500 uppercase">
                  <Link to="/app/vaults" className="underline">
                    /app/vaults
                  </Link>
                  /glp-tcr-usdc-pool
                </div>

                <h3 className="mt-4 font-bold text-lg uppercase">
                  Strategy Details
                </h3>

                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              </div>
            </section>
          </div>
        </PageContent>
      </main>
    </>
  )
}
