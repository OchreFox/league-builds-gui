import React from 'react'
import Image from 'next/image'
import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import { ItemsSchema } from '../types/Items'

export const MythicItem = ({
  item,
  transition,
}: {
  item: ItemsSchema
  transition: any
}) => {
  if (!item.icon) {
    console.warn('No src for item:', item.name)
    return null
  }
  if (!item.visible) {
    return null
  }
  return (
    <motion.div
      layout
      transition={transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={item.id}
      about={item.id?.toString() ?? ''}
      className="mb-2 flex flex-col text-center"
      hidden={!item.visible}
    >
      <div
        className={cx(
          'relative flex items-center justify-center border border-yellow-700',
          css`
            background: radial-gradient(#eab308, #a16207);
            background-size: 400% 400%;
            animation: Glow 3s ease infinite;
            padding: 2px;

            @keyframes Glow {
              0% {
                background-position: 50% 0%;
              }
              50% {
                background-position: 50% 100%;
              }
              100% {
                background-position: 50% 0%;
              }
            }
          `
        )}
      >
        {/* Display the item icon */}
        <Image
          src={item.icon ?? ''}
          alt={item.name ?? ''}
          width={50}
          height={50}
        />
      </div>
      <p className="font-sans text-gray-200">{item.gold?.total}</p>
    </motion.div>
  )
}
