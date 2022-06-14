import React, { useContext } from 'react'
import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import { Rarity } from '../types/FilterProps'
import { PotatoModeContext } from './hooks/PotatoModeStore'

export const RarityTitle = ({
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
}) => {
  const { state } = useContext(PotatoModeContext)

  const getBackgroundColor = () => {
    if (backgroundColor) {
      // Check if potato mode is enabled
      if (state.enabled) {
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
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className={cx(
        'sticky top-0 z-10 -mx-2 mb-2 border-b border-yellow-900 px-2 py-1 font-body font-semibold uppercase text-gray-200 shadow-2xl',
        !state.enabled && 'backdrop-blur',
        getBackgroundColor()
      )}
    >
      {rarity}
      <span className="font-body font-light text-gray-400"> (TIER {tier})</span>
    </motion.h3>
  )
}
