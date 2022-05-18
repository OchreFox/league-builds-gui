import React from 'react'
import { ItemsSchema } from '../types/Items'
import { StandardItem } from './StandardItem'
import { MythicItem } from './MythicItem'

export const ItemContainer = ({
  itemsCombined,
  transition,
  mythic,
}: {
  itemsCombined: ItemsSchema[]
  transition: any
  mythic: boolean
}) => {
  if (!itemsCombined || itemsCombined.length === 0) {
    return null
  }
  const ItemType = mythic ? MythicItem : StandardItem
  // console.log(itemsCombined)
  return (
    <>
      {itemsCombined.map((item, index) => (
        <ItemType
          key={item.id + '-' + index}
          item={item}
          transition={transition}
        />
      ))}
    </>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
