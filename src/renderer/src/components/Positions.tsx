import { useStateStore } from '@renderer/contexts/StateStoreContext'
import Position from './Position'
import { useState } from 'react'

export default function Positions(): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { positions = [] } = userTrades || {}
  const [isCollapsed, setIsCollapsed] = useState(false)

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
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            My Active Positions
          </div>
          <div
            style={{
              transition: 'transform 0.3s ease',
              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            ▼
          </div>
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#3b82f6',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {positions.length}
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
          <Content positions={positions} />
        </div>
      </div>
    </div>
  )
}

const Content = ({ positions }: { positions: any[] }): React.JSX.Element => {
  if (positions.length === 0) {
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
      {positions.map((position) => (
        <Position key={position.tradeId} position={position} />
      ))}

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
            Your positions will appear here once you start trading
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
