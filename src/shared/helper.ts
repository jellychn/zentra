/* eslint-disable @typescript-eslint/no-explicit-any */
export function toCamel(obj: any): any {
  if (Array.isArray(obj)) {
    // Handle arrays - map each item recursively
    return obj.map((item) => toCamel(item))
  } else if (obj !== null && typeof obj === 'object') {
    // Handle objects - convert keys to camelCase
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamel(value) // Recursively process nested objects/arrays
      ])
    )
  } else {
    // Return primitives as-is
    return obj
  }
}

export function toSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnake(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      result[snakeKey] = toSnake(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

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

export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0S'

  const SECONDS_IN_MIN = 60
  const SECONDS_IN_HOUR = 3600
  const SECONDS_IN_DAY = 86400
  const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30
  const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365

  const years = Math.floor(seconds / SECONDS_IN_YEAR)
  const months = Math.floor((seconds % SECONDS_IN_YEAR) / SECONDS_IN_MONTH)
  const days = Math.floor((seconds % SECONDS_IN_MONTH) / SECONDS_IN_DAY)
  const hours = Math.floor((seconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR)
  const mins = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MIN)
  const secs = Math.floor(seconds % SECONDS_IN_MIN)

  return (
    [
      years > 0 ? `${years}Y` : '',
      months > 0 ? `${months}MO` : '',
      days > 0 ? `${days}D` : '',
      hours > 0 ? `${hours}H` : '',
      mins > 0 ? `${mins}M` : '',
      secs > 0 ? `${secs}S` : ''
    ]
      .filter(Boolean)
      .join(' ') || '0S'
  )
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return '–'

  try {
    return new Date(dateString).toLocaleString()
  } catch {
    return dateString
  }
}
