import { JSX, RefObject } from 'react'

import { css } from '@emotion/css'
import { ItemRefArrayType } from '@/types/FilterProps'
import { ItemsSchema } from '@/types/Items'

import { BuildTreeItems } from '@/components/ItemBuildTree/BuidTreeItems'
import { getItemBuildTree } from '@/components/ItemBuildTree/BuildTreeComponents'

export const BuildTreeRoot = ({
  items,
  baseItem,
  setTriggerSelection,
  itemRefArray,
  itemGridRef,
}: {
  items: ItemsSchema[]
  baseItem: ItemsSchema
  setTriggerSelection: React.Dispatch<React.SetStateAction<number | null | undefined>>
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}): JSX.Element | null => {
  if (!items || !baseItem) {
    return null
  }
  const itemBuildTree = getItemBuildTree(baseItem, items)
  // Push base item to the build tree
  itemBuildTree.push({ ...baseItem, depth: 0, instance: 0 })

  if (itemBuildTree.length === 0) {
    return null
  }

  // Render the item build tree as an unordered list nested on each depth level
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
      `}
    >
      <BuildTreeItems
        items={items}
        buildTree={itemBuildTree}
        depth={0}
        baseItem={baseItem}
        setTriggerSelection={setTriggerSelection}
        itemRefArray={itemRefArray}
        itemGridRef={itemGridRef}
      />
    </div>
  )
}
