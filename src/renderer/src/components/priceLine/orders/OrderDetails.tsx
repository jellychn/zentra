import { Order } from 'src/main/db/dbOrders'
import { formatNumber } from '../../../../../shared/helper'
import { MessageSenderType, Side } from '../../../../../shared/types'
import React from 'react'
import { sendIpcMessage } from '@renderer/ipcMain/message'
import ActionButton from '@renderer/elements/ActionButton'

const OrderDetails = ({
  order,
  hovered,
  orderColor
}: {
  order: Order
  hovered: boolean
  orderColor: string
}): React.JSX.Element => {
  return (
    <>
      <Content order={order} hovered={hovered} orderColor={orderColor} />
      <HoveredContent hovered={hovered} order={order} />
    </>
  )
}

export default OrderDetails

const Content = ({
  order,
  hovered,
  orderColor
}: {
  order: Order
  hovered: boolean
  orderColor: string
}): React.JSX.Element => {
  const { price, side, leverage, size, symbol } = order

  const isBuy = side === Side.BUY
  const value = price * size

  return (
    <div>
      <div
        style={{
          color: hovered ? orderColor : orderColor + 'CC',
          paddingBottom: hovered ? '6px' : '4px',
          fontWeight: 700,
          fontSize: hovered ? '11px' : '10px',
          borderBottom: hovered ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.6)',
            background: hovered ? 'rgba(30, 41, 59, 0.8)' : 'rgba(30, 41, 59, 0.5)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}
        >
          {isBuy ? 'BUY' : 'SELL'}
        </span>
        {formatNumber(Number(price))}
      </div>
      <div
        style={{
          marginTop: hovered ? '6px' : '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: hovered ? '9px' : '8px',
              fontWeight: 700,
              color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.7)'
            }}
          >
            ${formatNumber(Number(value))}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            Val
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <div
            style={{
              fontSize: hovered ? '9px' : '8px',
              fontWeight: 700,
              color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.7)'
            }}
          >
            {formatNumber(Number(size))}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            Size
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: hovered ? '6px' : '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: hovered ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: 700,
            color: hovered ? '#3b82f6' : 'rgba(59, 130, 246, 0.7)'
          }}
        >
          {leverage}x
        </div>

        <div
          style={{
            fontSize: '7px',
            color: hovered ? '#64748b' : 'rgba(100, 116, 139, 0.5)',
            fontWeight: 600
          }}
        >
          {symbol}
        </div>
      </div>
    </div>
  )
}

const HoveredContent = ({
  hovered,
  order
}: {
  hovered: boolean
  order: Order
}): React.JSX.Element => {
  const handleCancelOrder = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation()
    sendIpcMessage({
      message: MessageSenderType.CANCEL_ORDER,
      data: {
        orderId: order.orderId
      }
    })
  }

  if (!hovered) {
    return <></>
  }

  return (
    <ActionButton
      color="#ef4444"
      hoverColor="#f87171"
      style={{
        fontSize: '9px',
        padding: '8px',
        marginTop: '15px'
      }}
      tooltip={`Close Order`}
      onClick={handleCancelOrder}
    >
      CANCEL
    </ActionButton>
  )
}
