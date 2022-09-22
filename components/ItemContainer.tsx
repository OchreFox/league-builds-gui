import { DragOverlay, useDndContext } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import { ItemContainerState } from '../types/FilterProps'
import { gridContainerVariants, transitionVariant } from './ItemGridComponents'
import { StandardItem } from './StandardItem'

export const ItemContainer = ({
  gridKey,
  itemsCombined,
  transition,
  mythic,
  hoveredItem,
  selectedItem,
  activeItem,
  setHoveredItem,
  setSelectedItem,
  itemRefArray,
}: ItemContainerState) => {
  if (!itemsCombined || itemsCombined.length === 0) {
    return null
  }

  const ItemOverlay = () => {
    if (activeItem) {
      const item = itemsCombined.find((x) => x.id === activeItem)
      if (!item) return null
      return (
        <StandardItem
          key={'item-' + item.id + '-overlay'}
          item={item}
          transition={transition}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          isMythic={mythic}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          itemRefArray={itemRefArray}
        />
      )
    } else return null
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
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            isMythic={mythic}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            itemRefArray={itemRefArray}
          />
        ))}
      </motion.ul>
      {createPortal(
        <DragOverlay>
          <ItemOverlay />
        </DragOverlay>,
        document.body
      )}
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
