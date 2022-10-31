import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import React from 'react'
import { FilterByRarityState, Rarity } from 'types/FilterProps'

export default function FilterItemsByRarity({ rarityFilter, setRarityFilter }: FilterByRarityState) {
  return (
    <span className="relative z-0 inline-flex grow rounded-md shadow-sm">
      <motion.button
        whileTap={{
          scale: 0.9,
        }}
        transition={{
          duration: 0.1,
          type: 'tween',
        }}
        type="button"
        title="Basic"
        className={cx(
          rarityFilter === Rarity.Basic
            ? 'bg-brand-default text-white'
            : 'bg-transparent text-gray-600 hover:bg-cyan-900 hover:text-black',
          'relative inline-flex items-center rounded-l-md border border-yellow-900 px-4 py-2 text-sm font-medium transition-colors duration-200 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 motion-reduce:transition-none'
        )}
        onClick={() => {
          if (rarityFilter !== Rarity.Basic) {
            setRarityFilter(Rarity.Basic)
          } else {
            setRarityFilter(Rarity.Empty)
          }
        }}
      >
        B
      </motion.button>
      <motion.button
        whileTap={{
          scale: 0.9,
        }}
        transition={{
          duration: 0.1,
          type: 'tween',
        }}
        type="button"
        title="Epic"
        className={cx(
          rarityFilter === Rarity.Epic
            ? 'bg-brand-default text-white'
            : 'bg-transparent text-gray-600 hover:bg-cyan-900 hover:text-black',
          'relative -ml-px inline-flex items-center border border-yellow-900 px-4 py-2 text-sm font-medium transition-colors duration-200 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 motion-reduce:transition-none'
        )}
        onClick={() => {
          // If the tier isn't already the current one, set it to the current one
          if (rarityFilter !== Rarity.Epic) {
            setRarityFilter(Rarity.Epic)
          } // Else, set it to empty
          else {
            setRarityFilter(Rarity.Empty)
          }
        }}
      >
        E
      </motion.button>
      <motion.button
        whileTap={{
          scale: 0.9,
        }}
        transition={{
          duration: 0.1,
          type: 'tween',
        }}
        type="button"
        title="Legendary"
        className={cx(
          rarityFilter === Rarity.Legendary
            ? 'bg-brand-default text-white'
            : 'bg-transparent text-gray-600 hover:bg-cyan-900 hover:text-black',
          'relative -ml-px inline-flex items-center border border-yellow-900 px-4 py-2 text-sm font-bold transition-colors duration-200 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 motion-reduce:transition-none'
        )}
        onClick={() => {
          // If the tier isn't already the current one, set it to the current one
          if (rarityFilter !== Rarity.Legendary) {
            setRarityFilter(Rarity.Legendary)
          } // Else, set it to empty
          else {
            setRarityFilter(Rarity.Empty)
          }
        }}
      >
        L
      </motion.button>
      <motion.button
        whileTap={{
          scale: 0.9,
        }}
        transition={{
          duration: 0.1,
          type: 'tween',
        }}
        type="button"
        title="Mythic"
        className={cx(
          rarityFilter === Rarity.Mythic
            ? 'bg-brand-default text-white'
            : 'bg-transparent text-gray-600 hover:bg-cyan-900 hover:text-black',
          'relative -ml-px inline-flex items-center rounded-r-md border border-yellow-900  px-4 py-2 text-sm font-bold transition-colors duration-200 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 motion-reduce:transition-none'
        )}
        onClick={() => {
          // If the tier isn't already the current one, set it to the current one
          if (rarityFilter !== Rarity.Mythic) {
            setRarityFilter(Rarity.Mythic)
          } // Else, set it to empty
          else {
            setRarityFilter(Rarity.Empty)
          }
        }}
      >
        M
      </motion.button>
    </span>
  )
}
