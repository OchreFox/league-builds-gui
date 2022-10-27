import type { AppProps } from 'next/app'

import { MotionConfig } from 'framer-motion'
import 'pattern.css/dist/pattern.min.css'
import React, { useEffect, useState } from 'react'
import { Provider, ReactReduxContext, useSelector } from 'react-redux'

import { selectPotatoMode } from '../components/store/potatoModeSlice'
import store from '../components/store/store'
import '../styles/globals.css'
import { ReducedMotionType } from '../types/PotatoMode'

// Potato Mode is a feature that reduces the amount of animations and effects
function MyApp({ children }: { children: React.ReactNode }) {
  const potatoMode = useSelector(selectPotatoMode)
  const [motionConfig, setMotionConfig] = useState<ReducedMotionType>()

  // Set initial motion config
  useEffect(() => {
    setMotionConfig(potatoMode ? 'always' : 'never')
  }, [])

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

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MyApp>
        <Component {...pageProps} />
      </MyApp>
    </Provider>
  )
}

export default App
