export const formatPrice = (price: number): string => {
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

export const getPricePrecision = (prices: number[]): number => {
  if (prices.length === 0) return 2
  const minPrice = Math.min(...prices.filter((p) => p > 0))

  if (minPrice >= 1000) return 0
  if (minPrice >= 1) return 2
  if (minPrice >= 0.01) return 4
  if (minPrice >= 0.0001) return 6
  return 8
}
