import React from 'react'
// import Image from 'next/image'
import { motion } from 'framer-motion'
import { ItemsSchema } from '../types/Items'

export const StandardItem = ({
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
      className="mb-2 flex flex-col text-center"
    >
      {/* Display the item icon */}
      <img
        src={item.icon ?? ''}
        alt={item.name ?? ''}
        className="object-cover"
        width={50}
        height={50}
      />
      <p className="font-sans text-gray-200">{item.gold?.total}</p>
    </motion.div>
  )
}
