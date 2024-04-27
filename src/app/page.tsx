'use client'
import React from 'react'
import { ToastContainer, cssTransition } from 'react-toastify'

import Builder from './builder'

const slide = cssTransition({
  enter: 'slideInUp',
  exit: 'slideOutDown',
})
export default function Page() {
  return (
    <>
      <Builder />
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
