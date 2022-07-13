import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { useQueryClient } from 'react-query'

import PageContent from '../components/PageContent'
import VaultCard from '../components/VaultCard'
import VaultTransactionCard from '../components/VaultTransactionCard'
import { useActions } from '../hooks/useActions'
import { useBalances } from '../hooks/useBalances'
import { useGlpTcrUsdcPoolInfo } from '../hooks/useGlpTcrUsdcPoolInfo'
import { useDeposits } from '../hooks/useDeposits'
import { useWithdraws } from '../hooks/useWithdraws'
import { useUsdcDepositPreview } from '../hooks/useUsdcDepositPreview'
import { useAllowances } from '../hooks/useAllowances'
import { useApprovals } from '../hooks/useApprovals'
import { useGlpTcrUsdcPoolUserInfo } from '../hooks/useGlpTcrUsdcPoolUserInfo'
import { TOKEN_ADDRESSES } from '../constants'

export default function GlpTcrUsdcPoolVault() {
  const { data: balances } = useBalances()
  const { data: poolInfo } = useGlpTcrUsdcPoolInfo()
  const { data: usdcDepositPreview } = useUsdcDepositPreview()
  const { data: allowances } = useAllowances()
  const { data: userInfo } = useGlpTcrUsdcPoolUserInfo()

  const { action, selectDeposit, selectWithdraw } = useActions()
  const { previewUSDCDeposit, depositUsdcInGlpTcrPool } = useDeposits()
  const { initiateUsdcWithdrawFromGlpTcrPool } = useWithdraws()
  const { approveUsdcForGlpTcrUsdcPool } = useApprovals()
  const queryClient = useQueryClient()

  const {
    mutate: deposit,
    isLoading: isDepositing,
    isSuccess: isDepositSuccess,
    isError: isDepositError,
    reset: resetDeposit,
  } = depositUsdcInGlpTcrPool

  const {
    mutate: initiateWithdraw,
    isLoading: isWithdrawInitiating,
    isSuccess: isWithdrawInitiated,
    isError: isWithdrawInitiatingError,
    reset: resetInitiateWithdrawal,
  } = initiateUsdcWithdrawFromGlpTcrPool

  const usdcBalance = React.useMemo(() => {
    return balances?.usdc.toFixed(2)
  }, [balances])

  const receiptTokenBalance = React.useMemo(() => {
    return Number(userInfo?.balance).toFixed(2)
  }, [userInfo])

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
      return 'queue withdrawal'
    }
  }, [action, usdcDepositPreview, allowances])

  const maxValue = React.useMemo(() => {
    return action === 'deposit' ? balances?.usdc : userInfo?.balance
  }, [action, balances, userInfo])

  const displayBalance = React.useMemo(() => {
    return action === 'deposit' ? usdcBalance : receiptTokenBalance
  }, [action, usdcBalance, receiptTokenBalance])

  const clearUSDCDepositPreview = React.useCallback(() => {
    queryClient.setQueryData('usdcDepositPreview', 0)
  }, [queryClient])

  const handleSubmit = React.useCallback(
    (values: { amount: number }) => {
      if (action === 'withdraw') {
        initiateWithdraw(String(values.amount))
      } else {
        if (!allowances?.usdc) {
          approveUsdcForGlpTcrUsdcPool()
          return
        }

        usdcDepositPreview
          ? deposit(String(values.amount))
          : previewUSDCDeposit(String(values.amount))
      }
    },
    [
      usdcDepositPreview,
      previewUSDCDeposit,
      allowances,
      approveUsdcForGlpTcrUsdcPool,
      deposit,
      initiateWithdraw,
      action,
    ]
  )

  const clearDeposit = React.useCallback(() => {
    clearUSDCDepositPreview()
    resetDeposit()
  }, [resetDeposit, clearUSDCDepositPreview])

  const withdrawalWarning = React.useMemo(() => {
    return action === 'withdraw' ? (
      <VaultTransactionCard.Warning text="This vault processes withdrawals in 8 hour cycles. If you queue your withdrawal now, your funds will be available to claim in 1:23:15 — you will continue to earn rewards until then. Claims are not done automatically, you need to return here to claim." />
    ) : null
  }, [action])

  /* const withdrawalStats = React.useMemo(() => {
    return action === 'withdraw' ? (
      <ul className="grid grid-auto-rows gap-1 mt-4 text-gray-500 text-sm uppercase">
        <li className="flex justify-between">
          <div>Vault Deposits:</div>
          <div>{Number(poolInfo?.totalDeposits).toFixed(2)}</div>
        </li>
      </ul>
    ) : null
  }, [action, poolInfo]) */

  const vaultContent = React.useMemo(() => {
    if (isDepositing) {
      return (
        <VaultTransactionCard.Content>
          <div className="text-center w-full">
            <strong className="text-lg uppercase">Transaction Pending</strong>

            <hr className="mt-4" />

            <strong className="block font-bold mt-4 text-sm">
              The Magic of Your New {poolInfo?.symbol} Receipt Token
            </strong>

            <p className="text-sm text-gray-500 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </VaultTransactionCard.Content>
      )
    }

    if (isDepositSuccess) {
      return (
        <VaultTransactionCard.Content>
          <div className="text-center w-full">
            <strong className="uppercase text-green-400">
              Deposit Complete
            </strong>

            <hr className="mt-4" />

            <strong className="block font-bold mt-4 text-sm">
              The Magic of Your New {poolInfo?.symbol} Receipt Token
            </strong>

            <p className="text-sm text-gray-500 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <button
              type="button"
              className="duration-100 mt-4 text-sm hover:underline"
              onClick={clearDeposit}
            >
              Deposit Again
            </button>
          </div>
        </VaultTransactionCard.Content>
      )
    }

    if (isWithdrawInitiating) {
      return (
        <VaultTransactionCard.Content>
          <div className="text-center w-full">
            <strong className="uppercase">
              Transaction Pending
            </strong>

            <hr className="mt-4" />

            <strong className="block font-bold mt-4 text-sm">
              Important Note: You are not done!
            </strong>

            <p className="text-sm text-gray-500 mt-4">
              You have queued your withdrawal which means it will be available
              in [COUNTDOWN], which is when the current cycle ends. The funds
              will not be automatically deposited into your wallet, you need to
              return here to claim them. Learn More
            </p>
          </div>
        </VaultTransactionCard.Content>
      )
    }

    if (isWithdrawInitiated) {
      return (
        <VaultTransactionCard.Content>
          <div className="text-center w-full">
            <strong className="uppercase text-green-400">
              Withdrawal Initiated
            </strong>

            <hr className="mt-4" />

            <strong className="block font-bold mt-4 text-sm">
              Important Note: You are not done!
            </strong>

            <p className="text-sm text-gray-500 mt-4">
              You have queued your withdrawal which means it will be available
              in [COUNTDOWN], which is when the current cycle ends. The funds
              will not be automatically deposited into your wallet, you need to
              return here to claim them. Learn More
            </p>

            <button
              type="button"
              className="duration-100 mt-4 text-sm hover:underline"
              onClick={resetInitiateWithdrawal}
            >
              Dismiss
            </button>
          </div>
        </VaultTransactionCard.Content>
      )
    }

    return (
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
                  {withdrawalWarning}

                  <div className="flex text-gray-500 font-bold items-center mt-4 justify-between">
                    <div>Balance</div>
                    <div>{displayBalance}</div>
                  </div>

                  <div className="mt-2">
                    <VaultTransactionCard.FormField
                      name="amount"
                      label={symbol}
                      action={() => setFieldValue('amount', maxValue)}
                      actionLabel="max"
                    />
                  </div>
                </div>

                <div className={usdcDepositPreview ? 'block' : 'hidden'}>
                  <h3 className="font-bold text-lg">Deposit Preview</h3>

                  <ul className="grid grid-rows-3 gap-1 mt-4 text-gray-500 text-sm uppercase">
                    <li className="flex justify-between">
                      <div>Amount:</div>
                      <div>
                        {values.amount ? values.amount.toFixed(2) : '0'} USDC
                      </div>
                    </li>

                    <li className="flex justify-between">
                      <div>Current APY:</div>
                      <div>~20%</div>
                    </li>

                    <li className="flex justify-between">
                      <div>You Receive:</div>
                      <div>
                        <span>{Number(usdcDepositPreview).toFixed(2)}</span>
                        <span> {poolInfo?.symbol} </span>
                      </div>
                    </li>
                  </ul>

                  <VaultTransactionCard.Warning text="This vault processes withdrawals in 8 hour cycles. This means you will need to wait a maximum of 8 hours to withdraw your deposited funds." />
                </div>

                <VaultTransactionCard.Action
                  text={actionText}
                  disabled={!values.amount && !usdcDepositPreview}
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
    )
  }, [
    usdcDepositPreview,
    symbol,
    poolInfo,
    maxValue,
    handleSubmit,
    clearUSDCDepositPreview,
    actionText,
    isDepositing,
    isDepositSuccess,
    clearDeposit,
    displayBalance,
    withdrawalWarning,
    isWithdrawInitiating,
    isWithdrawInitiated,
    resetInitiateWithdrawal,
  ])

  React.useEffect(() => {
    if (isDepositError) {
      clearDeposit()
    }
  }, [isDepositError, clearDeposit])

  React.useEffect(() => {
    if (isWithdrawInitiatingError) {
      resetInitiateWithdrawal()
    }
  }, [isWithdrawInitiatingError, resetInitiateWithdrawal])

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
          <div className="-translate-y-12 p-4 m-auto max-w-[1920px] w-full">
            <div className="grid gap-4 grid-rows-2 lg:grid-rows-1 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <VaultCard
                  title="GLP/TCR USDC Pool"
                  tokens={{
                    deposit: 'USDC',
                    earn: 'USDC',
                    receipt: poolInfo?.symbol,
                  }}
                  apr="~20"
                  fees="1-15-0"
                  deposits={{
                    current: Number(poolInfo?.totalDeposits),
                    capacity: Number(poolInfo?.capacity),
                  }}
                  contractAddress={TOKEN_ADDRESSES.glpTcrUsdcPool}
                  tag="Delta-Neutral"
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

                  {vaultContent}
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
                  The Umami USDC vault uses $USDC deposits to mint $GLP, the
                  Liquidity Provider token for GMX’s leveraged perpetual
                  exchange platform. The vault hedges against market volatility
                  using derivatives from Tracer DAO. Vault depositors receive a
                  fully-fungible receipt token, $usdGLP.
                </p>

                <p className="mt-4">
                  GMX’s $GLP is a yield-generating index of crypto assets
                  composed of approximately 50% stable coins, 30% ETH, 20% BTC,
                  and a small 1-2% allocation of $LINK and $UNI. It generates
                  yield in $ETH from trading fee revenue & trader liquidations
                  and also accumulates $GMX token rewards. The rewards are
                  staked to further enhance $ETH yield for depositors.
                </p>

                <p className="mt-4">
                  The USDC vault hedges against $GLP’s exposure to BTC and ETH
                  using Tracer DAO’s tokenized Perpetual Pools. Tracer’s pools
                  enable users to take a leveraged long or short position on
                  virtually any asset with zero liquidation risk. They are
                  staked for rewards in $TCR, Tracer’s native token, which are
                  automatically swapped for $USDC.
                </p>

                <p className="mt-4">
                  The Tracer hedges are rebalanced every 24 hours using a
                  dynamic model created in partnership with Balance, an
                  AI-driven wealth management platform. Extensive backtesting
                  shows that vault assets should remain highly stable even in
                  extreme market drawdowns.
                </p>

                <p className="mt-4">
                  Users can withdraw deposited $USDC plus $USDC rewards at the
                  end of any 24 hour rebalancing period. They can also swap
                  their ${poolInfo?.symbol} receipt tokens for $USDC on Uniswap
                  v3.
                </p>
              </div>
            </section>
          </div>
        </PageContent>
      </main>
    </>
  )
}
