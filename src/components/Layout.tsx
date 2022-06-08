import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { useLocation, Outlet } from 'react-router-dom'

import WagmiProvider from './WagmiProvider'
import Notifications from './Notifications'
import Navigation from './Navigation'
import Footer from './Footer'
import Disclaimer from './Disclaimer'

const GlobalStyle = createGlobalStyle`
  :root {
    --color-umami-pink: #C659D8;
    --color-umami-purple: #60489D;
    --color-umami-yellow: #FFC225;
  }

  body {
    background-color: #000000;
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
    return !isLandingPage ? (
      <>
        <Disclaimer />
        <Navigation />
      </>
    ) : null
  }, [isLandingPage])

  return (
    <>
      <GlobalStyle />
      <WagmiProvider>
        <Notifications />
        <div className="fixed inset-0 bg-black bg-opacity-[75%] overflow-y-auto">
          {appNav}
          <Outlet />
          <Footer />
        </div>
      </WagmiProvider>
    </>
  )
}
