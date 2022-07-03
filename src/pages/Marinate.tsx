import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { FaExternalLinkAlt, FaLock } from 'react-icons/fa'

import PageContent from '../components/PageContent'
import Pill from '../components/Pill'
import FormCard from '../components/FormCard'
import Button from '../components/Button'
import { useAllowances } from '../hooks/useAllowances'
import { useApprovals } from '../hooks/useApprovals'
import { useAPI } from '../hooks/useAPI'
import { useActions } from '../hooks/useActions'
import { useBalances } from '../hooks/useBalances'
import { useClaimRewards } from '../hooks/useClaimRewards'
import { useDeposits } from '../hooks/useDeposits'
import { useMarinateWithdrawStatus } from '../hooks/useMarinateWithdrawStatus'
import { useRewards } from '../hooks/useRewards'
import { useWithdraws } from '../hooks/useWithdraws'
import { useTotalMarinatedUmami } from '../hooks/useTotalMarinatedUmami'
import { TOKEN_ADDRESSES } from '../constants'

export default function Marinate() {
  const { data: apiData } = useAPI()
  const { action, selectDeposit, selectWithdraw } = useActions()
  const { data: balances } = useBalances()
  const { data: allowances } = useAllowances()
  const { data: rewards } = useRewards()
  const { data: marinateWithdrawStatus } = useMarinateWithdrawStatus()
  const { data: totalMarinatedUmami } = useTotalMarinatedUmami()
  const { approveUmami } = useApprovals()
  const { marinateUmami } = useDeposits()
  const { withdrawMarinatedUmami } = useWithdraws()
  const { claimMarinateRewards } = useClaimRewards()

  const marinateAPR = React.useMemo(() => {
    return apiData?.marinate?.apr ?? null
  }, [apiData])

  const aprPill = React.useMemo(() => {
    return marinateAPR ? (
      <Pill className="mt-8 m-auto text-xl min-w-full">
        ~{marinateAPR}% APR
      </Pill>
    ) : null
  }, [marinateAPR])

  const marinatingPill = React.useMemo(() => {
    return typeof totalMarinatedUmami === 'string' ? (
      <Pill className="mt-8 text-xl m-auto uppercase min-w-full">
        <span>UMAMI Staked: </span>
        {Intl.NumberFormat('en-US').format(
          Math.floor(Number(totalMarinatedUmami))
        )}
      </Pill>
    ) : null
  }, [totalMarinatedUmami])

  const ethRewardedPill = React.useMemo(() => {
    return apiData?.marinate.totalWeth ? (
      <Pill className="mt-8 text-xl m-auto uppercase min-w-full">
        {apiData?.marinate?.totalHistoryWeth} WETH Rewarded
      </Pill>
    ) : null
  }, [apiData])

  const isClaimDisabled = React.useMemo(() => {
    return (
      rewards?.mumami?.filter(({ amount }: { amount: number }) => amount > 0)
        .length === 0
    )
  }, [rewards])

  const rewardsDisplay = React.useMemo(() => {
    const applicableRewards = rewards?.mumami?.filter(
      (reward: { token: string; amount: number }) =>
        reward.amount > 0 || reward.token === 'WETH'
    )

    return applicableRewards?.length
      ? applicableRewards.map(
          ({ token, amount }: { token: string; amount: number }) => (
            <span key={token} className="mr-2 last:mr-0">
              {amount.toFixed(5)} {token}
            </span>
          )
        )
      : null
  }, [rewards])

  const nextUnlockDate = React.useMemo(() => {
    const curr = new Date()

    const unlockDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 1)

    return Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(unlockDate)
  }, [])

  const unlockDisplay = React.useMemo(() => {
    return !marinateWithdrawStatus?.withdrawEnabled ? (
      <p className="text-center mt-4 uppercase font-black">
        Next unlock on {nextUnlockDate}
      </p>
    ) : null
  }, [marinateWithdrawStatus, nextUnlockDate])

  return (
    <main>
      <header className="text-center w-full mt-8 p-4">
        <h1 className="font-bold text-5xl text-white tracking-widest uppercase md:text-6xl">
          Marinate
        </h1>
        <p className="max-w-sm text-white m-auto mt-8">
          <span>Deposit your</span>
          <strong> UMAMI </strong>
          <span>for</span>
          <strong> mUMAMI </strong>
          <span>and earn steady passive income in</span>
          <strong> ETH </strong>
          <span>from Umami's protocol revenue.</span>
        </p>
      </header>

      <section className="max-w-md px-4 m-auto text-center lg:grid lg:grid-rows-3">
        {aprPill}

        {marinatingPill}

        {ethRewardedPill}
      </section>

      <section>
        <PageContent className="mt-8 py-8 w-full">
          <div className="m-auto max-w-6xl px-4 w-full">
            <div className="font-semibold text-gray-600 uppercase">
              <Link to="/app" className="underline">
                /app
              </Link>
              /marinate
            </div>

            <div className="mt-4 md:grid md:grid-cols-2 md:gap-4">
              <div className="leading-loose md:pr-4">
                <p>
                  Stake your UMAMI for mUMAMI to earn your share of protocol
                  revenue.
                </p>

                <a
                  href="https://docs.umami.finance/umami-finance/tokenomics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 hover:underline"
                >
                  <span className="mr-2">
                    Learn more about Umami’s zero-emissions tokenomics and
                    sustainable revenue model here.
                  </span>
                  <FaExternalLinkAlt className="inline pb-1" />
                </a>

                <p className="mt-4">
                  Rewards are paid in WETH. You can collect your rewards at any
                  time, but you can only withdraw on the 1st of every month.
                </p>

                <p className="underline font-semibold leading-loose mt-4">
                  Deposited UMAMI is locked until the end of each monthly Epoch.
                </p>

                <Link
                  to="/app/compound"
                  className="block font-semibold underline mt-4 duration-100 text-umami-pink hover:text-umami-yellow"
                >
                  You can also COMPOUND your mUMAMI to maximize your passive
                  income potential!
                </Link>
              </div>

              <div className="mt-4 md:mt-0">
                <FormCard>
                  <FormCard.Header>
                    <FormCard.HeaderAction
                      text="deposit"
                      onClick={selectDeposit}
                      active={action === 'deposit'}
                    />

                    <FormCard.HeaderActionDivider />

                    <FormCard.HeaderAction
                      text="withdraw"
                      onClick={selectWithdraw}
                      active={action === 'withdraw'}
                    />
                  </FormCard.Header>

                  <FormCard.Content>
                    <Formik
                      initialValues={{
                        amount: action === 'deposit' ? 0 : balances?.mumami,
                      }}
                      onSubmit={({ amount }, { setSubmitting }) => {
                        action === 'deposit'
                          ? marinateUmami(String(amount))
                          : withdrawMarinatedUmami()
                        setSubmitting(false)
                      }}
                      enableReinitialize
                    >
                      {({ values, isSubmitting, setFieldValue }) => (
                        <fieldset disabled={isSubmitting}>
                          <Form method="post">
                            <div className="flex flex-col">
                              <FormCard.FormField
                                label={
                                  action === 'deposit' ? 'UMAMI' : 'mUMAMI'
                                }
                                labelAccent={
                                  action === 'deposit' ? (
                                    <button
                                      type="button"
                                      className="font-bold uppercase text-umami-pink hover:underline"
                                      onClick={() =>
                                        setFieldValue('amount', balances?.umami)
                                      }
                                    >
                                      Balance: {balances?.umami.toFixed(2)}
                                    </button>
                                  ) : null
                                }
                                name="amount"
                                disabled={action === 'withdraw'}
                              />

                              <div className="flex flex-col items-center mt-4 md:flex-row">
                                {allowances?.umami ? (
                                  <Button
                                    type="submit"
                                    className="md:mr-2 text-xl"
                                    disabled={
                                      (action === 'withdraw' &&
                                        !marinateWithdrawStatus?.withdrawEnabled) ||
                                      (action === 'deposit' &&
                                        values.amount === 0)
                                    }
                                  >
                                    {action === 'deposit'
                                      ? 'Marinate'
                                      : 'Withdraw'}
                                  </Button>
                                ) : (
                                  <Button
                                    className="md:mr-2 text-xl"
                                    onClick={approveUmami}
                                  >
                                    Approve
                                  </Button>
                                )}
                                <Button
                                  className="mt-2 md:mt-0 text-xl"
                                  disabled={isClaimDisabled}
                                  onClick={claimMarinateRewards}
                                >
                                  Claim Rewards
                                </Button>
                              </div>
                            </div>
                          </Form>
                        </fieldset>
                      )}
                    </Formik>

                    <div className="mt-8 text-center">
                      <div className="text-lg">
                        <FaLock className="inline pb-1 mr-1" />
                        <span className="font-bold uppercase mr-2">
                          Balance:
                        </span>
                        <span>{balances?.mumami.toFixed(5)}</span>
                        <span> mUMAMI </span>
                      </div>

                      <div className="text-lg mt-2">
                        <strong className="font-bold uppercase mr-2">
                          Rewards:
                        </strong>
                        {rewardsDisplay}
                      </div>
                    </div>
                  </FormCard.Content>
                </FormCard>

                {unlockDisplay}
              </div>
            </div>

            <div className="mt-20 flex items-center justify-center">
              <a
                href={`https://arbiscan.io/address/${TOKEN_ADDRESSES.mumami}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex text-sm hover:underline"
              >
                <div className="mr-2">View contract on Arbiscan</div>
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </PageContent>
      </section>
    </main>
  )
}
