import React, { forwardRef } from 'react'

import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { selectPotatoMode } from '@/store/potatoModeSlice'
import { Rarity } from '@/types/FilterProps'

export const RarityTitleWrapper = (
  {
    rarity,
    transition,
    variants,
    tier,
    backgroundColor,
    fallbackBackgroundColor,
  }: {
    rarity: Rarity
    transition: any
    variants: any
    tier: number
    backgroundColor?: string
    fallbackBackgroundColor?: string
  },
  ref: React.Ref<HTMLDivElement> | undefined
) => {
  const potatoMode = useSelector(selectPotatoMode)

  const getBackgroundColor = () => {
    if (backgroundColor) {
      // Check if potato mode is enabled or if browser doesn't support backdrop-filter
      if (potatoMode || !CSS.supports('backdrop-filter', 'blur(2px)')) {
        return fallbackBackgroundColor || 'bg-black'
      }
      return backgroundColor
    }
    // Return the default background color
    return 'bg-black/50'
  }

  return (
    <motion.h3
      key={rarity + 'Label'}
      ref={ref}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className={cx(
        'sticky top-0 z-10 -mx-2 mb-2 border-b border-yellow-900 px-2 py-1 font-body font-semibold uppercase tracking-wide text-gray-200 shadow-2xl',
        !potatoMode && 'backdrop-blur',
        getBackgroundColor()
      )}
    >
      {rarity}
    </motion.h3>
  )
}

export const RarityTitle = forwardRef(RarityTitleWrapper)
export default RarityTitle
