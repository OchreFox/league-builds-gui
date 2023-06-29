import React from 'react'

import { Variants, motion } from 'framer-motion'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

const colors: any = fullConfig.theme?.colors

// Animate the vertical lines to scroll from top to bottom in a loop
const verticalLineVariants: Variants = {
  initial: {
    strokeDashoffset: 0,
  },
  animate: {
    strokeDashoffset: -50,
    transition: {
      duration: 4,
      ease: 'linear',
      repeat: Infinity,
    },
  },
}

const HorizontalWeavingSeparator = ({ isStatic, className }: { isStatic?: boolean; className?: string }) => {
  return (
    <div className={className}>
      <svg
        id="a"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 245.29 500"
        className="h-auto w-auto"
      >
        <defs>
          <linearGradient id="b" x1={0} y1="52.78" x2="180.3" y2="52.78" gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor={colors?.league?.goldDark} stopOpacity={0} />
            <stop offset={1} stopColor={colors?.league?.gold} />
          </linearGradient>
          <linearGradient id="c" y1="445.37" y2="445.37" xlinkHref="#b" />
          <linearGradient id="d" x1="195.9" y1={500} x2="195.9" y2={0} gradientUnits="userSpaceOnUse">
            <stop offset={0} stopColor={colors?.league?.goldYellow} stopOpacity={0} />
            <stop offset=".5" stopColor={colors?.league?.goldYellow} />
            <stop offset={1} stopColor={colors?.league?.goldYellow} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          points="187.37 196.89 200.1 196.89 236.58 233.38 219.97 250"
          fill="none"
          stroke={colors?.league?.goldLight}
          strokeMiterlimit={10}
        />
        <polyline
          points="187.7 302.78 200.43 302.78 236.92 266.29 220.3 249.67"
          fill="none"
          stroke={colors?.league?.goldLight}
          strokeMiterlimit={10}
        />
        <polygon
          points="242.46 246.33 179.65 183.52 176.82 186.35 239.63 249.16 176.82 311.97 179.65 314.8 242.46 251.99 245.29 249.16 242.46 246.33"
          fill={colors?.league?.gold}
        />
        <path
          d="M242.46,246.33l-18.83-18.83-2.83-2.83-2.83,2.83-18.83,18.83-2.83,2.83,2.83,2.83,18.83,18.83,2.83,2.83,2.83-2.83,18.83-18.83,2.83-2.83-2.83-2.83Zm-21.66,21.66l-18.83-18.83,18.83-18.83,18.83,18.83-18.83,18.83Z"
          fill={colors?.league?.gold}
        />
        <rect x="176.82" y="51.66" width="3.48" height="134.68" fill={colors?.league?.gold} />
        <rect x="176.82" y="311.8" width="3.48" height="134.68" fill={colors?.league?.gold} />
        <rect x={0} y="51.66" width="180.3" height="2.23" fill="url(#b)" />
        <rect x={0} y="444.25" width="180.3" height="2.23" fill="url(#c)" />
        <motion.line
          x1="195.9"
          x2="195.9"
          y2={500}
          fill="none"
          opacity=".33"
          stroke="url(#d)"
          strokeDasharray="0 0 1 4"
          strokeMiterlimit={10}
          strokeWidth={10}
          variants={verticalLineVariants}
          initial="initial"
          animate={!isStatic ? 'animate' : 'initial'}
        />
      </svg>
    </div>
  )
}

export default HorizontalWeavingSeparator
