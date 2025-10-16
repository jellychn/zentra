import React, { useState } from 'react'
import { formatNumber } from '../../../../../shared/helper'

export default function MakerProfit({
  isLong,
  makerColor,
  profitableMakerPriceLine
}: {
  isLong: boolean
  makerColor: string
  profitableMakerPriceLine: number
}): React.JSX.Element {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        top: isLong ? '-8px' : '4px',
        right: '-5px',
        background: 'rgba(15, 23, 42, 0.9)',
        color: makerColor.replace('0.8', '1'),
        padding: '1px 4px',
        borderRadius: '2px',
        fontSize: '7px',
        fontWeight: '600',
        fontFamily: 'monospace',
        border: `1px solid ${makerColor}`,
        zIndex: hover ? 100 : 1
      }}
    >
      {hover ? `${formatNumber(profitableMakerPriceLine)} MAKER` : 'M'}
    </div>
  )
}
