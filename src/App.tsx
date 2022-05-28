import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from 'reapop'
import { QueryClient, QueryClientProvider } from 'react-query'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Earn from './pages/Earn'
import Marinate from './pages/Marinate'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      refetchInterval: false,
      refetchOnReconnect: false,
      retryDelay(attempt) {
        return attempt * 5000
      },
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="app" element={<Earn />} />
            <Route path="app/marinate" element={<Marinate />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </NotificationsProvider>
    </QueryClientProvider>
  )
}

export default App
