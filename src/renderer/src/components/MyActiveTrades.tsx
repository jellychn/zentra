import { useStateStore } from '@renderer/contexts/StateStoreContext'
import Position from './Position'
import { useState } from 'react'
import Orders from './Order'
import ActionIcon from '@renderer/elements/ActionIcon'
import ordersIcon from '../assets/icons/orders.svg'
import positionsIcon from '../assets/icons/positions.svg'
import { Trade } from 'src/main/db/dbTrades'
import { Order } from 'src/main/db/dbOrders'

export default function MyActiveTrades(): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { positions = [], orders = [] } = userTrades || {}
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [showOrders, setShowOrders] = useState(false)

  const handleOrdersClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setShowOrders(!showOrders)
  }

  const handleHeaderClick = (): void => {
    setIsCollapsed(!isCollapsed)
  }

  const titleText = showOrders ? 'My Active Orders' : 'My Open Positions'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flexShrink: 0
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          userSelect: 'none',
          marginBottom: '16px'
        }}
        onClick={handleHeaderClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#3b82f6',
              background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {showOrders ? orders.length : positions.length}
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {titleText}
          </div>
          <div
            style={{
              transition: 'all 0.3s ease',
              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              fontSize: '10px',
              color: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            ▼
          </div>
        </div>

        <div onClick={handleOrdersClick}>
          <ActionIcon
            icon={showOrders ? positionsIcon : ordersIcon}
            position="alone"
            compact={true}
            label={showOrders ? 'MY POSITIONS' : 'MY ORDERS'}
            amount={showOrders ? positions.length : orders.length}
            onClick={() => handleOrdersClick}
          />
        </div>
      </div>

      <div
        style={{
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          maxHeight: isCollapsed ? '0' : '400px',
          opacity: isCollapsed ? 0 : 1,
          transform: isCollapsed ? 'translateY(-10px)' : 'translateY(0)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            borderTop: '1px solid #333',
            borderBottom: '1px solid #333',
            height: '100%',
            minHeight: 0
          }}
        >
          <Content positions={positions} orders={orders} showOrders={showOrders} />
        </div>
      </div>
    </div>
  )
}

const Content = ({
  positions,
  orders,
  showOrders
}: {
  positions: Trade[]
  orders: Order[]
  showOrders: boolean
}): React.JSX.Element => {
  if (showOrders && orders.length === 0) {
    return <NoOrders />
  }

  if (!showOrders && positions.length === 0) {
    return <NoPositions />
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        maxHeight: '384px',
        overflowY: 'auto',
        padding: '16px',
        paddingRight: '8px'
      }}
    >
      {showOrders
        ? orders.map((order) => <Orders key={order.orderId} order={order} />)
        : positions.map((position) => <Position key={position.tradeId} position={position} />)}

      {/* Custom scrollbar styling */}
      <style>
        {`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </div>
  )
}

const NoPositions = (): React.JSX.Element => {
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          color: 'rgba(255, 255, 255, 0.6)',
          border: '2px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.5px'
            }}
          >
            YOU HAVE NO OPEN POSITIONS
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.4',
              maxWidth: '280px'
            }}
          >
            Your open positions will appear here once you start trading
          </div>
        </div>

        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            💡 Ready to start trading
          </div>
        </div>
      </div>
    </div>
  )
}

const NoOrders = (): React.JSX.Element => {
  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          color: 'rgba(255, 255, 255, 0.6)',
          border: '2px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.5px'
            }}
          >
            YOU HAVE NO ACTIVE ORDERS
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.4',
              maxWidth: '280px'
            }}
          >
            Your active orders will appear here once you place them
          </div>
        </div>

        <div
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            💡 Place an order to get started
          </div>
        </div>
      </div>
    </div>
  )
}
