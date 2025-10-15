import { useMemo } from 'react'

export const useOrderBookData = (
  bids: Record<string, number>,
  asks: Record<string, number>,
  showFullOrderBook: boolean
): {
  maxBidTotal
  maxAskTotal
  processedBids
  processedAsks
} => {
  return useMemo(() => {
    const processEntries = (entries: [string, number][], sortDescending = false) => {
      const sorted = entries
        .map(([price, size]) => ({ price: parseFloat(price), size: size as number }))
        .sort((a, b) => (sortDescending ? b.price - a.price : a.price - b.price))

      const limited = showFullOrderBook ? sorted : sorted.slice(0, 3)

      let runningTotal = 0
      const processed = limited.map((entry) => {
        runningTotal += entry.size
        return { ...entry, total: runningTotal }
      })

      return { processed, maxTotal: runningTotal }
    }

    const bidEntries = Object.entries(bids)
    const askEntries = Object.entries(asks)

    const { processed: processedBids, maxTotal: maxBidTotal } = processEntries(bidEntries, true)
    const { processed: processedAsks, maxTotal: maxAskTotal } = processEntries(askEntries, false)

    return {
      maxBidTotal,
      maxAskTotal,
      processedBids,
      processedAsks
    }
  }, [bids, asks, showFullOrderBook])
}
