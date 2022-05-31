import React from 'react'
import { Link } from 'react-router-dom'

import Button from '../components/Button'
import LandingPartners from '../components/LandingPartners'

export default function Landing() {
  return (
    <main>
      <header>
        <div className="flex flex-col w-full items-center justify-center py-8">
          <h2 className="font-display text-center text-4xl md:text-6xl text-white tracking-[1rem] drop-shadow-[1px_1px_rgb(0,0,0,1)] uppercase">
            Umami
          </h2>

          <h1 className="font-bold text-white text-2xl uppercase mt-32 max-w-xl leading-snug text-center text-shadow-lg md:mt-20 md:leading-[4rem] md:text-4xl">
            Sustainable, Risk-Hedged Arbitrum Yields
          </h1>

          <Link
            to="/app"
            className="flex items-center justify-center max-w-xs w-full"
          >
            <Button className="text-3xl mt-12">Enter App</Button>
          </Link>
        </div>
      </header>

      <section>
        <div className="bg-white p-4 py-24 h-full">
          <div className="flex flex-col items-center justify-center max-w-3xl m-auto">
            <p className="text-center text-lg">
              Umami’s expanding menu of strategy vaults and staking options
              offers sustainable, risk-hedged passive income in WETH and USDC
              sourced from across Arbitrum’s DeFi ecosystem.
            </p>
          </div>

          <div className="mt-20">
            <LandingPartners />
          </div>
        </div>
      </section>
    </main>
  )
}
