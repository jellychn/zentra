import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COLORS } from './priceLine/colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PriceLevels from './priceLine/PriceLevels'
import { getRange } from './priceLine/helper'
import CurrentPrice from './priceLine/CurrentPrice'
import Timeline from './priceLine/Timeframe'
import HoveredPriceLine from './priceLine/HoveredPriceLine'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import WindowShort from './priceLine/WindowShort'
import WindowLong from './priceLine/WindowLong'
import AtrBand from './recentChartIndicator/ATRBand'

export default function PriceLine(): React.JSX.Element {
  const { hoverPrice, setHoverPrice } = usePriceLine()
  const { state } = useStateStore()
  const { exchangeData, metrics } = state || {}
  const { max1D = 0, min1D = 0, max1Mon = 0, min1Mon = 0, atr = 0 } = metrics || {}
  const { lastPrice = 0 } = exchangeData || {}

  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedTimeline, setSelectedTimeline] = useState('1D')

  const { min, max } = useMemo(
    () =>
      getRange({
        lastPrice,
        hoverPrice,
        max1D,
        min1D,
        max1Mon,
        min1Mon,
        atr,
        selectedTimeline
      }),
    [hoverPrice, lastPrice, max1D, max1Mon, min1D, min1Mon, selectedTimeline, atr]
  )

  const priceRange = max - min

  const getTopPercentage = useCallback(
    (price: number) => {
      if (priceRange === 0) return 50
      return ((max - price) / priceRange) * 100
    },
    [max, priceRange]
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const y = event.clientY - rect.top
      const percentage = (y / rect.height) * 100

      const hoveredPrice = max - (percentage / 100) * priceRange
      setHoverPrice(hoveredPrice)
    },
    [max, priceRange, setHoverPrice]
  )

  const handleMouseLeave = useCallback(() => {
    setHoverPrice(null)
  }, [setHoverPrice])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Timeline selectedTimeline={selectedTimeline} setSelectedTimeline={setSelectedTimeline} />
      <WindowLong
        value={max1Mon}
        label="MAX 1MON"
        isMax={true}
        selectedTimeline={selectedTimeline}
        getTopPercentage={getTopPercentage}
      />
      <WindowLong
        value={min1Mon}
        label="MIN 1MON"
        isMax={false}
        selectedTimeline={selectedTimeline}
        getTopPercentage={getTopPercentage}
      />
      <Main
        containerRef={containerRef}
        max={max}
        min={min}
        max1D={max1D}
        min1D={min1D}
        priceRange={priceRange}
        getTopPercentage={getTopPercentage}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}

const Main = ({
  containerRef,
  max,
  min,
  max1D,
  min1D,
  priceRange,
  getTopPercentage,
  onMouseMove,
  onMouseLeave
}: {
  containerRef: RefObject<HTMLDivElement | null>
  max: number
  min: number
  max1D: number
  min1D: number
  priceRange: number
  getTopPercentage: (price: number) => number
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
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
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
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
      <HoveredPriceLine max={max} priceRange={priceRange} />
      <WindowShort value={max1D} label="MAX 1D" isMax={true} getTopPercentage={getTopPercentage} />
      <WindowShort value={min1D} label="MIN 1D" isMax={false} getTopPercentage={getTopPercentage} />
      <AtrBand getTopPercentage={getTopPercentage} />
    </div>
  )
}
