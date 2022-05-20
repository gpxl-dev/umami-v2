import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Outlet } from 'react-router-dom'

import Footer from './Footer'

const GlobalStyle = createGlobalStyle`
  body {
    background-image: url('/assets/umami-finance-neotokyo-bg.png');
    background-attachment: fixed;
    background-size: 100%;
    background-position: top left;

    @media (min-width: 768px) {
      background-size: cover;
    }
  }
`

export default function Layout() {
	return (
		<>
			<GlobalStyle />
			<div className="fixed inset-0 bg-black bg-opacity-[69%] overflow-y-auto">
				<Outlet />
				<Footer />
			</div>
		</>
	)
}
