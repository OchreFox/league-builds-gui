import type { AppProps } from 'next/app'

import React, { useCallback, useEffect, useState } from 'react'

import { selectPotatoMode } from 'components/store/potatoModeSlice'
import { MotionConfig } from 'framer-motion'
import { Provider, useSelector } from 'react-redux'
import { ToastContainer, cssTransition } from 'react-toastify'
import { ReducedMotionType } from 'types/PotatoMode'

import store from '@/store/store'

// Font imports
import '@fontsource-variable/epilogue'
import '@fontsource-variable/inter'
import '@fontsource-variable/work-sans'
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-serif'

import 'components/ItemGrid/ItemGrid.css'
import 'pattern.css/dist/pattern.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'styles/globals.css'

const slide = cssTransition({
  enter: 'slideInUp',
  exit: 'slideOutDown',
})

function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        theme="dark"
        transition={slide}
      />
    </>
  )
}

// Potato Mode is a feature that reduces the amount of animations and effects
function MotionConfigWrapper({ Component, pageProps, router }: AppProps) {
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

  return (
    <MotionConfig reducedMotion={motionConfig}>
      <App Component={Component} pageProps={pageProps} router={router} />
    </MotionConfig>
  )
}

function AppWrapper({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <MotionConfigWrapper Component={Component} pageProps={pageProps} router={router} />
    </Provider>
  )
}

export default AppWrapper
