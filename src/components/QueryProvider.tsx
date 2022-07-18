import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      notifyOnChangeProps: ['data', 'error'],
      staleTime: 20 * 1000,
    },
  },
})

export default function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
