import { useRef, useState } from 'react'
import { COLORS } from './recentChartIndicator/colors'
import Header from './recentChartIndicator/Header'
import Footer from './recentChartIndicator/Footer'
import Loading from './recentChartIndicator/Loading'
import { IChartApi, ISeriesApi } from 'lightweight-charts'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import ResetIndicator from './recentChartIndicator/ResetIndicator'
import { useInitializeChart } from './recentChartIndicator/hooks/useInitializeChart'
import { useCleanUp } from './recentChartIndicator/hooks/useCleanUp'
import {
  useUpdateCandles,
  useUpdateCandlesRef
} from './recentChartIndicator/hooks/useUpdateCandles'
import { useSynchronizeCurrentPriceLine } from './recentChartIndicator/hooks/useSynchronizeCurrentPriceLine'
import { useResetIndicator } from './recentChartIndicator/hooks/useResetIndicator'
import { useUpdateLastCandle } from './recentChartIndicator/hooks/useUpdateLastCandle'
import { useUpdateDisplayPrice } from './recentChartIndicator/hooks/useUpdateDisplayPrice'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import {
  useUpdateHoverLine,
  useUpdateHoverLineWhenVisibleRangeChange
} from './recentChartIndicator/hooks/useHoverPrice'

const VIEWPORT_CANDLES = 60
const RESET_TIMEOUT = 10000
const INTERACTION_TIMEOUT = 1000
const BEHIND_THRESHOLD = 3

