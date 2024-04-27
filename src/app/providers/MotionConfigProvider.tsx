import React, { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { ReducedMotionType } from '@/types/PotatoMode'

export function MotionConfigProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const potatoMode = useSelector(selectPotatoMode)
  const [motionConfig, setMotionConfig] = useState<ReducedMotionType>()

  // Set initial motion config
  useEffect(() => {
    setMotionConfig(potatoMode ? 'always' : 'never')
  }, [potatoMode])

  // Listen for changes to the state
  useEffect(() => {
    if (potatoMode) {
      // Disable animations
      setMotionConfig('always')
    } else {
      // Enable animations
      setMotionConfig('never')
    }
  }, [potatoMode])

  return <MotionConfig reducedMotion={motionConfig}>{children}</MotionConfig>
}

export default MotionConfigProvider
