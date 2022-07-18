import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from 'reapop'
import { ReactQueryDevtools } from 'react-query/devtools'

import QueryProvider from './components/QueryProvider'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Earn from './pages/Earn'
import Marinate from './pages/Marinate'
import Compound from './pages/Compound'
import Buy from './pages/Buy'
import Vaults from './pages/Vaults'
import GlpTcrUsdcPoolVault from './pages/GlpTcrUsdcPoolVault'
import Vault from './pages/Vault'

function App() {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <NotificationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="app" element={<Earn />} />
            <Route path="app/marinate" element={<Marinate />} />
            <Route path="app/compound" element={<Compound />} />
            <Route path="app/buy" element={<Buy />} />
            <Route path="app/vaults" element={<Vaults />} />
            <Route
              path="app/vaults/glp-tcr-usdc-pool"
              element={<GlpTcrUsdcPoolVault />}
            />
            <Route path="app/vaults/:vaultName" element={<Vault />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </NotificationsProvider>
    </QueryProvider>
  )
}

export default App
