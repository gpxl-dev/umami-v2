import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { useLocation, Outlet } from 'react-router-dom'

import Navigation from './Navigation'
import Footer from './Footer'

const GlobalStyle = createGlobalStyle`
  body {
    background-image: url('/assets/umami-finance-neotokyo-bg.png');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: top left;

    @media (min-width: 450px) {
      background-size: cover;
    }
  }
`

export default function Layout() {
	const appLocation = useLocation()

	const isLandingPage = React.useMemo(() => {
		return appLocation.pathname === '/'
	}, [appLocation.pathname])

	const appNav = React.useMemo(() => {
		return !isLandingPage ? <Navigation /> : null
	}, [isLandingPage])

	return (
		<>
			<GlobalStyle />
			<div className="fixed inset-0 bg-black bg-opacity-[75%] overflow-y-auto">
				{appNav}
				<div className="min-h-[69vh]">
					<Outlet />
				</div>
				<Footer />
			</div>
		</>
	)
}
