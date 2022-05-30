import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      refetchInterval: false,
      refetchOnReconnect: false,
      retryDelay(attempt) {
        return attempt * 5000
      },
      notifyOnChangeProps: ['data'],
    },
  },
})

export default function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
