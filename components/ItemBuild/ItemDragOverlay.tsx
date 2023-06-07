import { useDndContext } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import React, { useMemo } from 'react'
import { ItemsSchema } from 'types/Items'

import { ItemIcon } from 'components/ItemGrid/ItemIcon'

import { easeOutExpo } from 'utils/Transition'

const ItemDragOverlay = ({ item }: { item: ItemsSchema }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={easeOutExpo}
      className="relative -m-1 flex flex-col items-center rounded-md border border-green-500 bg-green-500/50 px-2 py-2 text-center shadow-md transition-colors duration-200 ease-in-out"
    >
      <ItemIcon item={item} />
      <p className="font-sans placeholder:text-yellow-200">{item.gold?.total}</p>
    </motion.div>
  )
}

export default ItemDragOverlay
