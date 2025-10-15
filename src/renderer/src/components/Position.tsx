import React, { useState } from 'react'
import { formatNumber } from '../../../shared/helper'

export default function Position({
  position
}: {
  position: Record<string, any>
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const {
    positionStatus = '–',
    posSide = '–',
    symbol = '–',
    leverageRr = '–',
    avgEntryPriceRp = 0,
    liquidationPriceRp = 0,
    cumFundingFeeRv = 0,
    assignedPosBalanceRv = 0,
    sizeRq = '–',
    rlPnl = 0,
    unPnl = 0,
    netMakerProfit = 0,
    netTakerProfit = 0,
    // Additional fields from your data structure
    status,
    entryPrice,
    exitPrice,
    size,
    leverage,
    side
  } = position || {}

  // Use available data with fallbacks
  const displaySymbol = symbol !== '–' ? symbol : 'Unknown'
  const displayPosSide = posSide !== '–' ? posSide : side || '–'
  const displayLeverage = leverageRr !== '–' ? leverageRr : leverage || '–'
  const displayEntryPrice = avgEntryPriceRp || entryPrice || 0
  const displaySize = sizeRq !== '–' ? sizeRq : size || '–'
  const displayStatus = positionStatus !== '–' ? positionStatus : status || '–'

  const totalPnl = Number(rlPnl) + Number(unPnl) + Number(cumFundingFeeRv)
  const isLong = displayPosSide?.toLowerCase() === 'long'
  const positionValue = Number(displayEntryPrice) * Number(displaySize)
  const margin = positionValue / Number(displayLeverage)

  return (
    <div
      style={{
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '12px',
        background: 'rgba(30, 33, 48, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isLong ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered
          ? `0 8px 25px ${isLong ? 'rgba(38, 166, 154, 0.15)' : 'rgba(239, 83, 80, 0.15)'}`
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              background: isLong
                ? 'linear-gradient(135deg, #26a69a, #10b981)'
                : 'linear-gradient(135deg, #ef5350, #f87171)',
              color: '#fff',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              transform: hovered ? 'scale(1.1) rotate(5deg)' : 'none',
              boxShadow: `0 4px 12px ${
                isLong ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'
              }`
            }}
          >
            {isLong ? '▲' : '▼'}
          </div>
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#f1f5f9',
                marginBottom: '2px'
              }}
            >
              {displaySymbol}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: isLong ? '#26a69a' : '#ef5350',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {displayPosSide} • {displayLeverage}x
            </div>
          </div>
        </div>

        {/* PnL Summary */}
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: unPnl >= 0 ? '#10b981' : '#ef4444',
              marginBottom: '4px'
            }}
          >
            {unPnl >= 0 ? '+' : ''}
            {formatNumber(unPnl)}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: '600'
            }}
          >
            UNREALIZED PnL
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        <StatCard
          label="Entry Price"
          value={`$${formatNumber(displayEntryPrice)}`}
          color="#f1f5f9"
        />
        <StatCard
          label="Size"
          value={formatNumber(Number(displaySize))}
          subValue={displaySymbol}
          color="#f1f5f9"
        />
        <StatCard
          label="Position Value"
          value={`$${formatNumber(positionValue)}`}
          color="#cbd5e1"
          size="small"
        />
        <StatCard label="Margin" value={`$${formatNumber(margin)}`} color="#cbd5e1" size="small" />
      </div>

      {/* PnL Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <PnlItem label="Realized PnL" value={rlPnl} color={rlPnl >= 0 ? '#10b981' : '#ef4444'} />
        <PnlItem
          label="Net Maker"
          value={netMakerProfit}
          color={netMakerProfit >= 0 ? '#10b981' : '#ef4444'}
        />
        <PnlItem
          label="Net Taker"
          value={netTakerProfit}
          color={netTakerProfit >= 0 ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Expandable Detailed Section */}
      {expanded && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}
          >
            {/* Risk Management */}
            <div>
              <SectionTitle>Risk Management</SectionTitle>
              <DetailItem
                label="Liquidation Price"
                value={`$${formatNumber(Number(liquidationPriceRp))}`}
                color="#ef4444"
              />
              <DetailItem
                label="Position Status"
                value={displayStatus}
                color={displayStatus === 'active' ? '#10b981' : '#ef4444'}
              />
            </div>

            {/* Profit Targets */}
            <div>
              <SectionTitle>Profit Targets</SectionTitle>
              <DetailItem
                label="Funding Fee"
                value={`$${formatNumber(cumFundingFeeRv)}`}
                color={cumFundingFeeRv >= 0 ? '#10b981' : '#ef4444'}
              />
              <DetailItem
                label="Total PnL"
                value={`$${formatNumber(totalPnl)}`}
                color={totalPnl >= 0 ? '#10b981' : '#ef4444'}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <SectionTitle>Position Details</SectionTitle>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}
            >
              <DetailItem
                label="Assigned Balance"
                value={`$${formatNumber(Number(assignedPosBalanceRv))}`}
                color="#cbd5e1"
              />
              <DetailItem label="Leverage" value={`${displayLeverage}x`} color="#cbd5e1" />
            </div>
          </div>
        </div>
      )}

      {/* Expand/Collapse Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '12px'
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'none'
          }}
        >
          ▼
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// Helper Components
const StatCard = ({ label, value, subValue, color, size = 'normal' }: any) => (
  <div
    style={{
      padding: '8px 12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
  >
    <div
      style={{
        fontSize: '10px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600',
        marginBottom: '4px'
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: size === 'small' ? '12px' : '14px',
        fontWeight: 'bold',
        color: color
      }}
    >
      {value}
    </div>
    {subValue && (
      <div
        style={{
          fontSize: '9px',
          color: '#64748b',
          marginTop: '2px'
        }}
      >
        {subValue}
      </div>
    )}
  </div>
)

const PnlItem = ({ label, value, color }: any) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        fontSize: '10px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
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
      ${typeof value === 'number' ? formatNumber(value) : value}
    </div>
  </div>
)

const SectionTitle = ({ children }: any) => (
  <div
    style={{
      fontSize: '11px',
      color: '#cbd5e1',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: 'bold',
      marginBottom: '12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '4px'
    }}
  >
    {children}
  </div>
)

const DetailItem = ({ label, value, color }: any) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '11px'
    }}
  >
    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{label}</span>
    <span style={{ color, fontWeight: 'bold' }}>{value}</span>
  </div>
)

SectionTitle.displayName = 'SectionTitle'
StatCard.displayName = 'StatCard'
PnlItem.displayName = 'PnlItem'
DetailItem.displayName = 'DetailItem'
Position.displayName = 'Position'
