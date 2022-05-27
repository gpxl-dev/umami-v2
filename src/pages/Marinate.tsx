import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { FaExternalLinkAlt, FaLock } from 'react-icons/fa'

import Pill from '../components/Pill'
import FormCard from '../components/FormCard'
import Button from '../components/Button'
import { useAllowances } from '../hooks/useAllowances'
import { useApprovals } from '../hooks/useApprovals'
import { useAPI } from '../hooks/useAPI'
import { useActions } from '../hooks/useActions'
import { useBalances } from '../hooks/useBalances'
import { useDeposits } from '../hooks/useDeposits'
import { useMarinateWithdrawStatus } from '../hooks/useMarinateWithdrawStatus'
import { useRewards } from '../hooks/useRewards'
import { useWithdraws } from '../hooks/useWithdraws'
import { TOKEN_ADDRESSES } from '../constants'

export default function Marinate() {
  const { data: apiData } = useAPI()
  const { action, selectDeposit, selectWithdraw } = useActions()
  const { data: balances } = useBalances()
  const { data: allowances } = useAllowances()
  const { data: rewards } = useRewards()
  const { data: marinateWithdrawEnabled } = useMarinateWithdrawStatus()
  const { approveUmami } = useApprovals()
  const { marinateUmami } = useDeposits()
  const { withdrawMarinatedUmami } = useWithdraws()

  const marinateAPY = React.useMemo(() => {
    return apiData?.marinate.apy ?? null
  }, [apiData])

  const apyPill = React.useMemo(() => {
    return (
      <Pill
        className={`mt-8 m-auto text-2xl ${
          marinateAPY ? 'w-48' : 'w-72 text-lg'
        }`}
      >
        {marinateAPY ? `~${marinateAPY}% APY ` : 'Typically 10+% APY'}
      </Pill>
    )
  }, [marinateAPY])

  const formActionButton = React.useMemo(() => {
    const className = 'md:mr-2 text-xl'

    return allowances?.umami ? (
      <Button
        type="submit"
        className={className}
        disabled={action === 'withdraw' && !marinateWithdrawEnabled}
      >
        {action === 'deposit' ? 'Marinate' : 'Withdraw'}
      </Button>
    ) : (
      <Button className={className} onClick={approveUmami}>
        Approve
      </Button>
    )
  }, [allowances, approveUmami, action, marinateWithdrawEnabled])

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
            <div key={token} className="mr-2 last:mr-0">
              {amount.toFixed(2)} {token}
            </div>
          )
        )
      : null
  }, [rewards])

  return (
    <main>
      <header className="text-center w-full mt-8 p-4">
        <h1 className="font-bold text-5xl text-white tracking-widest uppercase md:text-6xl">
          Marinate
        </h1>
        <p className="max-w-xs text-white m-auto mt-8">
          <span>Deposit your</span>
          <strong> UMAMI </strong>
          <span>for</span>
          <strong> mUMAMI </strong>
          <span>and earn daily passive income in</span>
          <strong> ETH </strong>
        </p>

        {apyPill}
      </header>

      <section>
        <div className="bg-white mt-8 py-8 w-full">
          <div className="m-auto max-w-2xl px-4 w-full">
            <div className="font-semibold text-gray-600 uppercase">
              <Link to="/app" className="underline">
                /app
              </Link>
              /marinate
            </div>

            <p className="mt-8 leading-loose">
              Marinate to collect passive-income in ETH from Umami’s protocol
              revenue or Autocompound ETH income into boosted UMAMI and ARBIS
              rewards.
            </p>

            <p className="underline font-semibold mt-8">
              Deposited UMAMI is locked until the end of each monthly Epoch.
            </p>

            <div className="mt-2">
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
                              label={action === 'deposit' ? 'UMAMI' : 'mUMAMI'}
                              labelAccent={
                                action === 'deposit' ? (
                                  <button
                                    type="button"
                                    className="uppercase bg-gradient-to-b from-umami-purple to-umami-pink bg-clip-text text-transparent"
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
                              {formActionButton}
                              <Button
                                type="submit"
                                className="mt-2 md:mt-0 text-xl"
                                disabled={isClaimDisabled}
                              >
                                Claim Rewards
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </fieldset>
                    )}
                  </Formik>

                  <div className="mt-8 flex flex-col items-center justify-center text-center">
                    <div className="text-lg">
                      <FaLock className="inline pb-1 mr-1" />
                      <span className="font-bold uppercase mr-2">Balance:</span>
                      <span>{balances?.mumami.toFixed(2)}</span>
                      <span> mUMAMI </span>
                    </div>

                    <div className="flex text-lg">
                      <strong className="font-bold uppercase mr-2">
                        Rewards:
                      </strong>
                      {rewardsDisplay}
                    </div>
                  </div>
                </FormCard.Content>
              </FormCard>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <a
                href={`https://arbiscan.io/address/${TOKEN_ADDRESSES.mumami}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex text-sm"
              >
                <div className="mr-2">View contract on Arbiscan</div>
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
