import React from 'react'

type Props = {
  to: number;
  className?: string;
};

export default function CountdownTimer({ to, className }: Props) {
  const [remaining, setRemaining] = React.useState<number | null>(null)

  const handleDates = React.useCallback(() => {
    setInterval(() => {
      const curr = new Date()
      const end = new Date(to)
      setRemaining(end.getTime() - curr.getTime())
    }, 1000)
  }, [to])

  const segments = React.useMemo(() => {
    if (!remaining) {
      return null
    }

    return {
      hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remaining % (1000 * 60)) / 1000),
    }
  }, [remaining])

  React.useEffect(() => {
    handleDates()
  }, [handleDates])

  return (
    <span className={className}>
      {segments ? (
        <>
          <span>
            {segments.hours < 10 ? `0${segments.hours}` : segments.hours}:
          </span>
          <span>
            {segments.minutes < 10 ? `0${segments.minutes}` : segments.minutes}:
          </span>
          <span>
            {segments.seconds < 10 ? `0${segments.seconds}` : segments.seconds}
          </span>
        </>
      ) : (
        <span>{remaining !== null ? 'Rebalancing' : '00:00:00'}</span>
      )}
    </span>
  )
}
