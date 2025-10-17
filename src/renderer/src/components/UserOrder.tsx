import React, { useState } from 'react'
import { formatDate, formatNumber } from '../../../shared/helper'
import { Order } from 'src/main/db/dbOrders'
import ItemInfo from '@renderer/elements/myActiveTrades/ItemInfo'
import DetailItem from '@renderer/elements/myActiveTrades/DetailItem'
import StatCard from '@renderer/elements/myActiveTrades/StatCard'
import { MessageSenderType, OrderType, PosSide, Side } from '../../../shared/types'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import ActionButton from '@renderer/elements/ActionButton'
import { sendIpcMessage } from '@renderer/ipcMain/message'

export default function UserOrder({ order }: { order: Order }): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const { side } = order

  const isBuy = side === Side.BUY

  return (
    <div
      style={{
        padding: expanded ? '16px' : '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(22, 25, 41, 0.95), rgba(30, 33, 48, 0.98))',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isBuy ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered
          ? `0 4px 12px ${isBuy ? 'rgba(38, 166, 154, 0.2)' : 'rgba(239, 83, 80, 0.2)'}`
          : '0 1px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <Content order={order} expanded={expanded} hovered={hovered} />
      <ExpandedContent order={order} expanded={expanded} />

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
  order,
  expanded,
  hovered
}: {
  order: Order
  expanded: boolean
  hovered: boolean
}): React.JSX.Element => {
  const { orderId, orderType, side, posSide, size, price, symbol, leverage } = order

  const isBuy = side === Side.BUY
  const isMarketOrder = orderType === OrderType.MARKET

  const handleCancelOrder = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation()
    sendIpcMessage({
      message: MessageSenderType.CANCEL_ORDER,
      data: {
        orderId
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            background: isBuy
              ? 'linear-gradient(135deg, #26a69a, #10b981)'
              : 'linear-gradient(135deg, #ef5350, #f87171)',
            color: '#fff',
            fontSize: '10px',
            transition: 'all 0.3s ease',
            transform: hovered ? 'scale(1.1) rotate(5deg)' : 'none'
          }}
        >
          {isBuy ? 'BUY' : 'SELL'}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#f1f5f9',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {symbol}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: isBuy ? '#26a69a' : '#ef5350',
              fontWeight: '600'
            }}
          >
            {posSide} • {orderType} • {leverage}x
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#f1f5f9',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {formatNumber(Number(size))}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            fontWeight: 'bold'
          }}
        >
          {isMarketOrder ? 'Market' : `$${formatNumber(price)}`}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'right',
          flex: 1
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px'
          }}
        >
          <span>Order</span>
          <div
            style={{
              fontSize: '8px',
              color: '#64748b',
              transition: 'transform 0.3s ease',
              transform: expanded ? 'rotate(180deg)' : 'none'
            }}
          >
            ▼
          </div>
        </div>
        <ActionButton
          color="#ef4444"
          hoverColor="#f87171"
          fill
          style={{
            fontSize: '9px',
            padding: '8px',
            minHeight: '28px'
          }}
          tooltip={`Close Order`}
          onClick={handleCancelOrder}
        >
          CANCEL
        </ActionButton>
      </div>
    </div>
  )
}

const ExpandedContent = ({
  order,
  expanded
}: {
  order: Order
  expanded: boolean
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { userSettings } = state || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}
  const {
    price,
    size,
    stopLoss,
    takeProfit,
    orderId,
    posSide,
    createdAt,
    leverage,
    orderType,
    side,
    symbol
  } = order

  const orderValue = price * size
  const margin = orderValue / leverage

  const isLong = posSide === PosSide.LONG
  const isBuy = side === Side.BUY

  const feePercent = orderType === OrderType.LIMIT ? makerFee : takerFee

  const executionFee = price * size * feePercent

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
          label="Order Value"
          value={`${formatNumber(orderValue)}`}
          color="#f1f5f9"
          prefix="$"
        />
        <StatCard label="Margin" value={`${formatNumber(margin)}`} color="#f1f5f9" prefix="$" />
        <StatCard
          label="Execution Fee"
          value={`${formatNumber(executionFee)}`}
          color="#ef5350"
          prefix="$"
        />
        <StatCard label="Leverage" value={`${formatNumber(leverage)}`} color="#f1f5f9" prefix="x" />
        <StatCard
          label="Stop Loss"
          value={stopLoss ? `${formatNumber(stopLoss)}` : '–'}
          color="#ef4444"
        />
        <StatCard
          label="Take Profit"
          value={takeProfit ? `${formatNumber(takeProfit)}` : '–'}
          color="#10b981"
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
        <ItemInfo
          label="Fee Rate"
          value={`${formatNumber(makerFee * 100)}`}
          color="#3b82f6"
          postfix="%"
        />
        <ItemInfo
          label="Price"
          value={price ? `${formatNumber(price)}` : '–'}
          color="#f1f5f9"
          prefix="$"
        />
        <ItemInfo label="Size" value={price ? `${formatNumber(size)}` : '–'} color="#f1f5f9" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          fontSize: '11px'
        }}
      >
        <DetailItem label="Order ID" value={orderId} color="#cbd5e1" />
        <DetailItem label="Created" value={formatDate(createdAt)} color="#94a3b8" />
        <DetailItem label="Position Side" value={posSide} color={isLong ? '#26a69a' : '#ef5350'} />
        <DetailItem label="Side" value={side} color={isBuy ? '#26a69a' : '#ef5350'} />
      </div>
    </div>
  )
}
