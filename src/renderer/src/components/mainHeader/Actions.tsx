import ActionIcon from '@renderer/elements/ActionIcon'
import ordersIcon from '../../assets/icons/orders.svg'
import transactionIcon from '../../assets/icons/transaction.svg'
import lightningIcon from '../../assets/icons/lightning.svg'
import indicatorsIcon from '../../assets/icons/indicators.svg'
import chartIcon from '../../assets/icons/chart.svg'
import bitcoinIcon from '../../assets/icons/bitcoin.svg'
import settingsIcon from '../../assets/icons/setting.svg'
import userIcon from '../../assets/icons/user.svg'

const Actions = (): React.JSX.Element => {
  const currentPage = 'trade'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <ActionIcon icon={ordersIcon} position="alone" compact={true} label="ORDERS / POSITIONS" />
      <ActionIcon
        icon={transactionIcon}
        position="alone"
        active={currentPage === 'trade'}
        label="TRADE"
        compact={true}
      />
      {currentPage === 'trade' && (
        <>
          <ActionIcon
            icon={lightningIcon}
            position="alone"
            label="TRADE PANEL"
            compact={true}
            style={{
              border: currentPage === 'trade' ? '2px solid #7E57C2' : 'none',
              boxShadow: currentPage === 'trade' ? '0 0 10px rgba(126, 87, 194, 0.5)' : 'none'
            }}
          />
          <ActionIcon
            icon={indicatorsIcon}
            position="alone"
            label="TRADE INDICATORS"
            compact={true}
            style={{
              border: currentPage === 'trade' ? '2px solid #7E57C2' : 'none',
              boxShadow: currentPage === 'trade' ? '0 0 10px rgba(126, 87, 194, 0.5)' : 'none'
            }}
          />
        </>
      )}
      <ActionIcon icon={chartIcon} position="alone" label="SIMULATE" compact={true} />
      <ActionIcon
        icon={bitcoinIcon}
        position="alone"
        label="COINS"
        style={{ marginRight: '20px' }}
        compact={true}
      />
      <ActionIcon icon={settingsIcon} position="alone" label="ME" compact={true} />
      <ActionIcon icon={userIcon} position="alone" label="ME" compact={true} />
    </div>
  )
}

export default Actions
