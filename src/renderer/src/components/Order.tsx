import React, { useState } from 'react'
import { formatNumber } from '../../../shared/helper'

export default function Order({ order }: { order: Record<string, any> }): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const {
    orderId = '–',
    orderStatus = '–',
    orderType = '–',
    posSide = '–',
    symbol = '–',
    side = '–',
    priceRp = 0,
    orderQtyRq = 0,
    orderValueRv = 0,
    leverageRr = '–',
    stopLossRp = 0,
    takeProfitRp = 0,
    createdAt = '–',
    updatedAt = '–',
    execFeeRv = 0,
    feeRateRr = 0,
    totalExecValueRv = 0,
    avgPriceRp = 0,
    cumFeeRv = 0,
    cumValueRv = 0,
    status,
    orderPrice,
    size,
    leverage
  } = order || {}

  // Use available data with fallbacks
  const displaySymbol = symbol !== '–' ? symbol : 'Unknown'
  const displayOrderType = orderType !== '–' ? orderType : '–'
  const displayPosSide = posSide !== '–' ? posSide : side || '–'
  const displayLeverage = leverageRr !== '–' ? leverageRr : leverage || '–'
  const displayPrice = priceRp || orderPrice || 0
  const displaySize = orderQtyRq !== 0 ? orderQtyRq : size || 0
  const displayStatus = orderStatus !== '–' ? orderStatus : status || '–'
  const displayOrderValue = orderValueRv || displayPrice * displaySize

  const isLong = displayPosSide?.toLowerCase() === 'long'
  const isBuy = side?.toLowerCase() === 'buy'
  const isActive =
    displayStatus?.toLowerCase() === 'active' || displayStatus?.toLowerCase() === 'open'
  const isMarketOrder = displayOrderType?.toLowerCase() === 'market'

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'filled') return '#10b981'
    if (statusLower === 'cancelled') return '#ef4444'
    if (statusLower === 'rejected') return '#dc2626'
    if (statusLower === 'active' || statusLower === 'open') return '#3b82f6'
    if (statusLower === 'partiallyfilled') return '#f59e0b'
    return '#94a3b8'
  }

  const formatDate = (dateString: string) => {
    if (dateString === '–') return '–'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

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
              {displaySymbol}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: isBuy ? '#26a69a' : '#ef5350',
                fontWeight: '600'
              }}
            >
              {displayPosSide} • {displayOrderType} • {displayLeverage}x
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
            {formatNumber(Number(displaySize))}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: 'bold'
            }}
          >
            {isMarketOrder ? 'Market' : `$${formatNumber(displayPrice)}`}
          </div>
        </div>

        <div style={{ textAlign: 'right', minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: getStatusColor(displayStatus),
              marginBottom: '2px'
            }}
          >
            {displayStatus}
          </div>
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
        </div>
      </div>

      {expanded && (
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
              value={`$${formatNumber(displayOrderValue)}`}
              color="#f1f5f9"
            />
            <StatCard label="Execution Fee" value={`$${formatNumber(execFeeRv)}`} color="#f1f5f9" />
            <StatCard
              label="Stop Loss"
              value={stopLossRp ? `$${formatNumber(stopLossRp)}` : '–'}
              color="#ef4444"
            />
            <StatCard
              label="Take Profit"
              value={takeProfitRp ? `$${formatNumber(takeProfitRp)}` : '–'}
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
            <PnlItem label="Fee Rate" value={`${formatNumber(feeRateRr * 100)}%`} color="#3b82f6" />
            <PnlItem
              label="Total Exec Value"
              value={`$${formatNumber(totalExecValueRv)}`}
              color="#f1f5f9"
            />
            <PnlItem
              label="Avg Price"
              value={avgPriceRp ? `$${formatNumber(avgPriceRp)}` : '–'}
              color="#f1f5f9"
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
            <DetailItem label="Order ID" value={orderId} color="#cbd5e1" />
            <DetailItem
              label="Cumulative Fee"
              value={`$${formatNumber(cumFeeRv)}`}
              color="#ef4444"
            />
            <DetailItem label="Created" value={formatDate(createdAt)} color="#94a3b8" />
            <DetailItem label="Updated" value={formatDate(updatedAt)} color="#94a3b8" />
            <DetailItem
              label="Cumulative Value"
              value={`$${formatNumber(cumValueRv)}`}
              color="#10b981"
            />
            <DetailItem
              label="Position Side"
              value={displayPosSide}
              color={isLong ? '#26a69a' : '#ef5350'}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const StatCard = ({ label, value, color }: any) => (
  <div
    style={{
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}
  >
    <div
      style={{
        fontSize: '9px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: '4px'
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: color
      }}
    >
      {value}
    </div>
  </div>
)

const PnlItem = ({ label, value, color }: any) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        fontSize: '9px',
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: '4px'
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: '11px',
        fontWeight: 'bold',
        color: color
      }}
    >
      {value}
    </div>
  </div>
)

const DetailItem = ({ label, value, color = '#cbd5e1' }: any) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{label}</span>
    <span style={{ color, fontWeight: 'bold' }}>{value}</span>
  </div>
)
