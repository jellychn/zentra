import React, { useState } from 'react'
import { formatNumber } from '../../../shared/helper'
import StatCard from '@renderer/elements/myActiveTrades/StatCard'
import DetailItem from '@renderer/elements/myActiveTrades/DetailItem'
import { Trade } from 'src/main/db/dbTrades'
import { PosSide, TradeStatus } from '../../../shared/types'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import ActionButton from '@renderer/elements/ActionButton'
import ItemInfo from '@renderer/elements/myActiveTrades/ItemInfo'

export default function UserPosition({ position }: { position: Trade }): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const { posSide } = position

  const isLong = posSide === PosSide.LONG

  return (
    <div
      style={{
        padding: expanded ? '16px' : '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(22, 25, 41, 0.95), rgba(30, 33, 48, 0.98))',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isLong ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered
          ? `0 4px 12px ${isLong ? 'rgba(38, 166, 154, 0.2)' : 'rgba(239, 83, 80, 0.2)'}`
          : '0 1px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <Content expanded={expanded} hovered={hovered} position={position} />
      <ExpandedContent expanded={expanded} position={position} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const Content = ({
  expanded,
  hovered,
  position
}: {
  expanded: boolean
  hovered: boolean
  position: Trade
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const { symbol, posSide, leverage, entryPrice, size } = position
  const isLong = posSide === PosSide.LONG
  const unPnl = isLong ? (lastPrice - entryPrice) * size : (entryPrice - lastPrice) * size

  // Styles organized for better maintainability
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  }

  const mainContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  }

  const directionIconStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    background: isLong
      ? 'linear-gradient(135deg, #26a69a, #10b981)'
      : 'linear-gradient(135deg, #ef5350, #f87171)',
    color: '#fff',
    fontSize: '10px',
    transition: 'all 0.3s ease',
    transform: hovered ? 'scale(1.1) rotate(5deg)' : 'none'
  }

  const symbolStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#f1f5f9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  const positionInfoStyle = {
    fontSize: '11px',
    color: isLong ? '#26a69a' : '#ef5350',
    fontWeight: '600'
  }

  const sizeStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#f1f5f9',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  const entryPriceStyle = {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: 'bold'
  }

  const pnlValueStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: unPnl >= 0 ? '#10b981' : '#ef4444',
    marginBottom: '2px'
  }

  const pnlLabelStyle = {
    fontSize: '10px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px'
  }

  const expandIconStyle = {
    fontSize: '8px',
    color: '#64748b',
    transition: 'transform 0.3s ease',
    transform: expanded ? 'rotate(180deg)' : 'none'
  }

  return (
    <div style={containerStyle}>
      {/* Symbol and Position Info */}
      <div style={mainContentStyle}>
        <div style={directionIconStyle}>{isLong ? '▲' : '▼'}</div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={symbolStyle}>{symbol}</div>
          <div style={positionInfoStyle}>
            {posSide} • {leverage}x
          </div>
        </div>
      </div>

      {/* Size and Entry Price */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={sizeStyle}>{formatNumber(size)}</div>
        <div style={entryPriceStyle}>${formatNumber(entryPrice)}</div>
      </div>

      {/* PnL and Action Button */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'right',
          flex: 1
        }}
      >
        <div>
          <div style={pnlValueStyle}>
            {unPnl >= 0 ? '+' : ''}
            {formatNumber(unPnl)}
          </div>
          <div style={pnlLabelStyle}>
            <span>PnL</span>
            <div style={expandIconStyle}>▼</div>
          </div>
        </div>

        <ActionButton
          color="#ef4444"
          hoverColor="#f87171"
          style={{
            fontSize: '9px',
            padding: '8px',
            minHeight: '28px'
          }}
          tooltip={`Close Position (${formatNumber(unPnl)})`}
          onClick={() => {}}
        >
          CLOSE
        </ActionButton>
      </div>
    </div>
  )
}

const ExpandedContent = ({
  expanded,
  position
}: {
  expanded: boolean
  position: Trade
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData, userSettings } = state || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}
  const { lastPrice = 0 } = exchangeData || {}

  const { status, posSide, leverage, entryPrice, size, entryFee = 0, exitFee = 0 } = position

  const isLong = posSide === PosSide.LONG
  const positionValue = entryPrice * size
  const margin = positionValue / leverage

  const unPnl = isLong ? (lastPrice - entryPrice) * size : (entryPrice - lastPrice) * size

  const liquidationPrice = isLong
    ? entryPrice * (1 - (1 / leverage) * 0.9)
    : entryPrice * (1 + (1 / leverage) * 0.9)

  const rlPnl = -entryFee + -exitFee
  const totalPnl = rlPnl + unPnl

  const netMakerProfit = totalPnl - size * lastPrice * makerFee
  const netTakerProfit = totalPnl - size * lastPrice * takerFee

  if (!expanded) {
    return <></>
  }

  return (
    <div
      style={{
        marginTop: '16px',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        <StatCard
          label="Position Value"
          value={`${formatNumber(positionValue)}`}
          color="#f1f5f9"
          prefix="$"
        />
        <StatCard label="Margin" value={`${formatNumber(margin)}`} color="#f1f5f9" prefix="$" />
        <StatCard label="Entry Fee" value={`${formatNumber(entryFee)}`} color={'#ef4444'} />
        <StatCard
          label="Exit Fee"
          value={exitFee === 0 ? '-' : `$${formatNumber(exitFee)}`}
          color={'#ef4444'}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '6px'
        }}
      >
        <ItemInfo label="Realized PnL" value={rlPnl} color={rlPnl >= 0 ? '#10b981' : '#ef4444'} />
        <ItemInfo
          label="Maker Exit"
          value={netMakerProfit}
          color={netMakerProfit >= 0 ? '#10b981' : '#ef4444'}
        />
        <ItemInfo
          label="Taker Exit"
          value={netTakerProfit}
          color={netTakerProfit >= 0 ? '#10b981' : '#ef4444'}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          fontSize: '11px'
        }}
      >
        <DetailItem label="Liquidation price" value={`${formatNumber(liquidationPrice)}`} />
        <DetailItem
          label="Total PnL"
          value={`${formatNumber(totalPnl)}`}
          color={totalPnl >= 0 ? '#10b981' : '#ef4444'}
        />
        <DetailItem
          label="Status"
          value={status}
          color={status === TradeStatus.OPEN ? '#10b981' : '#ef4444'}
        />
        <DetailItem label="Position Side" value={posSide} color={isLong ? '#26a69a' : '#ef5350'} />
      </div>
    </div>
  )
}
