import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { FaExternalLinkAlt } from 'react-icons/fa'

import PageContent from '../components/PageContent'
import FormCard from '../components/FormCard'
import Button from '../components/Button'
import { useBanxa } from '../hooks/useBanxa'

export default function Buy() {
  const [ethAmount, setEthAmount] = React.useState('...')
  const { supportedCurrencies, getCheckoutLink } = useBanxa()

  const initialValues = {
    inputCurrency: 'USD',
    fiatAmount: 1000,
  }

  const handleSubmit = React.useCallback(
    (
      { inputCurrency, fiatAmount }: typeof initialValues,
      { resetForm }: { resetForm: () => void }
    ) => {
      const checkoutLink = getCheckoutLink(inputCurrency, fiatAmount)
      window.open(checkoutLink, '_blank', 'noopener noreferrer')
      resetForm()
    },
    [getCheckoutLink]
  )

  const getEthAmountFromFiatAmount = React.useCallback(
    async ({ fiatAmount, inputCurrency }: typeof initialValues) => {
      try {
        setEthAmount('...')
        const coingeckoURL = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${inputCurrency}`
        const { data } = await axios(coingeckoURL)
        const [fiatAmtPerEth] = Object.values(data.ethereum)
        setEthAmount(
          '~' +
            String(
              ((fiatAmount / (fiatAmtPerEth as number)) * 0.9425).toFixed(4)
            )
        )
      } catch (err) {
        setEthAmount('Unable to calculate estimated ETH amount')
        console.log(err)
      }
    },
    []
  )

  /* const handleReset = React.useCallback(
    (cb: () => void) => {
      getEthAmountFromFiatAmount({ fiatAmount: 1000, inputCurrency: 'usd' })
      cb()
    },
    [getEthAmountFromFiatAmount]
  ) */

  React.useEffect(() => {
    getEthAmountFromFiatAmount({ fiatAmount: 1000, inputCurrency: 'usd' })
  }, [getEthAmountFromFiatAmount])

  return (
    <main>
      <section>
        <PageContent className="mt-8 py-8 pb-16 w-full">
          <div className="m-auto max-w-lg px-4 w-full">
            <div className="font-semibold text-gray-600 uppercase">
              <Link to="/app" className="underline">
                /app
              </Link>
              /buy
            </div>

            <div className="max-w-3xl m-auto min-h-[500px] w-full mt-4">
              <div className="leading-loose">
                <p>
                  Seamlessly onramp over 30 different fiat currencies directly
                  to Arbitrum via Banxa.
                </p>

                <a
                  href="https://app.uniswap.org/#/swap?chain=arbitrum&inputCurrency=eth&outputCurrency=0x1622bF67e6e5747b81866fE0b85178a93C7F86e3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 max-w-sm hover:underline"
                >
                  <span className="mr-2">
                    Swap ETH for UMAMI on Uniswap v3 here.
                  </span>
                  <FaExternalLinkAlt className="inline pb-1" />
                </a>
              </div>

              <div className="mt-8">
                <FormCard>
                  <FormCard.Header>
                    <div className="font-bold text-center text-2xl uppercase w-full">
                      Buy ETH
                    </div>
                  </FormCard.Header>

                  <FormCard.Content>
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleSubmit}
                      onBlur
                      enableReinitialize
                    >
                      {({ values, isSubmitting, setFieldValue }) => (
                        <fieldset disabled={isSubmitting}>
                          <Form method="post">
                            <div className="flex flex-col">
                              <div className="gap-4 grid grid-cols-5">
                                <div className="col-span-3">
                                  <FormCard.FormField
                                    label="Amount"
                                    name="fiatAmount"
                                    onBlur={() =>
                                      getEthAmountFromFiatAmount(values)
                                    }
                                  />
                                </div>

                                <label
                                  htmlFor="inputCurrency"
                                  className="col-span-2"
                                >
                                  <div className="text-sm font-bold">
                                    Currency
                                  </div>
                                  <select
                                    value={values.inputCurrency}
                                    onChange={(e) =>
                                      setFieldValue(
                                        'inputCurrency',
                                        e.target.value
                                      )
                                    }
                                    onBlur={() =>
                                      getEthAmountFromFiatAmount(values)
                                    }
                                    className="rounded border mt-2 px-2 h-10 text-lg font-bold bg-white text-black w-full disabled:cursor-not-allowed"
                                  >
                                    {supportedCurrencies.map(
                                      (curr: typeof supportedCurrencies[0]) => (
                                        <option value={curr} key={curr}>
                                          {curr}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </label>
                              </div>

                              <div className="mt-2">
                                <label htmlFor="ethAmount">
                                  <div className="text-sm font-bold">
                                    <div className="flex justify-between items-center">
                                      Receive:
                                    </div>
                                  </div>
                                  <input
                                    name="ethAmount"
                                    type="text"
                                    className="rounded border mt-2 px-2 h-10 text-lg font-bold bg-white text-black w-full disabled:opacity-100 disabled:cursor-not-allowed"
                                    value={`${ethAmount} ETH`}
                                    disabled
                                  />
                                </label>
                              </div>

                              <div className="flex flex-col items-center mt-4 md:flex-row">
                                <Button type="submit" className="max-w-[100%]">
                                  Checkout on Banxa
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
        </PageContent>
      </section>
    </main>
  )
}
