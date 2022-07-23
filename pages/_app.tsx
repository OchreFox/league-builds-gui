import type { AppProps } from 'next/app'

import { MotionConfig } from 'framer-motion'
import { StateMachineProvider, createStore } from 'little-state-machine'
import 'pattern.css/dist/pattern.min.css'
import { useContext, useEffect, useState } from 'react'

import { PotatoModeContext, PotatoModeStore } from '../components/hooks/PotatoModeStore'
import '../styles/globals.css'
import { ReducedMotionType } from '../types/Store'

function log(store: any) {
  console.log(store)
  return store
}

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
      setMotionConfig('always')
    } else {
      // Enable animations
      setMotionConfig('never')
    }
  }, [state.enabled])

  return <MotionConfig reducedMotion={motionConfig}>{children}</MotionConfig>
}

function App({ Component, pageProps }: AppProps) {
  createStore(
    {
      itemBuild: {
        title: '',
        associatedMaps: [],
        associatedChampions: [],
        blocks: [],
      },
    },
    {
      middleWares: [log],
    }
  )

  return (
    <StateMachineProvider>
      <PotatoModeStore>
        <MyApp>
          <Component {...pageProps} />
        </MyApp>
      </PotatoModeStore>
    </StateMachineProvider>
  )
}

export default App
