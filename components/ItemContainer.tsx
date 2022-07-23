import React from 'react'

import { ItemContainerState } from '../types/FilterProps'
import { StandardItem } from './StandardItem'

export const ItemContainer = ({
  itemsCombined,
  transition,
  mythic,
  hoveredItem,
  selectedItem,
  setHoveredItem,
  setSelectedItem,
  itemRefArray,
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
          itemRefArray={itemRefArray}
        />
      ))}
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
