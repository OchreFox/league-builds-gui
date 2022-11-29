import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ItemContainerState } from 'types/FilterProps'

import { gridContainerVariants, transitionVariant } from './ItemGridComponents'
import { StandardItem } from './StandardItem'

export const ItemContainer = ({
  gridKey,
  itemsCombined,
  setItemsCombined,
  transition,
  mythic,
  itemRefArray,
}: ItemContainerState) => {
  if (!itemsCombined || itemsCombined.length === 0) {
    return null
  }

  return (
    <>
      <motion.ul
        key={gridKey}
        variants={gridContainerVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transitionVariant}
        className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
      >
        {itemsCombined.map((item, index) => (
          <StandardItem
            key={'item-' + item.id + '-' + index}
            item={item}
            transition={transition}
            isMythic={mythic}
            itemRefArray={itemRefArray}
          />
        ))}
      </motion.ul>
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
