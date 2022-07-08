import React from 'react'
import { Helmet } from 'react-helmet'

import PageContent from '../components/PageContent'
import VaultCard from '../components/VaultCard'
import { useGlpTcrUsdcPoolInfo } from '../hooks/useGlpTcrUsdcPoolInfo'

export default function Vaults() {
  const { data: poolInfo } = useGlpTcrUsdcPoolInfo()

  return (
    <>
      <Helmet>
        <title>Umami Finance | Vaults</title>
      </Helmet>

      <main>
        <header className="text-center mt-12 p-4 min-h-[300px]">
          <h1 className="font-bold text-5xl text-white tracking-widest uppercase md:text-6xl">
            Vaults
          </h1>

          <p className="text-center text-white max-w-2xl mt-4 m-auto">
            Customize your portfolio using Umami’s yield-maximized vaults.
            Strategies range from delta-neutral to full-market-exposure. All
            vaults use the ERC-4626 standard to provide depositors with
            fully-fungible, tradeable receipt-tokens.
          </p>
        </header>
      </main>

      <section>
        <PageContent className="min-h-[50vh]">
          <div className="-translate-y-12 px-4 max-w-2xl m-auto">
            <VaultCard
              title="GLP/TCR USDC Pool"
              url="/app/vaults/glp-tcr-usdc-pool"
              tokens={{
                deposit: 'USDC',
                earn: 'USDC',
                receipt: poolInfo?.symbol ?? '...',
              }}
              apr="23.4"
              fees="1-15-0"
              deposits={{
                current: poolInfo?.totalDeposits ?? 0,
                capacity: poolInfo?.capacity ?? 0,
              }}
            />
          </div>
        </PageContent>
      </section>
    </>
  )
}
