import { Player } from '@lottiefiles/react-lottie-player'
import loader from 'public/effects/loader.json'
import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 m-auto">
      <Player autoplay loop src={loader} className="w-full h-auto p-20"></Player>
    </div>
  )
}

export default LoadingSpinner
