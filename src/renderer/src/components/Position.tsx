import React from 'react'

export default function Position({ position }: { position }): React.JSX.Element {
  const {
    symbol,
    status,
    type,
    entryTime,
    exitTime,
    entryPrice,
    exitPrice,
    entryFee,
    exitFee,
    size,
    side,
    posSide,
    leverage,
    closedCapital,
    createdAt,
    updatedAt,
    userId,
    tradeId
  } = position

  return <div></div>
}
