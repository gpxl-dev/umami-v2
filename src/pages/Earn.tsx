import React from 'react'
import { Link } from 'react-router-dom'

import PageContent from '../components/PageContent'
import EarnCard from '../components/EarnCard'
import Button from '../components/Button'
import LoadingBar from '../components/LoadingBar'
import { useUmamiPrice } from '../hooks/useUmamiPrice'
import { useAPI } from '../hooks/useAPI'
import { useEstProtocolRevenue } from '../hooks/useEstProtocolRevenue'

export default function Earn() {
  const { data: umamiPrice } = useUmamiPrice()

  const { data: apiData } = useAPI()

  const estMonthlyRevenue = useEstProtocolRevenue()

  const marinateAPR = React.useMemo(() => {
    return apiData?.marinate?.apr ? (
      `~${apiData?.marinate.apr}% APR`
    ) : (
      <LoadingBar />
    )
  }, [apiData])

  const compoundAPY = React.useMemo(() => {
    return apiData?.marinate?.apy ? (
      `~${apiData?.marinate.apy}% APY`
    ) : (
      <LoadingBar />
    )
  }, [apiData])

  const earnHeader = React.useMemo(() => {
    return (
      <header>
        <ul className="flex flex-col items-center justify-center text-center text-white">
          {apiData?.tvl ? (
            <li className="mt-6">
              <div className="font-bold text-2xl">TVL:</div>
              <div className="text-lg">
                {apiData?.marinate?.marinateTVL ? (
                  <span>
                    $
                    {Intl.NumberFormat('en-US').format(
                      apiData?.marinate?.marinateTVL
                    )}
                  </span>
                ) : (
                  <LoadingBar className="w-[12rem]" />
                )}
              </div>
            </li>
          ) : (
            <li className="mt-6">
              <div className="font-bold text-2xl">Market Cap:</div>
              <div className="text-lg">
                {Number(umamiPrice) > 0 ? (
                  <span>{Number(umamiPrice) * 1000000}</span>
                ) : (
                  <LoadingBar className="w-[12rem]" />
                )}
              </div>
            </li>
          )}
          <li className="mt-6">
            <div className="font-bold text-2xl">Est. Monthly Revenue</div>
            <div className="text-lg">
              {estMonthlyRevenue !== null ? (
                <span>${estMonthlyRevenue}</span>
              ) : (
                <LoadingBar className="w-[12rem]" />
              )}
            </div>
          </li>
          <li className="mt-6">
            <div className="font-bold text-2xl">$UMAMI:</div>
            {typeof umamiPrice === 'number' ? (
              <div className="text-lg">${Number(umamiPrice).toFixed(2)}</div>
            ) : (
              <LoadingBar className="w-[12rem]" />
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
        <PageContent className="mt-20 bg-white p-4 w-full">
          <div className="w-full m-auto -translate-y-12 grid grid-rows-2 gap-4 md:max-w-4xl md:m-auto md:grid-cols-2 md:grid-rows-1">
            {/* Marinate Card */}
            <EarnCard
              footer={
                <div className="p-4 text-white font-display text-center text-2xl">
                  WETH REWARDS
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
                    <span>and earn steady passive income in</span>
                    <strong> WETH </strong>
                    <span>from Umami's protocol revenue.</span>
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
                    <span>Compound</span>
                    <strong> WETH </strong>
                    <span>rewards for more</span>
                    <strong> mUMAMI </strong>
                    <span>to maximize your passive income potential.</span>
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
        </PageContent>
      </section>
    </main>
  )
}
