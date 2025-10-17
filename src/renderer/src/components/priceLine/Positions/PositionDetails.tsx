import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { formatNumber } from '../../../../../shared/helper'
import { PosSide } from '../../../../../shared/types'
import { Trade } from 'src/main/db/dbTrades'
import ActionButton from '@renderer/elements/ActionButton'

const PositionDetails = ({
  position,
  positionColor,
  hovered
}: {
  position: Trade
  positionColor: string
  hovered: boolean
}): React.JSX.Element => {
  return (
    <>
      <Content position={position} hovered={hovered} positionColor={positionColor} />
      <HoveredContent position={position} hovered={hovered} positionColor={positionColor} />
    </>
  )
}

export default PositionDetails

const Content = ({
  position,
  hovered,
  positionColor
}: {
  position: Trade
  hovered: boolean
  positionColor: string
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const { entryPrice, leverage, posSide, size, entryFee, symbol } = position

  const isLong = posSide === PosSide.LONG
  let pnl = 0
  if (isLong) {
    pnl = (lastPrice - entryPrice) * size - entryFee
  } else {
    pnl = (entryPrice - lastPrice) * size - entryFee
  }

  const pnlColor = pnl > 0 ? '#10b981' : '#ef4444'

  if (hovered) {
    return <></>
  }

  return (
    <>
      <div
        style={{
          color: positionColor + 'CC',
          paddingBottom: '4px',
          fontWeight: 700,
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: 'rgba(148, 163, 184, 0.6)',
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}
        >
          {isLong ? 'LONG' : 'SHORT'}
        </span>
        {formatNumber(entryPrice)}
      </div>

      <div
        style={{
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: pnlColor + 'CC'
            }}
          >
            {formatNumber(pnl)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            PnL
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: 'rgba(248, 250, 252, 0.7)'
            }}
          >
            {formatNumber(size)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            Size
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: 700,
            color: 'rgba(59, 130, 246, 0.7)'
          }}
        >
          {leverage}x
        </div>
        <div
          style={{
            fontSize: '7px',
            color: 'rgba(100, 116, 139, 0.5)',
            fontWeight: 600
          }}
        >
          {symbol}
        </div>
      </div>
    </>
  )
}

const HoveredContent = ({
  position,
  hovered,
  positionColor
}: {
  position: Trade
  hovered: boolean
  positionColor: string
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const { size, entryPrice, leverage, symbol, posSide, entryFee } = position

  const isLong = posSide === PosSide.LONG
  const assignedPosBalance = (size * entryPrice) / leverage
  const positionValue = Math.abs(Number(assignedPosBalance) * Number(leverage))

  let pnl = 0
  if (isLong) {
    pnl = (lastPrice - entryPrice) * size - entryFee
  } else {
    pnl = (entryPrice - lastPrice) * size - entryFee
  }

  const pnlColor = pnl > 0 ? '#10b981' : '#ef4444'

  if (!hovered) {
    return <></>
  }

  return (
    <>
      <div
        style={{
          color: positionColor,
          paddingBottom: '6px',
          fontWeight: 700,
          fontSize: '11px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: '#94a3b8',
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}
        >
          {isLong ? 'LONG' : 'SHORT'}
        </span>
        {formatNumber(entryPrice)}
      </div>

      <div
        style={{
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#f8fafc'
            }}
          >
            {formatNumber(lastPrice)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: '#94a3b8',
              marginTop: '1px'
            }}
          >
            Current
          </div>
        </div>
        <div
          style={{
            fontSize: '9px',
            fontWeight: 700,
            color: pnlColor,
            background: `rgba(${pnl > 0 ? '16, 185, 129' : '239, 68, 68'}, 0.1)`,
            padding: '2px 6px',
            borderRadius: '3px'
          }}
        >
          {formatNumber(pnl)}
        </div>
      </div>

      <div
        style={{
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '6px',
          gap: '5px'
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#f8fafc'
            }}
          >
            {formatNumber(size)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: '#94a3b8',
              marginTop: '1px'
            }}
          >
            Size
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#f8fafc'
            }}
          >
            ${formatNumber(positionValue)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: '#94a3b8',
              marginTop: '1px'
            }}
          >
            Value
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: 700,
            color: '#3b82f6'
          }}
        >
          {leverage}x
        </div>
        <div
          style={{
            fontSize: '7px',
            color: '#64748b',
            fontWeight: 600
          }}
        >
          {symbol}
        </div>
      </div>

      <ActionButton
        color="#ef4444"
        hoverColor="#f87171"
        fill
        style={{
          fontSize: '9px',
          padding: '8px',
          marginTop: '15px'
        }}
        tooltip={`Close Order`}
        onClick={() => {}}
      >
        CANCEL
      </ActionButton>
    </>
  )
}
