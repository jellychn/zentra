import { ColorType, createChart, CrosshairMode, LineStyle } from 'lightweight-charts'
import { useEffect } from 'react'
import { COLORS } from '../colors'
import { formatPrice, getPricePrecision } from '../helper'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'

export const useInitializeChart = ({
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
}: {
  chartRef
  chartContainerRef
  candlestickSeriesRef
  lineSeriesRef
  hoverLineSeriesRef
  handleUserInteraction
  setViewportToRecent
  setPreviousDataLength
  interactionTimeoutRef
  resetTimeoutRef
  setIsLoading
  setIsChartHovered
}): void => {
  const { setHoverPrice } = usePriceLine()
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  const pricePrecision = getPricePrecision(candles.map((d: { close: number }) => d.close))

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
        }
      })

      chartRef.current = chart

      chart.subscribeCrosshairMove((param) => {
        setIsChartHovered(true)
        if (param.point && param.time) {
          const candlestickData = param.seriesData.get(candlestickSeriesRef.current)

          if (candlestickData && typeof candlestickData === 'object') {
            const candle = candlestickData as {
              low: number
              high: number
              close: number
              open: number
            }

            let hoveredPrice: number | null = null
            if (candlestickSeriesRef.current) {
              hoveredPrice = candlestickSeriesRef.current.coordinateToPrice(param.point.y)
            }

            if (hoveredPrice !== null && hoveredPrice !== undefined) {
              const isWithinCandleRange = hoveredPrice >= candle.low && hoveredPrice <= candle.high

              if (isWithinCandleRange) {
                setHoverPrice(hoveredPrice)
              } else {
                setHoverPrice(null)
              }
            } else {
              setHoverPrice(null)
            }
          } else {
            setHoverPrice(null)
          }
        } else {
          setHoverPrice(null)
        }
      })

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

      lineSeriesRef.current = chart.addLineSeries({
        color: COLORS.primary,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        priceScaleId: 'right',
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        priceFormat: {
          type: 'price',
          precision: pricePrecision,
          minMove: 1 / Math.pow(10, pricePrecision)
        }
      })

      hoverLineSeriesRef.current = chart.addLineSeries({
        color: COLORS.chart.hoverLine,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        priceScaleId: 'right',
        lastValueVisible: true,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
        visible: false,
        priceFormat: {
          type: 'price',
          precision: pricePrecision,
          minMove: 1 / Math.pow(10, pricePrecision)
        }
      })

      if (candles.length > 0) {
        candlestickSeriesRef.current.setData(candles)

        const lastCandle = candles[candles.length - 1]
        lineSeriesRef.current.setData([
          {
            time: lastCandle.time,
            value: lastPrice
          }
        ])
      }

      setTimeout(() => {
        setViewportToRecent()
      }, 100)

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

      const seriesArray = [
        candlestickSeriesRef.current,
        lineSeriesRef.current,
        hoverLineSeriesRef.current
      ]
      seriesArray.forEach((series) => {
        if (series) {
          series.applyOptions({
            priceFormat: {
              type: 'price',
              precision: pricePrecision,
              minMove: 1 / Math.pow(10, pricePrecision)
            }
          })
        }
      })

      chart.timeScale().subscribeVisibleTimeRangeChange(handleUserInteraction)
      chart.timeScale().subscribeVisibleLogicalRangeChange(handleUserInteraction)

      const handleResize = (): void => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight
          })
        }
      }

      const resizeObserver = new ResizeObserver(handleResize)
      if (container) {
        resizeObserver.observe(container)
      }

      window.addEventListener('resize', handleResize)

      setIsLoading(false)
      setPreviousDataLength(candles.length)

      return () => {
        window.removeEventListener('resize', handleResize)
        resizeObserver.disconnect()

        if (interactionTimeoutRef.current) {
          clearTimeout(interactionTimeoutRef.current)
        }
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }

        if (chartRef.current) {
          try {
            chartRef.current.timeScale().unsubscribeVisibleTimeRangeChange(handleUserInteraction)
            chartRef.current.timeScale().unsubscribeVisibleLogicalRangeChange(handleUserInteraction)
            chartRef.current.remove()
          } catch (error) {
            console.warn('Chart cleanup error:', error)
          } finally {
            chartRef.current = null
            candlestickSeriesRef.current = null
            lineSeriesRef.current = null
            hoverLineSeriesRef.current = null
          }
        }
      }
    } catch (error) {
      console.error('Chart initialization error:', error)
      setIsLoading(false)
    }
  }, [])
}
