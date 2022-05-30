import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from 'reapop'

import QueryProvider from './components/QueryProvider'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Earn from './pages/Earn'
import Marinate from './pages/Marinate'
import Compound from './pages/Compound'

function App() {
  return (
    <QueryProvider>
      <NotificationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="app" element={<Earn />} />
            <Route path="app/marinate" element={<Marinate />} />
            <Route path="app/compound" element={<Compound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </NotificationsProvider>
    </QueryProvider>
  )
}

export default App
