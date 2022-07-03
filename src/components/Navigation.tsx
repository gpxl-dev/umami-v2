import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import ClickAwayListener from 'react-click-away-listener'
import { useLocation } from 'react-router-dom'

import NavLink from './NavLink'
import MobileNavigation from './MobileNavigation'
import AccountButton from './AccountButton'
import { NAV_LINKS } from '../constants'

export default function Navigation() {
  const appLocation = useLocation()
  const [isEarnOpen, setEarnOpen] = React.useState(false)

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

  const activeLinkClasses =
    'text-umami-pink'

  const earnLinks = React.useMemo(() => {
    return isEarnOpen ? (
      <ClickAwayListener onClickAway={closeEarn}>
        <div className="absolute left-[-50%] top-[100%] bg-gradient-to-b from-umami-pink to-umami-purple p-[1px] mt-2 rounded-md">
          <div className="bg-black rounded-md py-2 px-4 text-lg">
            <ul className="text-center text-white">
              {NAV_LINKS.earn.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    activeClassName={activeLinkClasses}
                    className="hover:underline"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ClickAwayListener>
    ) : null
  }, [isEarnOpen, closeEarn])

  return (
    <div className="w-full px-4">
      <div className="w-full max-w-6xl m-auto flex items-center justify-between h-[80px]">
        <strong className="font-display text-4xl text-white drop-shadow-[1px_1px_rgb(0,0,0,1)] uppercase tracking-[1rem]">
          Umami
        </strong>

        <div className="md:hidden">
          <MobileNavigation />
        </div>

        <div className="hidden md:flex-1 md:flex md:items-center md:justify-end md:w-full">
          <nav className="flex-1 pt-2 flex items-center justify-end h-full mr-4">
            <ul className="flex items-center font-display text-2xl text-white uppercase">
              <li className="mr-4">
                <NavLink
                  to="/app"
                  activeClassName={activeLinkClasses}
                  className="hover:underline"
                >
                  Home
                </NavLink>
              </li>

              <li className="mr-4">
                <div className="relative">
                  <button
                    type="button"
                    className={`${
                      isEarnOpen ||
                      appLocation.pathname.includes('marinate') ||
                      appLocation.pathname.includes('compound')
                        ? activeLinkClasses
                        : 'text-white'
                    } hover:underline uppercase`}
                    onClick={isEarnOpen ? closeEarn : openEarn}
                  >
                    Earn
                  </button>
                  {earnLinks}
                </div>
              </li>

              <li className="mr-4">
                <NavLink
                  to="/app/vaults"
                  activeClassName={activeLinkClasses}
                  className="hover:underline"
                >
                  Vaults
                </NavLink>
              </li>

              <li className="mr-4">
                <NavLink
                  to="/app/buy"
                  activeClassName={activeLinkClasses}
                  className="hover:underline"
                >
                  Buy
                </NavLink>
              </li>

              <li className="mr-2">
                <a
                  href="https://app.uniswap.org/#/swap?chain=arbitrum&inputCurrency=eth&outputCurrency=0x1622bF67e6e5747b81866fE0b85178a93C7F86e3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span className="mr-2">Swap</span>
                  <FaExternalLinkAlt className="inline pb-2" />
                </a>
              </li>

              <li>
                <a
                  href="https://arbisfinance.gitbook.io/umami-finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span className="mr-2">Docs</span>
                  <FaExternalLinkAlt className="inline pb-2" />
                </a>
              </li>
            </ul>
          </nav>

          <AccountButton />
        </div>
      </div>
    </div>
  )
}
