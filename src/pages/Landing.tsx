import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import LandingPartners from '../components/LandingPartners'

export default function Landing() {
	const navigate = useNavigate()

	const navigateToApp = React.useCallback(() => {
		navigate('/app')
	}, [navigate])

	return (
		<main>
			<header>
				<div className="flex flex-col w-full items-center justify-center py-8">
					<h2 className="font-display text-center text-4xl md:text-6xl text-white tracking-[1rem] text-shadow-[1px_1px_rgb(0,0,0,1)] uppercase">
            Umami
					</h2>

					<h1 className="font-bold text-white text-3xl uppercase mt-32 max-w-md leading-snug text-center text-shadow-lg md:mt-20 md:leading-[4rem] md:text-4xl">
            Market-Hedged Arbitrum Yields
					</h1>

					<Button onClick={navigateToApp} className="text-3xl mt-12">
            Enter App
					</Button>
				</div>
			</header>

			<section>
				<div className="bg-white p-4 py-12">
					<div className="flex flex-col items-center justify-center max-w-md m-auto">
						<p className="text-center text-lg">
              Build a customizable Arbitrum portfolio from Umami’s menu of
              market-hedged, yield-optimized strategies.
						</p>

						<LandingPartners />
					</div>
				</div>
			</section>
		</main>
	)
}
