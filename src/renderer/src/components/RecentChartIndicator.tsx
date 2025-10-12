import { useState } from 'react'
import { COLORS } from './liquidityPool/colors'
import Header from './recentChartIndicator/Header'
import Footer from './recentChartIndicator/Footer'
import Loading from './recentChartIndicator/Loading'

export default function RecentChartIndicator(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative'
      }}
    >
      <Header
        selectedTimeframe={selectedTimeframe}
        isDropdownOpen={isDropdownOpen}
        setSelectedTimeframe={setSelectedTimeframe}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <div>
        <Loading loading={isLoading} />
      </div>
      <Footer />
    </div>
  )
}
