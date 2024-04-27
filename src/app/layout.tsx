import { Metadata } from 'next'
import localFont from 'next/font/local'
import React from 'react'
import { Providers } from './providers/Providers'
import Footer from '@/components/Layout/Footer'

// Font imports
import '@fontsource-variable/epilogue'
import '@fontsource-variable/inter'
import '@fontsource-variable/work-sans'
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-serif'

import '@/components/ItemGrid/ItemGrid.css'
import '@/styles/globals.css'
import 'pattern.css/dist/pattern.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import styles from '@/styles/index.module.scss'

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

export const metadata: Metadata = {
  title: 'League Tools | Item Builds',
  description: 'Create and share custom item builds for League of Legends',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={beaufort.variable}>
      <body className="relative min-h-screen bg-gradient-to-tr from-slate-900 via-brand-dark to-gray-900">
        <Providers>
          <main>
            <div className={`absolute inset-0 brightness-100 contrast-150 filter ${styles.noise}`} />
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
