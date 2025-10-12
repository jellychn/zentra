import React, { createContext, ReactNode, useContext, useState } from 'react'

interface PriceLineContextType {
  hoverPrice: number | null
  setHoverPrice: (price: number | null) => void
}

const PriceLineContext = createContext<PriceLineContextType | undefined>(undefined)

interface PriceLineProviderProps {
  children: ReactNode
}

export const PriceLineProvider = ({ children }: PriceLineProviderProps): React.JSX.Element => {
  const [hoverPrice, setHoverPrice] = useState<number | null>(null)

  const contextValue = React.useMemo(
    () => ({
      hoverPrice,
      setHoverPrice
    }),
    [hoverPrice]
  )

  return <PriceLineContext.Provider value={contextValue}>{children}</PriceLineContext.Provider>
}

export const usePriceLine = (): PriceLineContextType => {
  const context = useContext(PriceLineContext)
  if (context === undefined) {
    throw new Error('usePriceLine must be used within a PriceLineProvider')
  }
  return context
}
