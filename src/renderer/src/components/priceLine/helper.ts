export const getRange = ({ lastPrice }: { lastPrice: number }): { max: number; min: number } => {
  let max = lastPrice + 1000
  let min = lastPrice - 1000

  return { min, max }
}
