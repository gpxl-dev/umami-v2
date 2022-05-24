import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Earn from './pages/Earn'

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Landing />} />
				<Route path="app" element={<Earn />}>
					<Route path="marinate" />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	)
}

export default App
