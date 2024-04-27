import { RefObject } from 'react'

import { cx } from '@emotion/css'
import { ItemRefArrayType } from '@/types/FilterProps'
import { ItemsSchema } from '@/types/Items'
//uuid
import { v4 as uuidv4 } from 'uuid'

import { dynamicListItemStyles, dynamicUnorderedListStyles } from '@/components/ItemBuildTree/BuildTreeComponents'
import { BuildTreeItem } from '@/components/ItemBuildTree/BuildTreeItem'

// Recursive component to render item build tree as a nested list of items with depth
export const BuildTreeItems = ({
  items,
  baseItem,
  buildTree,
  depth,
  setTriggerSelection,
  itemRefArray,
  itemGridRef,
}: {
  items: ItemsSchema[]
  baseItem: ItemsSchema
  buildTree: ItemsSchema[]
  depth: number
  setTriggerSelection: React.Dispatch<React.SetStateAction<number | null | undefined>>
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}) => {
  if (depth > 5) {
    return null
  }
  if (!buildTree || buildTree.length === 0) {
    return null
  }
  const filteredBuildTree = buildTree.filter((item) => item.depth === depth)
  const filteredChildren = buildTree.filter((item) => item.depth && item.depth > depth)

  return (
    <ul
      className={cx(
        'relative flex flex-col items-start justify-center space-y-4 from-yellow-600 to-yellow-700 before:bg-gradient-to-r',
        dynamicUnorderedListStyles({ depth })
      )}
    >
      {buildTree.map((item, index) => {
        if (item.depth && item.depth > depth) {
          return null
        }
        const uuid = uuidv4()
        return (
          <li
            key={`${item.id}-${uuid}-build-tree`}
            className={cx(
              'relative flex flex-row items-center justify-center space-x-6 drop-shadow before:bg-yellow-700 after:bg-yellow-700',
              dynamicListItemStyles({
                depth,
                buildTree,
                filteredBuildTree,
                filteredChildren,
              })
            )}
          >
            <BuildTreeItem
              item={item}
              items={items}
              index={index}
              depth={depth}
              baseItem={baseItem}
              setTriggerSelection={setTriggerSelection}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          </li>
        )
      })}
    </ul>
  )
}
