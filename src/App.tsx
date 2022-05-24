import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Landing from './pages/Landing'

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Landing />} />
				<Route path="app">
					<Route path="marinate" />
				</Route>
			</Route>
		</Routes>
	)
}

export default App
