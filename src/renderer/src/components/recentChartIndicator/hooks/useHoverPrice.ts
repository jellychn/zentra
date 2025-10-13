import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import { useEffect } from 'react'

export const useUpdateHoverLine = ({ updateHoverPriceLine }: { updateHoverPriceLine }): void => {
  const { hoverPrice } = usePriceLine()

  useEffect(() => {
    updateHoverPriceLine()
  }, [hoverPrice])
}

export const useUpdateHoverLineWhenVisibleRangeChange = ({
  chartRef,
  updateHoverPriceLine
}: {
  chartRef
  updateHoverPriceLine
}): void => {
  const { hoverPrice } = usePriceLine()

  useEffect(() => {
    if (!chartRef.current) return

    const timeScale = chartRef.current.timeScale()

    const handleVisibleRangeChange = (): void => {
      updateHoverPriceLine()
    }

    timeScale.subscribeVisibleTimeRangeChange(handleVisibleRangeChange)

    return () => {
      timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange)
    }
  }, [hoverPrice])
}
