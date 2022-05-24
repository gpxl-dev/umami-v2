import React from 'react'
import styled from 'styled-components'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'

import Button from './Button'
import SocialLinks from './SocialLinks'
import { NAV_LINKS } from '../constants'

const MobileNavigationContainer = styled.div`
  animation: 0.2s slide-down linear;
  background: #000000;
  background-image: url("/assets/umami-finance-neotokyo-bg.png");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: top left;

  @media (min-width: 450px) {
    background-size: cover;
  }

  @keyframes slide-down {
    from {
      transform: translateY(-100%);
    }

    to {
      transform: translateY(0%);
    }
  }
`

export default function MobileNavigation() {
	const [isOpen, setOpen] = React.useState(false)
	const [isEarnOpen, setEarnOpen] = React.useState(false)
	const [currentPathname, setCurrentPathname] = React.useState<string | null>(
		null
	)
	const { pathname } = useLocation()

	const openNavigation = React.useCallback(() => {
		if (!isOpen) {
			setOpen(true)
		}
	}, [isOpen])

	const closeNavigation = React.useCallback(() => {
		if (isOpen) {
			setOpen(false)
		}
	}, [isOpen])

	const openEarn = React.useCallback(() => {
		if (!isEarnOpen) {
			setEarnOpen(true)
		}
	}, [isEarnOpen])

	const closeEarn = React.useCallback(() => {
		if (isEarnOpen) {
			setEarnOpen(false)
		}
	}, [isEarnOpen])

	const handleCurrentPathname = React.useCallback(() => {
		if (currentPathname === null) {
			setCurrentPathname(pathname)
		}
	}, [currentPathname, pathname])

	const handleLocationChange = React.useCallback(() => {
		if (currentPathname !== null && currentPathname !== pathname) {
			closeEarn()
			closeNavigation()
			setCurrentPathname(null)
		}
	}, [currentPathname, pathname, closeEarn, closeNavigation])

	React.useEffect(handleCurrentPathname, [handleCurrentPathname])

	React.useEffect(handleLocationChange, [handleLocationChange])

	const earnOptions = React.useMemo(() => {
		return isEarnOpen ? (
			<ul className="text-2xl">
				{NAV_LINKS.earn.map(({ label, path }) => (
					<li key={path} className="mt-4">
						<NavLink
							to={path}
							className={(isActive) =>
								`${
									isActive
										? 'bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent'
										: ''
								}`
							}
						>
							{label}
						</NavLink>
					</li>
				))}
			</ul>
		) : null
	}, [isEarnOpen])

	const navigationDisplay = React.useMemo(() => {
		return isOpen
			? createPortal(
				<MobileNavigationContainer
					role="dialog"
					aria-modal={true}
					className="fixed inset-0"
				>
					<div className="flex h-full min-h-[100vh] w-screen bg-black bg-opacity-[75%]">
						<div className="flex flex-1 flex-col items-center justify-between p-4">
							<strong className="text-white font-display text-6xl drop-shaodw-[1px_1px_rgb(0,0,0,1)] tracking-[1.5rem] uppercase">
                  Umami
							</strong>

							<nav>
								<ul className="font-display min-h-[300px] text-5xl text-shadow-[1px_1px_rgb(0,0,0,1)] text-white uppercase text-center">
									<li>
										<NavLink
											to="/app"
											className={(isActive) =>
												isActive
													? 'bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent'
													: ''
											}
										>
                        Home
										</NavLink>
									</li>
									<li className="mt-4">
										<button
											type="button"
											className="uppercase"
											onClick={isEarnOpen ? closeEarn : openEarn}
										>
                        Earn
										</button>
										{earnOptions}
									</li>
								</ul>
							</nav>

							<div className="text-white">
								<SocialLinks className="text-3xl mr-6" />
							</div>

							<Button type="button" onClick={closeNavigation}>
                  Close Menu
							</Button>
						</div>
					</div>
				</MobileNavigationContainer>,
          document.querySelector('body') as Element
			)
			: null
	}, [isOpen, openEarn, closeEarn, earnOptions])

	return (
		<>
			<button
				type="button"
				onClick={openNavigation}
				className="text-white text-4xl"
			>
				<span className="sr-only">Open mobile navigation</span>
				<FiMenu />
			</button>
			{navigationDisplay}
		</>
	)
}
