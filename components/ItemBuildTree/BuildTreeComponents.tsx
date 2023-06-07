import { css, cx } from '@emotion/css'
import _ from 'lodash'
import { RefObject } from 'react'
import { ItemRefArrayType } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

export type UnorderedListProps = {
  depth: number
}

export type ListItemProps = {
  depth: number
  buildTree: ItemsSchema[]
  filteredBuildTree: ItemsSchema[]
  filteredChildren: ItemsSchema[]
  className?: string
}

export function scrollIntoItem(
  item: ItemsSchema,
  itemRefArray: ItemRefArrayType,
  itemGridRef: RefObject<HTMLDivElement>
) {
  // Replace lodash with native findIndex
  const itemIndex = itemRefArray.current.findIndex((x) => x.itemId === item.id)
  if (itemIndex > -1) {
    // console.log('Scrolling to item ' + item.name + ' at index ', itemIndex)
    const itemRef = itemRefArray.current[itemIndex].ref.current
    if (itemRef && itemGridRef.current) {
      // Check if item is already visible
      const itemRect = itemRef.getBoundingClientRect()
      const itemGridRect = itemGridRef.current.getBoundingClientRect()
      if (itemRect.top < itemGridRect.top || itemRect.bottom > itemGridRect.bottom) {
        // Scroll to item in itemGridRef
        itemGridRef.current.scrollTo({
          top: itemRef.offsetTop - 50,
          behavior: 'smooth',
        })
      }
    }
  }
}

// Get recursive list of items from a base item
// Search in item.from array
export const getItemBuildTree = (
  item: ItemsSchema,
  items: ItemsSchema[],
  depth: number = 1,
  buildTree: ItemsSchema[] = [],
  order: number = 1
): ItemsSchema[] => {
  if (depth > 5) {
    return buildTree
  }
  if (!items) {
    return []
  }
  if (item.from) {
    item.from.forEach((fromItemId) => {
      const fromItem = Object.values(items).find((x) => x.id === fromItemId)
      if (!fromItem) {
        return
      }
      buildTree.push({ ...fromItem, depth, instance: order++ })
      getItemBuildTree(fromItem, items, depth + 1, buildTree, order)
    })
  }
  return buildTree
}

// Function to return the max depth of a tree
export const getMaxDepth = (itemsArray: ItemsSchema[]) => {
  if (!itemsArray || itemsArray.length === 0) {
    return 0
  }
  let maxDepth = 0
  itemsArray.forEach((item) => {
    if (item.depth && item.depth > maxDepth) {
      maxDepth = item.depth
    }
  })
  return maxDepth
}

export const dynamicUnorderedListStyles = ({ depth }: UnorderedListProps) => {
  if (depth > 0) {
    return css`
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: -2.5rem;
        width: 1.1rem;
        height: 2px;
        filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
      }
    `
  }
  return ''
}

export const dynamicListItemStyles = ({ depth, buildTree, filteredBuildTree, filteredChildren }: ListItemProps) => {
  return cx(
    depth > 0 &&
      css`
        &:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0%;
          transform: translate(-100%, 0);
          width: 1.5rem;
          height: 2px;
          z-index: -1;
        }
      `,
    // Any item except the base item and with more than one child
    depth > 0 &&
      buildTree.length > 1 &&
      css`
        &:after {
          content: '';
          position: absolute;
          left: -1.5rem;
          width: 2px;
          height: 160%;
        }
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 100%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 100%;
          }
        }
      `,
    // More than one sibling on a same level but less than 2 children
    depth > 0 &&
      filteredBuildTree.length > 1 &&
      getMaxDepth(buildTree) < 2 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 100%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 100%;
          }
        }
      `,
    // Two siblings on a same level but less than 3 children
    // Ex: Long Sword + Long Sword
    depth > 0 &&
      buildTree.length > 1 &&
      buildTree.length < 3 &&
      getMaxDepth(buildTree) < 3 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 100%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 90%;
          }
        }
      `,
    // First level with 2 or less items and less than 3 children
    // Ex: Shadowflame, Lord Dominik's Regards, Hullbreaker, ...
    depth === 1 &&
      filteredBuildTree.length <= 2 &&
      filteredChildren.length < 3 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 80%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 60%;
          }
        }
      `,
    // First level with 2 or less items and more than 3 children
    // Ex: Mortal Reminder, Serylda's Grudge, Banshee's Veil, Luden's Tempest, Liandry's Anguish,...
    depth === 1 &&
      filteredBuildTree.length <= 2 &&
      filteredChildren.length >= 3 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 70%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 80%;
          }
        }
      `,
    // First level with more than 2 items and one child
    depth === 1 &&
      filteredBuildTree.length > 2 &&
      filteredChildren.length <= 1 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 100%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 100%;
          }
        }
      `,
    // First level with more than 2 items and more than one child
    depth === 1 &&
      filteredBuildTree.length > 2 &&
      filteredChildren.length > 1 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 110%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 100%;
          }
        }
      `,
    // First level with more than 2 items with more than 1 child and les or equal than 3 children
    depth === 1 &&
      filteredBuildTree.length > 2 &&
      filteredChildren.length > 1 &&
      filteredChildren.length <= 3 &&
      css`
        &:first-of-type {
          &:after {
            transform: translateY(50%);
            height: 100%;
          }
        }
        &:last-of-type {
          &:after {
            transform: translateY(-50%);
            height: 100%;
          }
        }
      `,
    // First level with more than 2 items and more than 3 children in total
    depth === 1 &&
      filteredBuildTree.length > 2 &&
      filteredChildren.length > 3 &&
      css`
        &:after {
          content: '';
          position: absolute;
          left: -1.5rem;
          width: 2px;
          height: 140%;
        }
      `
  )
}
