import React from 'react'

import { motion } from 'framer-motion'

const svgVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

const HorizontalButton = ({
  width = 0,
  hover = false,
  ...rest
}: {
  width: number
  hover: boolean
  [x: string]: any
}) => {
  return (
    <motion.svg
      id="a"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width + 5.66} 62`}
      width="100%"
      variants={svgVariants}
      initial="initial"
      animate={width > 0 ? 'animate' : 'initial'}
      {...rest}
      transition={{
        duration: 0.5,
      }}
    >
      <defs>
        <motion.linearGradient id="b" x1="291.33" y1={8} x2="291.33" y2={54} gradientUnits="userSpaceOnUse">
          <motion.stop
            offset={0}
            initial={{ stopColor: '#091428' }}
            animate={{ stopColor: hover ? '#0A1428' : '#091428' }}
            transition={{
              duration: 0.3,
            }}
          />
          <motion.stop
            offset={1}
            initial={{ stopColor: '#0A1428' }}
            animate={{ stopColor: hover ? '#32281E' : '#0A1428' }}
            transition={{
              duration: 0.3,
            }}
          />
        </motion.linearGradient>
        <motion.linearGradient id="c" x1="291.33" y1={6} x2="291.33" y2={56} gradientUnits="userSpaceOnUse">
          <motion.stop
            offset={0}
            initial={{ stopColor: '#C89B3C' }}
            animate={{ stopColor: hover ? '#F0E6D2' : '#C89B3C' }}
            transition={{
              duration: 0.3,
            }}
          />
          <motion.stop offset={1} stopColor="#785A28" />
        </motion.linearGradient>
        <linearGradient id="d" x1="291.33" y1={0} x2="291.33" y2={29} gradientUnits="userSpaceOnUse">
          <motion.stop
            offset={0}
            initial={{ stopColor: '##C8AA6E' }}
            animate={{ stopColor: hover ? '#F0E6D2' : '#C8AA6E' }}
            transition={{
              duration: 0.3,
            }}
          />
          <motion.stop offset={1} stopColor="#9f7a32" />
        </linearGradient>
        <linearGradient id="e" x1="291.33" y1={33} x2="291.33" y2={62} gradientUnits="userSpaceOnUse">
          <motion.stop offset={0} stopColor="#9f7a32" />
          <motion.stop offset=".99" stopColor="#785A28" />
        </linearGradient>
      </defs>
      <polygon
        points={`${width - 20.17} 8 ${width + 2.83} 31 ${width - 20.17} 54 ${
          width - 37.17
        } 54 25.83 54 2.83 31 25.83 8 ${width - 20.17} 8`}
        fill="url(#b)"
        stroke="url(#c)"
        strokeWidth="4"
      />
      <polyline
        points={`5.83 28 13.83 28 40.83 1 ${width - 35.17} 1 ${width - 8.17} 28 ${width - 0.17} 28`}
        fill="none"
        stroke="url(#d)"
        strokeWidth="2"
      />
      <polyline
        points={`${width - 0.17} 34 ${width - 8.17} 34 ${width - 35.17} 61 40.83 61 13.83 34 5.83 34`}
        fill="none"
        stroke="url(#e)"
        strokeWidth="2"
      />
    </motion.svg>
  )
}

export default HorizontalButton
