export const formatNumber = (value: number | string, dp = 4): string => {
  const number = Number(value)

  if (isNaN(number)) {
    return '0'
  }

  if (number === 0) {
    return '0'
  }

  const absoluteNumber = Math.abs(number)

  if (absoluteNumber > 1) {
    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    })
    return formatter.format(number)
  }

  if (absoluteNumber < 1) {
    const decimalPlaces = Math.max(dp, -Math.floor(Math.log10(absoluteNumber)) + 1)
    let formatted = number.toFixed(Math.min(8, decimalPlaces))
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '')
    }
    return formatted
  }

  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: dp,
    useGrouping: true
  })

  return formatter.format(number)
}
