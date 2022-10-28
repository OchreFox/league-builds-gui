import Image from 'next/image'

import { css, cx } from '@emotion/css'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { ItemBuildTreeProps } from '../types/FilterProps'
import { ItemsSchema } from '../types/Items'
import { CustomLoader } from '../utils/CustomLoader'
import { dynamicListItemStyles, dynamicUnorderedListStyles } from './ItemBuildTreeComponents'
import { getActiveChampionClass, getPluralFromItems, isFromChampionClass } from './ItemGrid/ItemGridComponents'
import { useItems } from './hooks/useItems'
import { selectItemPicker, setItemPickerSelectedItem } from './store/appSlice'
import { useAppDispatch } from './store/store'

export const ItemBuildTree = ({ itemRefArray, itemGridRef, classFilters, setClassFilters }: ItemBuildTreeProps) => {
  const dispatch = useAppDispatch()
  const { selectedItem } = useSelector(selectItemPicker)

  const { items } = useItems()
  const [triggerSelection, setTriggerSelection] = useState<number | null>()

  function scrollIntoItem(item: ItemsSchema) {
    const itemIndex = _.findIndex(itemRefArray.current, (x) => x.itemId === item.id)
    if (itemIndex > -1) {
      const itemRef = itemRefArray.current[itemIndex].ref.current
      if (itemRef && itemGridRef.current) {
        // Scroll to item in itemGridRef
        itemGridRef.current.scrollTo({
          top: itemRef.offsetTop - 100,
          behavior: 'smooth',
        })
      }
    }
  }

  const handleClick = () => {
    // Create a temporary array that is a clone of the filterItems array
    const tempArray = [...classFilters]
    // Set isActive to false for all items
    tempArray.forEach((item) => {
      item.isActive = false
    })
    // Set the first item to active
    tempArray[0].isActive = true
    setClassFilters(tempArray)
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
    baseItem,
    buildTree,
    depth,
  }: {
    baseItem: ItemsSchema
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
    const filteredChildren = buildTree.filter((item) => item.depth && item.depth > depth)

    return (
      <ul
        className={cx(
          'relative flex flex-col items-start justify-center space-y-8 from-yellow-600 to-yellow-700 before:bg-gradient-to-r',
          dynamicUnorderedListStyles({ depth })
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
                dynamicListItemStyles({
                  depth,
                  buildTree,
                  filteredBuildTree,
                  filteredChildren,
                })
              )}
            >
              <ItemBuildTreeItem item={item} index={index} depth={depth} baseItem={baseItem} />
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
    baseItem,
  }: {
    item: ItemsSchema
    index: number
    depth: number
    baseItem: ItemsSchema
  }) => {
    if (!items) {
      return null
    }
    return (
      <div
        key={index}
        className="-m-1 flex cursor-pointer items-center px-2 py-2 text-center"
        onClick={(e) => {
          console.log('clicked', item.name, baseItem.id)
          setTriggerSelection(baseItem.id)
          dispatch(setItemPickerSelectedItem(item))
          scrollIntoItem(item)
          e.stopPropagation()
        }}
      >
        <div
          className={cx(
            'group mt-6 flex flex-col items-center justify-center',
            item.from && item.from.length > 0 && 'mr-10'
          )}
        >
          <div className="h-10 w-10 border border-black object-cover ring-1 ring-yellow-700">
            <Image
              key={item.id + '-' + item.name + '-' + index}
              src={item.icon ?? ''}
              alt={item.name ?? ''}
              loader={CustomLoader}
              width={50}
              height={50}
            />
          </div>

          <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
        </div>
        {item.from && item.from.length > 0 && (
          <ItemBuildTreeItems buildTree={getItemBuildTree(item)} depth={depth + 1} baseItem={baseItem} />
        )}
      </div>
    )
  }

  const GetItemTree = ({ baseItem }: { baseItem: ItemsSchema }): JSX.Element | null => {
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
        <ItemBuildTreeItems buildTree={itemBuildTree} depth={0} baseItem={baseItem} />
      </div>
    )
  }

  const GetItemBuilds = ({ baseItem }: { baseItem: ItemsSchema }) => {
    if (!items || !baseItem || !baseItem.into) {
      return null
    }

    let itemBuilds: ItemsSchema[] = []
    baseItem.into.forEach((itemId) => {
      const item = Object.values(items).find((x) => x.id === itemId && x.inStore && x.tier > 0)
      if (item) {
        itemBuilds.push(item)
      }
    })
    if (itemBuilds.length === 0) {
      return null
    }
    const activeChampionClass = getActiveChampionClass(classFilters)
    let filteredItemBuilds = itemBuilds.filter((x) => {
      return isFromChampionClass(x, activeChampionClass)
    })
    const delta = itemBuilds.length - filteredItemBuilds.length
    // Sort the item builds by gold cost
    filteredItemBuilds = _.orderBy(filteredItemBuilds, ['gold.total'], ['asc'])

    // Return a list of items in the baseItem.ItemsSchema array
    return (
      <>
        <p className={cx('mt-4 text-sm text-gray-400', delta === 0 && 'mb-4')}>
          Builds into
          <b className="text-gray-200">
            {' '}
            {filteredItemBuilds.length} {getPluralFromItems(filteredItemBuilds)}
          </b>
        </p>
        {delta > 0 && (
          <p className="mb-4 cursor-pointer text-xs italic text-cyan-400 hover:underline" onClick={handleClick}>
            <b className="text-cyan-200"> {delta} </b>
            <span>more {getPluralFromItems(delta)} hidden by champion class filters</span>
          </p>
        )}
        <div className="grid grid-cols-5 gap-2">
          {filteredItemBuilds.map((item, index) => {
            if (!item) {
              return null
            }
            return (
              <div
                key={index}
                className={cx(
                  'group -m-1 flex cursor-pointer flex-col items-center bg-gray-900 p-2 text-center',
                  triggerSelection === item.id && 'border-2 border-dashed border-yellow-500/75'
                )}
                onClick={() => {
                  dispatch(setItemPickerSelectedItem(item))
                  // Find the item in itemRefArray and scroll to it
                  // Get index
                  scrollIntoItem(item)
                }}
              >
                <div className="h-10 w-10 border border-black object-cover ring-1 ring-yellow-700 duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125">
                  <Image
                    loader={CustomLoader}
                    key={'into-' + item.id + '-' + item.name}
                    src={item.icon ?? ''}
                    alt={item.name ?? ''}
                    width={50}
                    height={50}
                  />
                </div>
                <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem)
    } else {
      setTriggerSelection(null)
    }
  }, [selectedItem])

  if (!items) {
    return null
  }

  if (selectedItem) {
    return (
      items && (
        <>
          <h3 className="font-body text-lg font-semibold text-gray-200">BUILD PATH</h3>
          <GetItemBuilds baseItem={selectedItem} />
          <div className="flex h-full w-full flex-col items-center justify-center">
            <GetItemTree baseItem={selectedItem} />
          </div>
        </>
      )
    )
  } else {
    return (
      <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center">
        <img src="icons/poro_sleeping.png" alt="Poro sleeping" className="mx-auto h-32 w-32 opacity-75" />
        <p className="italic text-gray-500">Select an item to see its build path tree</p>
      </div>
    )
  }
}
