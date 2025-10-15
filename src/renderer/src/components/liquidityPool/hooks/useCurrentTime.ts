import { useEffect, useState } from 'react'

export const useCurrentTime = (intervalMs = 1000): number => {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, intervalMs)
    return () => clearInterval(interval)
  }, [intervalMs])

  return currentTime
}
