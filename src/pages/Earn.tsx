import React from 'react'
import { Link } from 'react-router-dom'

import EarnCard from '../components/EarnCard'
import Button from '../components/Button'
import { useUmamiPrice } from '../hooks/useUmamiPrice'
import { useAPI } from '../hooks/useAPI'

export default function Earn() {
  const { data: umamiPrice } = useUmamiPrice()

  const { data: apiData, isError: isApiError } = useAPI()

  const estMonthlyRevenue = React.useMemo(() => {
    if (!apiData || !apiData?.tvl || isApiError) {
      return null
    }

    // total treasury APR
    const apr = 0.39731
    const estRevenue = (Number(apiData?.tvl) * apr) / 12

    return Intl.NumberFormat('en-US').format(Math.floor(estRevenue))
  }, [apiData, isApiError])

  const marinateAPR = React.useMemo(() => {
    if (!apiData?.marinate.apr) {
      return '10+% APR Typically'
    }

    return `~${apiData?.marinate.apr}% APR`
  }, [apiData])

  const compoundAPY = React.useMemo(() => {
    if (!apiData?.marinate.apy) {
      return '10+% APY Typically'
    }

    return `~${apiData?.marinate.apy}% APY`
  }, [apiData])

  const earnHeader = React.useMemo(() => {
    return (
      <header>
        <ul className="flex flex-col items-center justify-center text-center text-white">
          {apiData?.tvl ? (
            <li className="mt-6">
              <div className="font-bold text-2xl">TVL:</div>
              <div className="text-lg">
                ${Intl.NumberFormat('en-US').format(apiData?.tvl)}
              </div>
            </li>
          ) : (
            <li className="mt-6">
              <div className="font-bold text-2xl">Market Cap:</div>
              <div className="text-lg">$8,120,000</div>
            </li>
          )}
          <li className="mt-6">
            <div className="font-bold text-2xl">Est. Monthly Revenue</div>
            <div className="text-lg">
              ${estMonthlyRevenue ?? 'Typically $100,000+'}
            </div>
          </li>
          <li className="mt-6">
            <div className="font-bold text-2xl">$UMAMI:</div>
            {umamiPrice ? (
              <div className="text-lg">${Number(umamiPrice).toFixed(2)}</div>
            ) : (
              <div className="text-lg">Unable to fetch price data</div>
            )}
          </li>
        </ul>
      </header>
    )
  }, [umamiPrice, apiData, estMonthlyRevenue])

  return (
    <main>
      {earnHeader}

      <section>
        <div className="mt-20 bg-white p-4 w-full">
          <div className="w-full m-auto -translate-y-12 grid grid-rows-2 gap-4 md:max-w-4xl md:m-auto md:grid-cols-2 md:grid-rows-1">
            {/* Marinate Card */}
            <EarnCard
              footer={
                <div className="p-4 text-white font-display text-center text-2xl">
                  ETH REWARDS
                </div>
              }
            >
              <EarnCard.Header text="Marinate" />

              <EarnCard.SubHeader>{marinateAPR}</EarnCard.SubHeader>

              <EarnCard.Content>
                <div className="flex flex-col justify-between min-h-[150px]">
                  <p>
                    <span>
                      Deposit your <strong>UMAMI</strong> for
                    </span>
                    <strong> mUMAMI </strong>
                    <span>and earn daily passive income in </span>
                    <strong>ETH</strong>
                  </p>

                  <div className="mt-4">
                    <Link to="/app/marinate">
                      <Button className="text-2xl max-w-[100%]">
                        DEPOSIT UMAMI
                      </Button>
                    </Link>
                  </div>
                </div>
              </EarnCard.Content>
            </EarnCard>

            {/* Compound Card */}
            <EarnCard
              footer={
                <div className="p-4 text-white font-display text-center text-2xl uppercase">
                  mUMAMI REWARDS
                </div>
              }
            >
              <EarnCard.Header text="Compound" />

              <EarnCard.SubHeader>{compoundAPY}</EarnCard.SubHeader>

              <EarnCard.Content>
                <div className="flex flex-col justify-between min-h-[150px]">
                  <p>
                    <span>Earn boosted rewards in</span>
                    <strong> mUMAMI </strong>
                    <span>and maximize your passive income</span>
                  </p>

                  <div className="mt-4">
                    <Link to="/app/compound">
                      <Button className="text-2xl max-w-[100%]">
                        DEPOSIT mUMAMI
                      </Button>
                    </Link>
                  </div>
                </div>
              </EarnCard.Content>
            </EarnCard>
          </div>
        </div>
      </section>
    </main>
  )
}
