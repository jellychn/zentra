import React from 'react'
import PriceInformation from './mainHeader/PriceInformation'

export default function MainHeader(): React.JSX.Element {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1f35 0%, #161929 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 5,
        position: 'relative',
        minWidth: '100%',
        flexShrink: 0
      }}
    >
      <LeftSection />
      <MiddleSection />
      <RightSection />
    </div>
  )
}

const LeftSection = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        flexShrink: 0
      }}
    >
      <PriceInformation />
    </div>
  )
}

const MiddleSection = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
      }}
    ></div>
  )
}

const RightSection = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
      }}
    ></div>
  )
}
