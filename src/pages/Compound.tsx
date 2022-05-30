import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { FaExternalLinkAlt } from 'react-icons/fa'

import Pill from '../components/Pill'
import FormCard from '../components/FormCard'
import Button from '../components/Button'
import { useAPI } from '../hooks/useAPI'
import { useTotalCompoundingMumami } from '../hooks/useTotalCompoundingMumami'
import { useCompoundTokensPerShare } from '../hooks/useCompoundTokensPerShare'
import { useActions } from '../hooks/useActions'
import { useBalances } from '../hooks/useBalances'
import { useAllowances } from '../hooks/useAllowances'
import { useApprovals } from '../hooks/useApprovals'
import { useDeposits } from '../hooks/useDeposits'
import { useWithdraws } from '../hooks/useWithdraws'
import { TOKEN_ADDRESSES } from '../constants'

export default function Compound() {
  const { data: apiData } = useAPI()
  const { data: totalCompoundingMumami } = useTotalCompoundingMumami()
  const { data: tokensPerShare } = useCompoundTokensPerShare()
  const { data: balances } = useBalances()
  const { data: allowances } = useAllowances()
  const { approveMumami } = useApprovals()
  const { action, selectDeposit, selectWithdraw } = useActions()
  const { compoundMumami } = useDeposits()
  const { withdrawCompoundingMumami } = useWithdraws()

  const compoundAPY = React.useMemo(() => {
    return apiData?.marinate.apy ?? null
  }, [apiData])

  const apyPill = React.useMemo(() => {
    return (
      <Pill className="mt-8 m-auto text-xl">
        {compoundAPY ? `~${compoundAPY}% APY ` : 'Typically 10+% APY'}
      </Pill>
    )
  }, [compoundAPY])

  const compoundingPill = React.useMemo(() => {
    return typeof totalCompoundingMumami === 'string' ? (
      <Pill className="mt-8 text-xl m-auto uppercase">
        ~{Math.floor(Number(totalCompoundingMumami))} mUMAMI Deposited
      </Pill>
    ) : null
  }, [totalCompoundingMumami])

  const tokensPerSharePill = React.useMemo(() => {
    return tokensPerShare ? (
      <Pill className="mt-8 text-xl m-auto uppercase">
        {Number(tokensPerShare).toFixed(3)} cMUMAMI : 1 UMAMI
      </Pill>
    ) : null
  }, [tokensPerShare])

  return (
    <main>
      <header className="text-center w-full mt-8 p-4">
        <h1 className="font-bold text-5xl text-white tracking-widest uppercase md:text-6xl">
          Compound
        </h1>
        <p className="max-w-xs text-white m-auto mt-8">
          <span>Compound</span>
          <strong> ETH </strong>
          <span>rewards into more</span>
          <strong> mUMAMI </strong>
          <span>for maximum passive income potential.</span>
        </p>
      </header>

      <div className="max-w-6xl px-4 m-auto text-center lg:grid lg:grid-cols-3 lg:gap-4">
        {apyPill}

        {compoundingPill}

        {tokensPerSharePill}
      </div>

      <section>
        <div className="bg-white mt-8 py-8 w-full">
          <div className="m-auto max-w-6xl px-4 w-full">
            <div className="font-semibold text-gray-600 uppercase">
              <Link to="/app" className="underline">
                /app
              </Link>
              /compound
            </div>

            <div className="mt-4 md:grid md:grid-cols-2 md:gap-4">
              <div className="leading-loose md:pr-4">
                <p>
                  Automatically compound your mUMAMI ETH rewards into more
                  mUMAMI to maximize your passive-income potential.
                </p>

                <a
                  href="https://arbisfinance.gitbook.io/umami-finance/tokenomics"
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

                <p className="underline font-semibold leading-loose mt-4">
                  You can deposit and withdraw mUMAMI at any time.
                </p>

                <Link
                  to="/app/marinate"
                  className="block font-semibold underline mt-4 duration-100 text-umami-pink max-w-[18rem] hover:text-umami-yellow"
                >
                  Deposit UMAMI for mUMAMI here!
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
                        amount: action === 'deposit' ? 0 : balances?.cmumami,
                      }}
                      onSubmit={({ amount }, { setSubmitting }) => {
                        action === 'deposit'
                          ? compoundMumami(String(amount))
                          : withdrawCompoundingMumami(String(amount))
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
                                  action === 'deposit' ? 'mUMAMI' : 'cmUMAMI'
                                }
                                labelAccent={
                                  action === 'deposit' ? (
                                    <button
                                      type="button"
                                      className="uppercase bg-gradient-to-b from-umami-purple to-umami-pink bg-clip-text text-transparent"
                                      onClick={() =>
                                        setFieldValue(
                                          'amount',
                                          balances?.mumami
                                        )
                                      }
                                    >
                                      Balance: {balances?.mumami.toFixed(2)}
                                    </button>
                                  ) : (
                                    <span className="bg-gradient-to-b from-umami-purple to-umami-pink bg-clip-text text-transparent">
                                      ~
                                      {(
                                        Number(tokensPerShare) *
                                        Number(values.amount)
                                      ).toFixed(3)}
                                      <span> mUMAMI </span>
                                    </span>
                                  )
                                }
                                name="amount"
                              />

                              <div className="flex items-center py-4">
                                {allowances?.mumami ? (
                                  <Button
                                    className="max-w-[100%]"
                                    type="submit"
                                    disabled={!values.amount}
                                  >
                                    {action === 'deposit'
                                      ? 'Compound'
                                      : 'Withdraw'}
                                  </Button>
                                ) : (
                                  <Button
                                    className="max-w-[100%]"
                                    onClick={approveMumami}
                                  >
                                    Approve
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Form>
                        </fieldset>
                      )}
                    </Formik>

                    <div className="mt-8 flex flex-col items-center justify-center text-center">
                      <div className="text-lg">
                        <span className="font-bold uppercase mr-2">
                          Compounding Balance:
                        </span>
                        <span>{balances?.cmumami.toFixed(6)}</span>
                        <span> cmUMAMI </span>
                      </div>
                    </div>
                  </FormCard.Content>
                </FormCard>
              </div>
            </div>

            <div className="mt-20 flex items-center justify-center">
              <a
                href={`https://arbiscan.io/address/${TOKEN_ADDRESSES.cmumami}`}
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
