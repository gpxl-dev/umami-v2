import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'

import Pill from '../components/Pill'
import FormCard from '../components/FormCard'
import Button from '../components/Button'
import { useAPI } from '../hooks/useAPI'
import { useActions } from '../hooks/useActions'

export default function Marinate() {
  const { data: apiData } = useAPI()
  const { action, selectDeposit, selectWithdraw } = useActions()

  const marinateAPY = React.useMemo(() => {
    return apiData?.marinate.apy ?? null
  }, [apiData])

  const apyPill = React.useMemo(() => {
    return marinateAPY ? (
      <Pill className="mt-8 m-auto w-48 text-2xl">~{marinateAPY}% APY</Pill>
    ) : null
  }, [marinateAPY])

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
                    initialValues={{ amount: 0 }}
                    onSubmit={(values) => console.log(values)}
                  >
                    {({ values, isSubmitting }) => (
                      <fieldset disabled={isSubmitting}>
                        <Form method="post">
                          <div className="flex flex-col">
                            <FormCard.FormField label="Umami" name="amount" />

                            <div className="flex flex-col items-center mt-4 md:flex-row">
                              <Button type="submit" className="md:mr-2">
                                Marinate
                              </Button>
                              <Button type="submit" className="mt-2 md:mt-0" disabled>
                                Claim Rewards
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </fieldset>
                    )}
                  </Formik>
                </FormCard.Content>
              </FormCard>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
