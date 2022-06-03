import React from 'react'
import { StandardItem } from './StandardItem'
import { ItemContainerState } from '../types/FilterProps'

export const ItemContainer = ({
  itemsCombined,
  transition,
  mythic,
  hoveredItem,
  selectedItem,
  setHoveredItem,
  setSelectedItem,
}: ItemContainerState) => {
  if (!itemsCombined || itemsCombined.length === 0) {
    return null
  }
  return (
    <>
      {itemsCombined.map((item, index) => (
        <StandardItem
          key={item.id + '-' + index}
          item={item}
          transition={transition}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          isMythic={mythic}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      ))}
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
