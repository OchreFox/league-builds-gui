import React from 'react'
import { StandardItem } from './StandardItem'
import { ItemContainerState } from '../types/FilterProps'

export const ItemContainer = ({
  itemsCombined,
  transition,
  mythic,
  hoveredItem,
  setHoveredItem,
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
        />
      ))}
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
