import { useEffect, useRef, useState } from 'react'
import { COLORS } from './recentChartIndicator/colors'
import Header from './recentChartIndicator/Header'
import Footer from './recentChartIndicator/Footer'
import Loading from './recentChartIndicator/Loading'
import {
  ColorType,
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineStyle
} from 'lightweight-charts'
import { useStateStore } from '@renderer/contexts/StateStoreContext'

const formatPrice = (price: number): string => {
  if (price === 0) return '$0'

  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`
  } else if (price >= 1) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  } else if (price >= 0.01) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })}`
  } else if (price >= 0.0001) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })}`
  } else {
    return `$${price.toFixed(8)}`
  }
}

const getPricePrecision = (prices: number[]): number => {
  if (prices.length === 0) return 2
  const minPrice = Math.min(...prices.filter((p) => p > 0))

  if (minPrice >= 1000) return 0
  if (minPrice >= 1) return 2
  if (minPrice >= 0.01) return 4
  if (minPrice >= 0.0001) return 6
  return 8
}

// Constants for viewport behavior
const VIEWPORT_CANDLES = 60
const RESET_TIMEOUT = 10000
const INTERACTION_TIMEOUT = 1000 // Increased timeout for better UX
const BEHIND_THRESHOLD = 3

export default function RecentChartIndicator(): React.JSX.Element {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  const chartRef = useRef<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // New state variables for movable chart functionality
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [showResetIndicator, setShowResetIndicator] = useState(false)
  const [previousDataLength, setPreviousDataLength] = useState(0)
  const [displayPrice, setDisplayPrice] = useState(0)

  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastVisibleRangeRef = useRef<{ from: number; to: number } | null>(null)
  const currentCandlestickDataRef = useRef<any[]>([])
  const isProgrammaticScrollRef = useRef(false) // Track programmatic scrolls

  const pricePrecision = getPricePrecision(candles.map((d: { close: number }) => d.close))

  // Update the ref whenever candles change
  useEffect(() => {
    currentCandlestickDataRef.current = candles
  }, [candles])

  // Calculate price stats - using lastPrice instead of currentPrice
  const currentPrice = lastPrice // Changed from candles-based calculation to lastPrice
  const highPrice =
    candles.length > 0 ? Math.max(...candles.map((d: { high: number }) => d.high)) : 0
  const lowPrice = candles.length > 0 ? Math.min(...candles.map((d: { low: number }) => d.low)) : 0

  // Check if we're significantly behind the latest data - FIXED VERSION
  const isSignificantlyBehind = (): boolean => {
    if (!chartRef.current || !currentCandlestickDataRef.current.length) return false

    try {
      const timeScale = chartRef.current.timeScale()
      const visibleRange = timeScale.getVisibleRange()

      if (!visibleRange) return false

      const currentData = currentCandlestickDataRef.current
      const latestTime = currentData[currentData.length - 1].time

      // Calculate how many candles we're behind
      const visibleEndTime = visibleRange.to
      const timeDifference = Number(latestTime) - Number(visibleEndTime)

      // Estimate candles behind based on average time between candles
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

  // Set viewport to show last x candles using the ref for latest data - FIXED VERSION
  const setViewportToRecent = () => {
    if (!chartRef.current) return

    try {
      isProgrammaticScrollRef.current = true // Mark as programmatic scroll

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

      // Update last visible range
      const newVisibleRange = timeScale.getVisibleRange()
      if (newVisibleRange) {
        lastVisibleRangeRef.current = {
          from: Number(newVisibleRange.from),
          to: Number(newVisibleRange.to)
        }
      }

      // Reset the programmatic scroll flag after a short delay
      setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 100)
    } catch (error) {
      console.error('Error setting viewport:', error)
      isProgrammaticScrollRef.current = false
    }
  }

  // Reset to recent viewport after inactivity - FIXED VERSION
  const resetToRecentViewport = () => {
    if (!isUserInteracting && chartRef.current && isSignificantlyBehind()) {
      setViewportToRecent()
      setShowResetIndicator(false)
    }
  }

  // Handle user interaction with better logic - FIXED VERSION
  const handleUserInteraction = () => {
    // Ignore programmatic scrolls
    if (isProgrammaticScrollRef.current) {
      return
    }

    const shouldShowReset = isSignificantlyBehind()

    if (shouldShowReset && !isUserInteracting) {
      setIsUserInteracting(true)
      setShowResetIndicator(true)
    }

    // Clear existing timeouts
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }

    // Set timeout to detect end of interaction
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false)

      // Only set reset timeout if we're still behind
      if (isSignificantlyBehind()) {
        resetTimeoutRef.current = setTimeout(() => {
          resetToRecentViewport()
        }, RESET_TIMEOUT)
      } else {
        setShowResetIndicator(false)
      }
    }, INTERACTION_TIMEOUT)
  }

  // Manual reset handler
  const handleManualReset = () => {
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

  // Update display price with animation effect
  useEffect(() => {
    if (currentPrice !== displayPrice) {
      setDisplayPrice(currentPrice)
    }
  }, [currentPrice, displayPrice])

  // Update the last candle with real-time lastPrice
  const updateLastCandle = () => {
    if (!candlestickSeriesRef.current || !candles.length) return

    try {
      const lastCandle = candles[candles.length - 1]

      // Create updated candle with lastPrice
      const updatedCandle = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, lastPrice),
        low: Math.min(lastCandle.low, lastPrice),
        close: lastPrice
      }

      // Update the last candle in the series
      candlestickSeriesRef.current.update(updatedCandle)

      // Also update the current price line
      if (lineSeriesRef.current) {
        lineSeriesRef.current.setData([{ time: lastCandle.time, value: lastPrice }])
      }

      // Update the ref data as well
      if (currentCandlestickDataRef.current.length > 0) {
        const updatedData = [...currentCandlestickDataRef.current]
        updatedData[updatedData.length - 1] = updatedCandle
        currentCandlestickDataRef.current = updatedData
      }
    } catch (error) {
      console.error('Error updating last candle:', error)
    }
  }

  // Periodically check if we should show reset indicator - FIXED VERSION
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

  // Update last candle when lastPrice changes
  useEffect(() => {
    if (candles.length > 0 && lastPrice > 0) {
      updateLastCandle()
    }
  }, [lastPrice, candles])

  useEffect((): void => {
    const container = chartContainerRef.current
    if (!container || chartRef.current) return

    setIsLoading(true)
    try {
      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: COLORS.chart.background },
          textColor: COLORS.text.primary,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        grid: {
          vertLines: { visible: false },
          horzLines: {
            color: COLORS.chart.grid,
            style: LineStyle.SparseDotted
          }
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: COLORS.primary,
            width: 1,
            style: LineStyle.Dotted,
            labelBackgroundColor: COLORS.surface
          },
          horzLine: {
            color: COLORS.primary,
            width: 1,
            style: LineStyle.Dotted,
            labelBackgroundColor: COLORS.surface
          }
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: COLORS.border,
          rightBarStaysOnScroll: true,
          lockVisibleTimeRangeOnResize: true,
          minBarSpacing: 0.1
        },
        rightPriceScale: {
          autoScale: true,
          borderVisible: false,
          scaleMargins: {
            top: 0.05,
            bottom: 0.05
          },
          entireTextOnly: true
        },
        width: container.clientWidth,
        height: container.clientHeight
      })

      chartRef.current = chart

      // Create candlestick series with enhanced colors
      candlestickSeriesRef.current = chart.addCandlestickSeries({
        upColor: COLORS.chart.up,
        downColor: COLORS.chart.down,
        borderDownColor: COLORS.chart.down,
        borderUpColor: COLORS.chart.up,
        wickDownColor: COLORS.chart.down,
        wickUpColor: COLORS.chart.up,
        priceLineVisible: false,
        lastValueVisible: false
      })

      // Create line series for current price indicator
      lineSeriesRef.current = chart.addLineSeries({
        color: COLORS.primary,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        priceScaleId: 'right',
        lastValueVisible: false,
        priceLineVisible: false
      })

      // Set the data
      if (candles.length > 0) {
        candlestickSeriesRef.current.setData(candles)

        // Add current price line using lastPrice
        const lastCandle = candles[candles.length - 1]
        lineSeriesRef.current.setData([{ time: lastCandle.time, value: lastPrice }])
      }

      // Set initial viewport to show last x candles
      setTimeout(() => {
        setViewportToRecent()
      }, 100)

      // Enhanced price scale formatting with dynamic decimals
      chart.applyOptions({
        localization: {
          priceFormatter: (price: number) => {
            return formatPrice(price)
          },
          timeFormatter: (time: number) => {
            const date = new Date(time * 1000)
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        }
      })

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.applyOptions({
          priceFormat: {
            type: 'price',
            precision: pricePrecision,
            minMove: 1 / Math.pow(10, pricePrecision)
          }
        })
      }

      // Add event listeners for user interaction
      chart.timeScale().subscribeVisibleTimeRangeChange(handleUserInteraction)
      chart.timeScale().subscribeVisibleLogicalRangeChange(handleUserInteraction)

      let resizeTimeout: NodeJS.Timeout
      const handleResize = (): void => {
        if (chartContainerRef.current && chartRef.current) {
          clearTimeout(resizeTimeout)
          resizeTimeout = setTimeout(() => {
            chartRef.current?.applyOptions({
              width: chartContainerRef.current?.clientWidth,
              height: chartContainerRef.current?.clientHeight
            })
          }, 150)
        }
      }

      const resizeObserver = new ResizeObserver(handleResize)
      if (container) {
        resizeObserver.observe(container)
      }

      window.addEventListener('resize', handleResize)

      setIsLoading(false)
      setPreviousDataLength(candles.length)

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize)
        resizeObserver.disconnect()
        clearTimeout(resizeTimeout)

        if (interactionTimeoutRef.current) {
          clearTimeout(interactionTimeoutRef.current)
        }
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }

        if (chartRef.current) {
          try {
            // Remove event listeners
            chartRef.current.timeScale().unsubscribeVisibleTimeRangeChange(handleUserInteraction)
            chartRef.current.timeScale().unsubscribeVisibleLogicalRangeChange(handleUserInteraction)

            chartRef.current.remove()
          } catch (error) {
            console.warn('Chart cleanup error:', error)
          } finally {
            chartRef.current = null
            candlestickSeriesRef.current = null
            lineSeriesRef.current = null
          }
        }
      }
    } catch (error) {
      console.error('Chart initialization error:', error)
      setIsLoading(false)
    }
  }, []) // Remove dependencies to prevent re-initialization

  // Update chart when candles change - FIXED VERSION
  useEffect(() => {
    if (!candlestickSeriesRef.current || !candles.length) return

    try {
      const currentLength = candles.length
      const lastCandle = candles[candles.length - 1]

      // Always update the data
      candlestickSeriesRef.current.setData(candles)

      // Update current price line with lastPrice
      if (lineSeriesRef.current) {
        lineSeriesRef.current.setData([{ time: lastCandle.time, value: lastPrice }])
      }

      // Only auto-scroll if user isn't interacting AND we have new data
      if (!isUserInteracting && currentLength > previousDataLength) {
        setTimeout(() => {
          setViewportToRecent()
        }, 100)
      }

      setPreviousDataLength(currentLength)
    } catch (error) {
      console.error('Chart data update error:', error)
    }
  }, [candles, lastPrice, isUserInteracting, previousDataLength]) // Added proper dependencies

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative'
      }}
    >
      <Header
        selectedTimeframe={selectedTimeframe}
        isDropdownOpen={isDropdownOpen}
        setSelectedTimeframe={setSelectedTimeframe}
        setIsDropdownOpen={setIsDropdownOpen}
        highPrice={highPrice}
        lowPrice={lowPrice}
      />

      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: 'calc(100% - 120px)',
          marginTop: '60px',
          marginBottom: '60px',
          position: 'relative'
        }}
      />

      {showResetIndicator && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '20px',
            zIndex: 10,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={handleManualReset}
            style={{
              background: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 1)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            RESET VIEW
          </button>
        </div>
      )}

      <Footer />

      <Loading loading={isLoading} />

      {/* CSS Animations */}
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
          }
        `}
      </style>
    </div>
  )
}
