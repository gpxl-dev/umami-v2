import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from 'reapop'
import { QueryClient, QueryClientProvider } from 'react-query'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Earn from './pages/Earn'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<NotificationsProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Landing />} />
						<Route path="app" element={<Earn />}>
							<Route path="marinate" />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</NotificationsProvider>
		</QueryClientProvider>
	)
}

export default App
