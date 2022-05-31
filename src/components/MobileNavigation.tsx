import React from 'react'
import styled from 'styled-components'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import NavLink from './NavLink'
import Button from './Button'
import SocialLinks from './SocialLinks'
import AccountButton from './AccountButton'
import { NAV_LINKS } from '../constants'

const MobileNavigationContainer = styled.div`
  background: #000000;
  background-image: url("/assets/umami-finance-neotokyo-bg.png");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: top left;

  @media (min-width: 400px) {
    background-size: cover;
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
              activeClassName="bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent"
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
            <div className="flex h-full h-screen w-screen bg-black bg-opacity-[75%] overflow-y-auto">
              <div className="flex flex-1 flex-col items-center p-4">
                <strong className="text-white font-display text-6xl drop-shaodw-[1px_1px_rgb(0,0,0,1)] tracking-[1.5rem] uppercase">
                  Umami
                </strong>

                <nav>
                  <ul className="font-display text-5xl text-shadow-[1px_1px_rgb(0,0,0,1)] text-white uppercase text-center mt-8">
                    <li>
                      <NavLink
                        to="/app"
                        activeClassName="bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent"
                      >
                        Home
                      </NavLink>
                    </li>

                    <li className="mt-4 -mr-8">
                      <button
                        type="button"
                        className="flex items-center uppercase text-white"
                        onClick={isEarnOpen ? closeEarn : openEarn}
                      >
                        <span className="mr-4">Earn</span>
                        {isEarnOpen ? (
                          <FaChevronUp className="inline text-4xl pb-2" />
                        ) : (
                          <FaChevronDown className="inline text-4xl pb-2" />
                        )}
                      </button>
                      <div className="-ml-8">{earnOptions}</div>
                    </li>

                    <li className="mt-4">
                      <NavLink
                        to="/app/buy"
                        activeClassName="bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent"
                      >
                        Buy
                      </NavLink>
                    </li>

                    <li className="mt-4">
                      <a
                        href="https://app.uniswap.org/#/swap?chain=arbitrum&inputCurrency=eth&outputCurrency=0x1622bF67e6e5747b81866fE0b85178a93C7F86e3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="mr-2">Swap</span>
                      </a>
                    </li>
                  </ul>
                </nav>

                <div className="text-white mt-8">
                  <SocialLinks className="text-3xl mr-6" />
                </div>

                <div className="flex flex-col items-center justify-center w-full mt-8">
                  <AccountButton />

                  <Button
                    type="button"
                    className="mt-4"
                    onClick={closeNavigation}
                  >
                    Close Menu
                  </Button>
                </div>
              </div>
            </div>
          </MobileNavigationContainer>,
          document.querySelector('body') as Element
        )
      : null
  }, [isOpen, openEarn, closeEarn, earnOptions, closeNavigation, isEarnOpen])

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
