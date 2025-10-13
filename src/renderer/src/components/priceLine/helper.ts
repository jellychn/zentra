export const getRange = ({
  lastPrice,
  hoverPrice,
  max1D,
  min1D,
  max1Mon,
  min1Mon,
  selectedTimeline
}: {
  lastPrice: number
  hoverPrice: number | null
  max1D: number
  min1D: number
  max1Mon: number
  min1Mon: number
  selectedTimeline: string
}): { max: number; min: number } => {
  let max = lastPrice
  let min = lastPrice

  if (selectedTimeline === '1D') {
    max = Math.max(max, max1D)
    min = Math.min(min, min1D)
  }

  if (selectedTimeline === '1MON') {
    max = Math.max(max, max1Mon)
    min = Math.min(min, min1Mon)
  }

  if (hoverPrice) {
    max = Math.max(max, hoverPrice)
    min = Math.min(min, hoverPrice)
  }

  const bufferRatio = 0.3
  const priceRange = max - min
  const buffer = priceRange * bufferRatio

  max = max + buffer
  min = min - buffer

  return { min, max }
}
