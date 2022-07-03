import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { FaExternalLinkAlt, FaChevronCircleDown } from 'react-icons/fa'

import PageContent from '../components/PageContent'
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

  const calcTokensFromShares = React.useCallback(
    (amount: number | string) => {
      return Number(amount) * Number(tokensPerShare)
    },
    [tokensPerShare]
  )

  const calcConvertedToken = React.useCallback(
    (amount: number | string) => {
      if (!amount || !tokensPerShare) {
        return 0
      }

      return action === 'withdraw'
        ? calcTokensFromShares(String(amount))
        : Number(amount) / Number(tokensPerShare)
    },
    [tokensPerShare, action, calcTokensFromShares]
  )

  const compoundAPY = React.useMemo(() => {
    return apiData?.marinate?.apy ?? null
  }, [apiData])

  const apyPill = React.useMemo(() => {
    return (
      compoundAPY ? (
        <Pill className="mt-8 m-auto text-xl min-w-[100%]">
          ~{compoundAPY}% APY
        </Pill>
      ) : null
    )
  }, [compoundAPY])

  const compoundingPill = React.useMemo(() => {
    return typeof totalCompoundingMumami === 'string' ? (
      <Pill className="mt-8 text-xl m-auto uppercase min-w-[100%]">
        <span>mUMAMI Deposited: </span>
        {Intl.NumberFormat('en-uS').format(
          Math.floor(Number(totalCompoundingMumami))
        )}
      </Pill>
    ) : null
  }, [totalCompoundingMumami])

  const tokensPerSharePill = React.useMemo(() => {
    return tokensPerShare ? (
      <Pill className="mt-8 text-xl m-auto uppercase min-w-[100%]">
        1 UMAMI : {Number(tokensPerShare).toFixed(3)} cMUMAMI
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
          <strong> WETH </strong>
          <span>rewards into more</span>
          <strong> mUMAMI </strong>
          <span>for maximum passive income potential.</span>
        </p>
      </header>

      <div className="max-w-md px-4 m-auto text-center lg:grid lg:grid-rows-3">
        {apyPill}

        {compoundingPill}

        {tokensPerSharePill}
      </div>

      <section>
        <PageContent className="mt-8 py-8 w-full">
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
                  Automatically compound your mUMAMI WETH rewards into more
                  mUMAMI to maximize your passive-income potential.
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
                                      className="font-bold uppercase text-umami-pink hover:underline"
                                      onClick={() =>
                                        setFieldValue(
                                          'amount',
                                          balances?.mumami
                                        )
                                      }
                                    >
                                      Deposit max
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="font-bold uppercase text-umami-pink hover:underline"
                                      onClick={() =>
                                        setFieldValue(
                                          'amount',
                                          balances?.cmumami
                                        )
                                      }
                                    >
                                      Withdraw max
                                    </button>
                                  )
                                }
                                name="amount"
                              />

                              <div className="mt-6 text-2xl flex items-center justify-center w-full">
                                <FaChevronCircleDown />
                              </div>

                              <label htmlFor="receiveAmount">
                                <div className="text-sm font-bold">
                                  {action === 'deposit' ? 'cmUMAMI' : 'mUMAMI'}
                                </div>
                                <input
                                  name="receiveAmount"
                                  type="number"
                                  className="rounded border mt-2 px-2 h-10 text-lg font-bold bg-white disabled:opacity-100 text-black w-full disabled:cursor-not-allowed"
                                  disabled
                                  value={calcConvertedToken(
                                    String(values.amount)
                                  )}
                                />
                              </label>

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

                    <div className="mt-4 flex flex-col text-center items-center">
                      <div className="text-lg">
                        <span className="block md:inline font-bold uppercase mr-2">
                          Compounding Balance:
                        </span>
                        <span>{balances?.cmumami.toFixed(5)}</span>
                        <span> cmUMAMI </span>
                      </div>

                      <div className="text-lg mt-2">
                        <span className="block md:inline font-bold uppercase mr-2">
                          Marinating Balance:
                        </span>
                        <span>{balances?.mumami.toFixed(5)}</span>
                        <span> mUMAMI </span>
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
