import { useState } from 'react'
import { formatNumber } from '../../../../../shared/helper'

export default function TakerProfit({
  takerColor,
  profitableTakerPriceLine
}: {
  takerColor: string
  profitableTakerPriceLine: number
}): React.JSX.Element {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-5px',
        zIndex: hover ? 100 : 1,
        background: 'rgba(15, 23, 42, 0.9)',
        color: takerColor.replace('0.8', '1'),
        padding: '1px 4px',
        borderRadius: '2px',
        fontSize: '7px',
        fontWeight: '600',
        fontFamily: 'monospace',
        border: `1px solid ${takerColor}`
      }}
    >
      {hover ? `${formatNumber(profitableTakerPriceLine)} TAKER` : 'T'}
    </div>
  )
}
