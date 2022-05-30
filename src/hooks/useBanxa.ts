import React from 'react'

export function useBanxa() {
  const supportedCurrencies = [
    'ARS',
    'AUD',
    'BRL',
    'CAD',
    'CZK',
    'DKK',
    'EUR',
    'HKD',
    'INR',
    'MYR',
    'MXN',
    'NZD',
    'NOK',
    'PHP',
    'GBP',
    'QAR',
    'IDR',
    'SAR',
    'SGD',
    'ZAR',
    'KRW',
    'SEK',
    'CHF',
    'THB',
    'TRY',
    'TWD',
    'AED',
    'USD',
    'VND',
    'JPY',
    'PLN',
  ]

  const getCheckoutLink = React.useCallback(
    (inputCurrency: string, fiatAmount: number | string) => {
      const blockchain = 'ETH'
      const coinType = 'ETH'

      return `https://umami.banxa.com/?coinType=${coinType}&fiatType=${inputCurrency}&fiatAmount=${fiatAmount}&blockchain=${blockchain}`
    },
    []
  )

  return { getCheckoutLink, supportedCurrencies }
}
