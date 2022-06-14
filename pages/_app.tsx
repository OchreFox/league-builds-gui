import '../styles/globals.css'
import 'pattern.css/dist/pattern.min.css'
import type { AppProps } from 'next/app'
import { MotionConfig } from 'framer-motion'
import {
  PotatoModeContext,
  PotatoModeStore,
} from '../components/hooks/PotatoModeStore'
import { useContext, useEffect, useState } from 'react'
import { ReducedMotionType } from '../types/Store'

function MyApp({ children }: { children: React.ReactNode }) {
  // Use the PotatoModeContext to get the state and set MotionConfig reducedMotion
  const { state } = useContext(PotatoModeContext)

  const [motionConfig, setMotionConfig] = useState<ReducedMotionType>()

  // Set initial motion config
  useEffect(() => {
    setMotionConfig(state.enabled ? 'always' : 'never')
  }, [])

  // Listen for changes to the state
  useEffect(() => {
    if (state.enabled) {
      // Disable animations
      console.log('Potato mode enabled')
      setMotionConfig('always')
    } else {
      // Enable animations
      console.log('Potato mode disabled')
      setMotionConfig('never')
    }
  }, [state.enabled])

  return <MotionConfig reducedMotion={motionConfig}>{children}</MotionConfig>
}

function App({ Component, pageProps }: AppProps) {
  return (
    <PotatoModeStore>
      <MyApp>
        <Component {...pageProps} />
      </MyApp>
    </PotatoModeStore>
  )
}

export default App
