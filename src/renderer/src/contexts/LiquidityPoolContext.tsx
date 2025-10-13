import React, { createContext, ReactNode, useContext, useState } from 'react'

interface LiquidityPoolContextType {
  tooltipInfo: object | null
  setTooltipInfo: (price: object | null) => void
}

const LiquidityPoolContext = createContext<LiquidityPoolContextType | undefined>(undefined)

interface LiquidityPoolProviderProps {
  children: ReactNode
}

export const LiquidityPoolProvider = ({
  children
}: LiquidityPoolProviderProps): React.JSX.Element => {
  const [tooltipInfo, setTooltipInfo] = useState<object | null>(null)

  const contextValue = React.useMemo(
    () => ({
      tooltipInfo,
      setTooltipInfo
    }),
    [tooltipInfo]
  )

  return (
    <LiquidityPoolContext.Provider value={contextValue}>{children}</LiquidityPoolContext.Provider>
  )
}

export const useLiquidityPool = (): LiquidityPoolContextType => {
  const context = useContext(LiquidityPoolContext)
  if (context === undefined) {
    throw new Error('useLiquidityPool must be used within a LiquidityPoolProvider')
  }
  return context
}
