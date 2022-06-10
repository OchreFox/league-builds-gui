import React, { useEffect } from 'react'
import { css, cx } from '@emotion/css'
import { ItemsSchema } from '../types/Items'
import { useItems } from './hooks/useItems'

export const ItemBuildTree = ({
  selectedItem,
}: {
  selectedItem: ItemsSchema | null
}) => {
  const { items } = useItems()

  // Function to return the max depth of a tree
  const getMaxDepth = (itemsArray: ItemsSchema[]) => {
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

  // Get recursive list of items from a base item
  // Search in item.from array
  const getItemBuildTree = (
    item: ItemsSchema,
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
        getItemBuildTree(fromItem, depth + 1, buildTree, order)
      })
    }
    return buildTree
  }

  // Recursive component to render item build tree as a nested list of items with depth
  const ItemBuildTreeItems = ({
    buildTree,
    depth,
  }: {
    buildTree: ItemsSchema[]
    depth: number
  }) => {
    if (depth > 5) {
      return null
    }
    if (!buildTree || buildTree.length === 0) {
      return null
    }
    const filteredBuildTree = buildTree.filter((item) => item.depth === depth)
    const filteredChildren = buildTree.filter(
      (item) => item.depth && item.depth > depth
    )

    return (
      <ul
        className={cx(
          'relative flex flex-col items-start justify-center space-y-8 from-yellow-600 to-yellow-700 before:bg-gradient-to-r',
          depth > 0 &&
            css`
              &:before {
                content: '';
                position: absolute;
                top: 50%;
                left: -2.5rem;
                width: 1.1rem;
                height: 2px;
                filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))
                  drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
              }
            `
        )}
      >
        {buildTree.map((item, index) => {
          if (item.depth && item.depth > depth) {
            return null
          }
          return (
            <li
              key={item.id + '-' + index + 'build-tree'}
              className={cx(
                'relative flex flex-row items-center justify-center space-x-6 drop-shadow before:bg-yellow-700 after:bg-yellow-700',
                // Any item except the base item
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
                        height: 80%;
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
                        top: 4px;
                        transform: translateY(-50%);
                        height: 90%;
                      }
                    }
                  `,
                // First level with 2 or less items and less than 3 children
                depth === 1 &&
                  filteredBuildTree.length <= 2 &&
                  filteredChildren.length < 3 &&
                  css`
                    &:first-of-type {
                      &:after {
                        transform: translateY(50%);
                        height: 90%;
                      }
                    }
                    &:last-of-type {
                      &:after {
                        transform: translateY(-50%);
                        height: 90%;
                      }
                    }
                  `,
                // First level with 2 or less items and more than 3 children
                depth === 1 &&
                  filteredBuildTree.length <= 2 &&
                  filteredChildren.length >= 3 &&
                  css`
                    &:first-of-type {
                      &:after {
                        transform: translateY(50%);
                        height: 75%;
                      }
                    }
                    &:last-of-type {
                      &:after {
                        transform: translateY(-50%);
                        height: 90%;
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
              )}
            >
              <ItemBuildTreeItem item={item} index={index} depth={depth} />
            </li>
          )
        })}
      </ul>
    )
  }

  const ItemBuildTreeItem = ({
    item,
    index,
    depth,
  }: {
    item: ItemsSchema
    index: number
    depth: number
  }) => {
    if (!items) {
      return null
    }
    return (
      <>
        <img
          key={item.id + '-' + item.name + '-' + index}
          src={item.icon ?? ''}
          alt={item.name ?? ''}
          className="mr-4 h-10 w-10 border border-black object-cover ring-1 ring-yellow-700"
          width={40}
          height={40}
        />
        {item.from && item.from.length > 0 && (
          <ItemBuildTreeItems
            buildTree={getItemBuildTree(item)}
            depth={depth + 1}
          />
        )}
      </>
    )
  }

  const GetItems = ({
    baseItem,
  }: {
    baseItem: ItemsSchema
  }): JSX.Element | null => {
    if (!items || !baseItem) {
      return null
    }
    const itemBuildTree = getItemBuildTree(baseItem)
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
        <h3 className="mb-4">{baseItem.name}</h3>
        <ItemBuildTreeItems buildTree={itemBuildTree} depth={0} />
      </div>
    )
  }

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem)
    }
  }, [selectedItem])

  if (!selectedItem) {
    return (
      <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center">
        <img
          src="icons/poro_sleeping.png"
          alt="Poro sleeping"
          className="mx-auto h-32 w-32 opacity-75"
        />
        <p className="italic text-gray-500">
          Select an item to see its build path tree
        </p>
      </div>
    )
  } else {
    return (
      items && (
        <>
          <h3 className="font-body text-lg font-semibold text-gray-200">
            BUILD PATH
          </h3>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <GetItems baseItem={selectedItem} />
          </div>
        </>
      )
    )
  }
}
