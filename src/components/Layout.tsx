import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Outlet } from 'react-router-dom'

import WagmiProvider from './WagmiProvider'
import ThemeProvider from './ThemeProvider'
import Notifications from './Notifications'
import Navigation from './Navigation'
import Footer from './Footer'
import Disclaimer from './Disclaimer'
import { useIsLandingPage } from '../hooks/useIsLandingPage'

const GlobalStyle = createGlobalStyle`
  :root {
    --color-umami-pink: #C659D8;
    --color-umami-purple: #60489D;
    --color-umami-yellow: #FFC225;
    --color-dark: #000;
    --color-dark-alt: #2a2b2e;
    --color-light: #ffffff;
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }

  input[type=number] {
      -moz-appearance: textfield;
  }
`

export default function Layout() {
  const isLandingPage = useIsLandingPage()

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
      <ThemeProvider>
        <WagmiProvider>
          <Notifications />
          <div className="fixed inset-0 bg-black bg-opacity-[75%] overflow-y-auto">
            {appNav}
            <Outlet />
            <Footer />
          </div>
        </WagmiProvider>
      </ThemeProvider>
    </>
  )
}
