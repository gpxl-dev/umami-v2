import React from 'react'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

export function useAPI() {
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const fetchData = React.useCallback(async () => {
    try {
      const { data } = await axios('https://horseysauce.xyz')

      return data
    } catch (err) {
      console.log(err)
      notify('Error fetching data from our API', 'error')
    }
  }, [notify])

  return useQuery('apiData', fetchData, {
    initialData: queryClient.getQueryData('apiData') ?? null,
    refetchInterval: 60000,
  })
}
