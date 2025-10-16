export const COLORS = {
  success: 'rgba(16, 185, 129, 0.15)', // Green with transparency - Profitable after all fees
  danger: 'rgba(239, 68, 68, 0.15)', // Red with transparency - Losing position
  warning: 'rgba(245, 158, 11, 0.15)', // Orange - Price favorable but hasn't recovered entry fees
  entryRecovered: 'rgba(234, 179, 8, 0.15)', // Amber/Yellow - Recovered entry fees, working on maker exit fees
  makerProfitable: 'rgba(161, 98, 7, 0.15)', // Light brown/gold - Profitable after maker fees
  takerProfitable: 'rgba(133, 77, 14, 0.12)', // Lighter brown - Profitable after taker fees
  border: {
    success: 'rgba(16, 185, 129, 0.3)',
    danger: 'rgba(239, 68, 68, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    entryRecovered: 'rgba(234, 179, 8, 0.3)', // Amber border
    makerProfitable: 'rgba(161, 98, 7, 0.3)', // Gold border
    takerProfitable: 'rgba(133, 77, 14, 0.25)' // Lighter gold border
  }
}
