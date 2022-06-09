import React from 'react'
import { useLocation } from 'react-router-dom'

export function useIsLandingPage() {
  const appLocation = useLocation()

  const isLandingPage = React.useMemo(() => {
    return appLocation.pathname === '/'
  }, [appLocation.pathname])

  return isLandingPage
}
