import type { AppProps } from 'next/app'

import store from '@/store/store'
import { MotionConfig } from 'framer-motion'
import 'pattern.css/dist/pattern.min.css'
import React, { useCallback, useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'
import { ToastContainer, ToastPosition, TypeOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import 'styles/globals.css'
import { ReducedMotionType } from 'types/PotatoMode'

import 'components/ItemGrid/ItemGrid.css'
import { selectPotatoMode } from 'components/store/potatoModeSlice'

// Font imports
import '@fontsource/epilogue'
import '@fontsource/epilogue/600.css'
import '@fontsource/epilogue/700.css'
import '@fontsource/epilogue/900.css'
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-mono/300.css'
import '@fontsource/ibm-plex-serif'
import '@fontsource/inter'
import '@fontsource/inter/300.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@fontsource/work-sans/900.css'

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover
          theme="dark"
        />
      </MyApp>
    </Provider>
  )
}

export default App
