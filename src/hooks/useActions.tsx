import React from 'react'

export function useActions() {
  const [action, setAction] = React.useState('deposit')

  const selectDeposit = React.useCallback(() => {
    if (action !== 'deposit') {
      setAction('deposit')
    }
  }, [action])

  const selectWithdraw = React.useCallback(() => {
    if (action !== 'withdraw') {
      setAction('withdraw')
    }
  }, [action])

  const toggleAction = React.useCallback(() => {
    setAction(action === 'deposit' ? 'withdraw' : 'deposit')
  }, [action])

  return { action, selectWithdraw, selectDeposit, toggleAction }
}
