import TradeActions from './tradePanel/TradeActions'

export default function TradePanel(): React.JSX.Element {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(22, 25, 41, 0.95), rgba(30, 33, 48, 0.98))',
        padding: '12px 20px',
        color: 'white',
        borderTop: '1px solid #333',
        display: 'flex',
        gap: '20px',
        alignItems: 'stretch',
        width: '100%',
        zIndex: 1
      }}
    >
      <TradeActions />
    </div>
  )
}
