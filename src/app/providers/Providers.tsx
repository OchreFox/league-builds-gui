'use client'

import StoreProvider from './StoreProvider'
import MotionConfigProvider from './MotionConfigProvider'

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      <MotionConfigProvider>{children}</MotionConfigProvider>
    </StoreProvider>
  )
}
