import ActionButton from '@renderer/elements/ActionButton'
import { sendIpcMessage } from '@renderer/ipcMain/message'
import React from 'react'
import { MessageSenderType, OrderType, PosSide, Side } from '../../../../shared/types'

const TradeAction = (): React.JSX.Element => {
  const sendCreateOrder = (orderType: OrderType, side: Side, posSide: PosSide): void => {
    sendIpcMessage({ message: MessageSenderType.CREATE_ORDER, data: { orderType, side, posSide } })
  }

  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: 'flex',
          gap: '15px',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <Entry sendCreateOrder={sendCreateOrder} />
        <Exit />
        <RiskManagement />
      </div>
    </div>
  )
}

const SectionHeader = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <div
    style={{
      fontSize: '8px',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '2px',
      textAlign: 'center'
    }}
  >
    {children}
  </div>
)

const Entry = ({
  sendCreateOrder
}: {
  sendCreateOrder: (orderType: OrderType, side: Side, posSide: PosSide) => void
}): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 2
      }}
    >
      <SectionHeader>ENTRY</SectionHeader>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flex: 1,
          height: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1
          }}
        >
          <ActionButton
            color="#10b981"
            hoverColor="#34d399"
            fill
            style={{
              fontSize: '9px',
              padding: '4px 8px',
              minHeight: '28px',
              flex: 1
            }}
            tooltip="Open long position at market price"
            onClick={() => sendCreateOrder(OrderType.MARKET, Side.BUY, PosSide.LONG)}
          >
            LONG
          </ActionButton>
          <ActionButton
            color="#ef4444"
            hoverColor="#f87171"
            fill
            style={{
              fontSize: '9px',
              padding: '4px 8px',
              minHeight: '28px',
              flex: 1
            }}
            tooltip="Open short position at market price"
            onClick={() => sendCreateOrder(OrderType.MARKET, Side.SELL, PosSide.SHORT)}
          >
            SHORT
          </ActionButton>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1
          }}
        >
          <ActionButton
            color="#10b981"
            hoverColor="#34d399"
            glass
            style={{
              fontSize: '9px',
              padding: '4px 8px',
              minHeight: '28px',
              flex: 1
            }}
            tooltip="Place limit order for long position"
            onClick={() => sendCreateOrder(OrderType.LIMIT, Side.BUY, PosSide.LONG)}
          >
            LIMIT L
          </ActionButton>
          <ActionButton
            color="#ef4444"
            hoverColor="#f87171"
            glass
            style={{
              fontSize: '9px',
              padding: '4px 8px',
              minHeight: '28px',
              flex: 1
            }}
            tooltip="Place limit order for short position"
            onClick={() => sendCreateOrder(OrderType.LIMIT, Side.SELL, PosSide.SHORT)}
          >
            LIMIT S
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

const Exit = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
      }}
    >
      <SectionHeader>EXIT</SectionHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          height: '100%'
        }}
      >
        <ActionButton
          color="#f59e0b"
          hoverColor="#fbbf24"
          fill
          style={{
            fontSize: '9px',
            padding: '4px 8px',
            minHeight: '28px',
            flex: 1
          }}
          tooltip="Close position at market price"
          onClick={() => {}}
        >
          MARKET
        </ActionButton>
        <ActionButton
          color="#f59e0b"
          hoverColor="#fbbf24"
          glass
          style={{
            fontSize: '9px',
            padding: '4px 8px',
            minHeight: '28px',
            flex: 1
          }}
          tooltip="Place limit order to close position"
          onClick={() => {}}
        >
          LIMIT
        </ActionButton>
      </div>
    </div>
  )
}

const RiskManagement = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
      }}
    >
      <SectionHeader>RISK</SectionHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          height: '100%'
        }}
      >
        <ActionButton
          color="#8b5cf6"
          hoverColor="#a78bfa"
          fill
          style={{
            fontSize: '9px',
            padding: '4px 8px',
            minHeight: '28px',
            flex: 1
          }}
          tooltip="Close all open positions"
          onClick={() => {}}
        >
          CLOSE ALL POSITIONS
        </ActionButton>
        <ActionButton
          color="#8b5cf6"
          hoverColor="#a78bfa"
          glass
          style={{
            fontSize: '9px',
            padding: '4px 8px',
            minHeight: '28px',
            flex: 1
          }}
          tooltip="Cancel all pending orders"
          onClick={() => {}}
        >
          CANCEL ALL ORDERS
        </ActionButton>
      </div>
    </div>
  )
}

export default TradeAction
