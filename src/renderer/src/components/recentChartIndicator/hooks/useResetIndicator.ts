import { useEffect } from 'react'

export const useResetIndicator = ({
  chartRef,
  isUserInteracting,
  isSignificantlyBehind,
  setShowResetIndicator
}: {
  chartRef
  isUserInteracting
  isSignificantlyBehind
  setShowResetIndicator
}): void => {
  useEffect(() => {
    if (!chartRef.current) return

    const checkInterval = setInterval(() => {
      if (!isUserInteracting) {
        const shouldShow = isSignificantlyBehind()
        setShowResetIndicator(shouldShow)
      }
    }, 2000)

    return () => clearInterval(checkInterval)
  }, [isUserInteracting])
}
