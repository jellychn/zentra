export const getRange = ({
  lastPrice,
  hoverPrice,
  max1D,
  min1D,
  max1Mon,
  min1Mon,
  atr,
  selectedTimeframe,
  isHovered
}: {
  lastPrice: number
  hoverPrice: number | null
  max1D: number
  min1D: number
  max1Mon: number
  min1Mon: number
  atr: number
  selectedTimeframe: string
  isHovered: boolean
}): { max: number; min: number } => {
  let max = lastPrice
  let min = lastPrice

  if (selectedTimeframe === '1 DAY') {
    max = Math.max(max, max1D)
    min = Math.min(min, min1D)
  }

  if (selectedTimeframe === '1 MONTH') {
    max = Math.max(max, max1Mon)
    min = Math.min(min, min1Mon)
  }

  if (hoverPrice && !isHovered) {
    max = Math.max(max, hoverPrice)
    min = Math.min(min, hoverPrice)
  }

  if (atr) {
    const atrMax = lastPrice + atr
    const atrMin = lastPrice - atr
    max = Math.max(max, atrMax)
    min = Math.min(min, atrMin)
  }

  const bufferRatio = 0.3
  const priceRange = max - min
  const buffer = priceRange * bufferRatio

  max = max + buffer
  min = min - buffer

  return { min, max }
}
