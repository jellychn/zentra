import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COLORS } from './priceLine/colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PriceLevels from './priceLine/PriceLevels'
import { getRange } from './priceLine/helper'
import CurrentPrice from './priceLine/CurrentPrice'
import Timeline from './priceLine/Timeframe'

export default function PriceLine(): React.JSX.Element {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedTimeline, setSelectedTimeline] = useState('1D')

  const { min, max } = useMemo(
    () =>
      getRange({
        lastPrice
      }),
    [lastPrice]
  )

  const priceRange = max - min

  const getTopPercentage = useCallback(
    (price: number) => {
      if (priceRange === 0) return 50
      return ((max - price) / priceRange) * 100
    },
    [max, priceRange]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Timeline selectedTimeline={selectedTimeline} setSelectedTimeline={setSelectedTimeline} />

      <Main
        containerRef={containerRef}
        max={max}
        min={min}
        priceRange={priceRange}
        getTopPercentage={getTopPercentage}
      />
    </div>
  )
}

const Main = ({
  containerRef,
  max,
  min,
  priceRange,
  getTopPercentage
}: {
  containerRef: RefObject<HTMLDivElement | null>
  max: number
  min: number
  priceRange: number
  getTopPercentage: (price: number) => number
}): React.JSX.Element => {
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const updateHeight = (): void => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: COLORS.background,
        height: '100%',
        width: '120px',
        boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 60px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
        borderRight: `1px solid ${COLORS.border}`,
        cursor: 'crosshair',
        backdropFilter: 'blur(20px)',
        zIndex: 2
      }}
    >
      <PriceLevels
        max={max}
        min={min}
        priceRange={priceRange}
        containerHeight={containerHeight}
        getTopPercentage={getTopPercentage}
      />
      <CurrentPrice getTopPercentage={getTopPercentage} />
    </div>
  )
}
