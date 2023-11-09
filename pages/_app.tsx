import type { AppProps } from 'next/app'
import localFont from 'next/font/local'

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

const beaufort = localFont({
  src: [
    {
      path: '../assets/fonts/BeaufortforLOL-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-HeavyItalic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/BeaufortforLOL-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
  ],
  variable: '--font-beaufort',
})

const slide = cssTransition({
  enter: 'slideInUp',
  exit: 'slideOutDown',
})

function App({ Component, pageProps, router }: AppProps) {
  return (
    <main className={beaufort.variable}>
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
    </main>
  )
}

// Potato Mode is a feature that reduces the amount of animations and effects
function MotionConfigWrapper({ Component, pageProps, router }: AppProps) {
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