export default function RecentChartIndicator(): React.JSX.Element {
  const { hoverPrice } = usePriceLine()
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  const chartRef = useRef<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const hoverLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [showResetIndicator, setShowResetIndicator] = useState(false)
  const [previousDataLength, setPreviousDataLength] = useState(0)
  const [displayPrice, setDisplayPrice] = useState(0)

  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastVisibleRangeRef = useRef<{ from: number; to: number } | null>(null)
  const currentCandlestickDataRef = useRef<any[]>([])
  const isProgrammaticScrollRef = useRef(false)
  const [isChartHovered, setIsChartHovered] = useState(false)

  const updateHoverPriceLine = (): void => {
    if (!hoverLineSeriesRef.current || !chartRef.current || isChartHovered) return

    try {
      if (hoverPrice !== null && hoverPrice > 0) {
        const timeScale = chartRef.current.timeScale()
        const visibleRange = timeScale.getVisibleRange()

        if (!visibleRange) return

        const currentData = currentCandlestickDataRef.current
        const latestCandleTime =
          currentData.length > 0 ? currentData[currentData.length - 1].time : visibleRange.to

        const extendedEndTime =
          Number(latestCandleTime) + (Number(visibleRange.to) - Number(visibleRange.from)) * 0.02

        const hoverLineData = [
          {
            time: visibleRange.from,
            value: hoverPrice
          },
          {
            time: extendedEndTime as any,
            value: hoverPrice
          }
        ]

        hoverLineSeriesRef.current.setData(hoverLineData)
        hoverLineSeriesRef.current.applyOptions({
          visible: true
        })
      } else {
        hoverLineSeriesRef.current.applyOptions({
          visible: false
        })
      }
    } catch (error) {
      console.error('Error updating hover price line:', error)
    }
  }

  const isSignificantlyBehind = (): boolean => {
    if (!chartRef.current || !currentCandlestickDataRef.current.length) return false

    try {
      const timeScale = chartRef.current.timeScale()
      const visibleRange = timeScale.getVisibleRange()

      if (!visibleRange) return false

      const currentData = currentCandlestickDataRef.current
      const latestTime = currentData[currentData.length - 1].time

      const visibleEndTime = visibleRange.to
      const timeDifference = Number(latestTime) - Number(visibleEndTime)

      if (currentData.length > 1) {
        const averageCandleTime = currentData[1].time - currentData[0].time
        const candlesBehind = timeDifference / averageCandleTime

        return candlesBehind >= BEHIND_THRESHOLD
      }

      return timeDifference > 0
    } catch (error) {
      console.error('Error checking if behind:', error)
      return false
    }
  }

  const setViewportToRecent = (): void => {
    if (!chartRef.current) return

    try {
      isProgrammaticScrollRef.current = true

      const timeScale = chartRef.current.timeScale()
      const currentData = currentCandlestickDataRef.current

      if (!currentData || currentData.length === 0) return

      if (currentData.length <= VIEWPORT_CANDLES) {
        timeScale.fitContent()
      } else {
        const startIndex = Math.max(0, currentData.length - VIEWPORT_CANDLES)
        const startTime = currentData[startIndex].time
        const endTime = currentData[currentData.length - 1].time

        timeScale.setVisibleRange({
          from: startTime as any,
          to: endTime as any
        })
      }

      const newVisibleRange = timeScale.getVisibleRange()
      if (newVisibleRange) {
        lastVisibleRangeRef.current = {
          from: Number(newVisibleRange.from),
          to: Number(newVisibleRange.to)
        }
      }

      setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 100)
    } catch (error) {
      console.error('Error setting viewport:', error)
      isProgrammaticScrollRef.current = false
    }
  }

  const resetToRecentViewport = (): void => {
    if (!isUserInteracting && chartRef.current && isSignificantlyBehind()) {
      setViewportToRecent()
      setShowResetIndicator(false)
    }
  }

  const handleUserInteraction = (): void => {
    if (isProgrammaticScrollRef.current) {
      return
    }

    const shouldShowReset = isSignificantlyBehind()

    if (shouldShowReset && !isUserInteracting) {
      setIsUserInteracting(true)
      setShowResetIndicator(true)
    }

    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }

    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)

      if (isSignificantlyBehind()) {
        resetTimeoutRef.current = setTimeout(() => {
          resetToRecentViewport()
        }, RESET_TIMEOUT)
      } else {
        setShowResetIndicator(false)
      }
    }, INTERACTION_TIMEOUT)
  }

  const handleManualReset = (): void => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    setIsUserInteracting(false)
    setViewportToRecent()
    setShowResetIndicator(false)
  }

  const updateLastCandle = (): void => {
    if (!candlestickSeriesRef.current || !candles.length) return

    try {
      const lastCandle = candles[candles.length - 1]

      const updatedCandle = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, lastPrice),
        low: Math.min(lastCandle.low, lastPrice),
        close: lastPrice
      }

      candlestickSeriesRef.current.update(updatedCandle)

      if (lineSeriesRef.current) {
        lineSeriesRef.current.setData([{ time: lastCandle.time, value: lastPrice }])
      }

      if (currentCandlestickDataRef.current.length > 0) {
        const updatedData = [...currentCandlestickDataRef.current]
        updatedData[updatedData.length - 1] = updatedCandle
        currentCandlestickDataRef.current = updatedData
      }
    } catch (error) {
      console.error('Error updating last candle:', error)
    }
  }

  useUpdateHoverLine({ updateHoverPriceLine })
  useUpdateHoverLineWhenVisibleRangeChange({ chartRef, updateHoverPriceLine })
  useUpdateCandlesRef({ currentCandlestickDataRef })
  useUpdateDisplayPrice({ displayPrice, setDisplayPrice })
  useResetIndicator({ chartRef, isUserInteracting, isSignificantlyBehind, setShowResetIndicator })
  useUpdateLastCandle({ updateLastCandle })
  useUpdateCandles({
    candlestickSeriesRef,
    lineSeriesRef,
    isUserInteracting,
    updateLastCandle,
    setViewportToRecent,
    previousDataLength,
    setPreviousDataLength
  })
  useSynchronizeCurrentPriceLine({ candlestickSeriesRef, lineSeriesRef, updateLastCandle })
  useInitializeChart({
    chartRef,
    chartContainerRef,
    candlestickSeriesRef,
    lineSeriesRef,
    hoverLineSeriesRef,
    handleUserInteraction,
    setViewportToRecent,
    setPreviousDataLength,
    interactionTimeoutRef,
    resetTimeoutRef,
    setIsLoading,
    setIsChartHovered
  })
  useCleanUp({ interactionTimeoutRef, resetTimeoutRef })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        minWidth: 0,
        minHeight: 0
      }}
    >
      <Header
        selectedTimeframe={selectedTimeframe}
        isDropdownOpen={isDropdownOpen}
        setSelectedTimeframe={setSelectedTimeframe}
        setIsDropdownOpen={setIsDropdownOpen}
        candles={candles}
      />

      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: 'calc(100% - 120px)',
          flex: 1,
          position: 'relative',
          marginTop: '60px',
          marginBottom: '60px',
          minWidth: 0,
          minHeight: 0
        }}
      />

      <Footer />
      <ResetIndicator
        showResetIndicator={showResetIndicator}
        handleManualReset={handleManualReset}
      />
      <Loading loading={isLoading} />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
          @keyframes priceUpdate {
            0% { background: rgba(59, 130, 246, 0.2); }
            100% { background: rgba(30, 41, 59, 0.8); }
        `}
      </style>
    </div>
  )
}
