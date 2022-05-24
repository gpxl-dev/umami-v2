import React from 'react'
import { Link } from 'react-router-dom'
import { FaExternalLinkAlt } from 'react-icons/fa'

import SocialLinks from './SocialLinks'
import { NAV_LINKS } from '../constants'

export default function Footer() {
	const footerNavLinks = React.useMemo(() => {
		return NAV_LINKS.earn.map(({ label, path }) => (
			<li key={path} className="text-sm font-light">
				<Link to={path} className="hover:underline">
					{label}
				</Link>
			</li>
		))
	}, [])

	const currentYear = React.useMemo(() => {
		return new Date().getFullYear()
	}, [])

	return (
		<div className="bg-black w-full min-h-[300px] py-8">
			<div className="text-white">
				<SocialLinks />
			</div>

			<div className="m-auto max-w-4xl w-full px-4 mt-8 text-white">
				<div className="w-full flex justify-center">
					<Link to="/app" className="cursor-pointer">
						<strong className="font-display tracking-[0.5rem] text-lg uppercase">
              Umami
						</strong>
					</Link>
				</div>

				<div className="flex flex-col mt-8 md:grid md:grid-cols-2">
					<div className="flex flex-col w-full text-center md:text-left">
						<ul className="font-light">{footerNavLinks}</ul>
					</div>

					<div className="mt-8 text-sm w-full md:mt-0">
						<ul className="text-center text-white font-light md:text-right">
							<li>
								<a
									href="https://umamifinance.medium.com/"
									rel="noopener noreferrer"
									className="flex justify-center md:justify-end hover:underline"
								>
									<span className="mr-2">Umami Finance on Medium</span>
									<span className="text-xs">
										<FaExternalLinkAlt />
									</span>
								</a>
							</li>
							<li>
								<a
									href="https://arbis.finance"
									rel="noopener noreferrer"
									className="flex justify-center md:justify-end hover:underline"
								>
									<span className="mr-2">Arbis Finance</span>
									<span className="text-xs">
										<FaExternalLinkAlt />
									</span>
								</a>
							</li>
							<li>
								<a
									href="https://app.uniswap.org/#/swap?chain=arbitrum&inputCurrency=eth&outputCurrency=0x1622bF67e6e5747b81866fE0b85178a93C7F86e3"
									rel="noopener noreferrer"
									className="flex justify-center md:justify-end hover:underline"
								>
									<span className="mr-2">Swap on Uniswap</span>
									<span className="text-xs">
										<FaExternalLinkAlt />
									</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-12 text-xs uppercase text-center text-white">
				{currentYear} Umami Finance
			</div>
		</div>
	)
}
