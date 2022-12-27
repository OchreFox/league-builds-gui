import { useItems } from '@/hooks/useItems'
import { selectItemPicker } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { AnimatePresence, motion } from 'framer-motion'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ItemBuildTreeProps, Rarity } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { easeOutExpo } from 'components/ItemBuild/BuildMakerComponents'
import styles from 'components/ItemFilters/FilterRarity.module.scss'

import { isBasic, isEpic, isLegendary, isMythic } from 'utils/ItemRarity'

import { itemSectionConstants } from '../ItemGrid/ItemGridComponents'
import { BuildSuggestions } from './BuildSuggestions'
import { BuildTreeRoot } from './BuildTreeRoot'

export const BuildTreeContainer = ({ itemRefArray, itemGridRef }: ItemBuildTreeProps) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { selectedItem } = useSelector(selectItemPicker)
  const [selectedItemRarity, setSelectedItemRarity] = useState<Rarity>(Rarity.Empty)

  const { items } = useItems()
  const [triggerSelection, setTriggerSelection] = useState<number | null>()
  const [itemTitleQueue, setItemTitleQueue] = useState<string[]>([])

  function scrollIntoItem(item: ItemsSchema) {
    const itemIndex = _.findIndex(itemRefArray.current, (x) => x.itemId === item.id)
    if (itemIndex > -1) {
      // console.log('Scrolling to item ' + item.name + ' at index ', itemIndex)
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

  const getItemRarity = useCallback(
    (item: ItemsSchema) => {
      if (isBasic(item)) {
        return Rarity.Basic
      }
      if (isEpic(item)) {
        return Rarity.Epic
      }
      if (isLegendary(item)) {
        return Rarity.Legendary
      }
      if (isMythic(item)) {
        return Rarity.Mythic
      }
      return Rarity.Empty
    },
    [selectedItem]
  )

  const pushItemTitleQueue = useCallback(
    (item: ItemsSchema) => {
      if (itemTitleQueue.length > 0) {
        setItemTitleQueue((prev) => [...prev, item.name])
      } else {
        setItemTitleQueue([item.name])
      }
    },
    [itemTitleQueue]
  )

  useEffect(() => {
    if (selectedItem) {
      setSelectedItemRarity(getItemRarity(selectedItem))
      // Add the selected item to the queue if it's not already in there
      if (!itemTitleQueue.includes(selectedItem.name)) {
        pushItemTitleQueue(selectedItem)
      }
    } else {
      setTriggerSelection(null)
    }
  }, [selectedItem])

  useEffect(() => {
    if (!potatoMode && itemTitleQueue.length > 1) {
      // Remove the first item from the queue
      const newQueue = [...itemTitleQueue]
      newQueue.shift()
      setItemTitleQueue(newQueue)
    }
  }, [potatoMode, itemTitleQueue])

  if (!items) {
    return null
  }

  if (selectedItem) {
    return (
      items && (
        <>
          <div className="flex py-1 mb-2 border-b border-yellow-900 items-center space-x-4">
            <h3 className="font-body font-semibold text-gray-200 shrink-0 border-r border-yellow-900 pr-2">ITEM</h3>
            <button
              className={cx(
                'group inline-flex flex-row items-center justify-center py-1 px-2 text-sm font-medium relative bg-transparent text-white hover:bg-cyan-900 hover:text-white',
                styles.filterButtonActive,
                styles.all
              )}
            >
              Build Path
              <motion.div
                layoutId="item-details-border"
                className="bg-brand-default w-full h-0.5 inset-x-0 bottom-0 absolute"
              />
            </button>
            <button
              disabled
              className="group inline-flex flex-row items-center justify-center py-1 px-2 text-sm font-medium relative bg-transparent text-gray-600 cursor-help"
              title="Coming soon!"
            >
              Description
              <motion.div
                layoutId="item-details-border"
                className="bg-brand-default w-full h-0.5 inset-x-0 bottom-0 absolute"
              />
            </button>
          </div>
          {potatoMode ? (
            <h3 className="font-bold text-lg text-white">{selectedItem.name}</h3>
          ) : (
            <>
              <div className="w-full text-clip inline-flex shrink-0 relative">
                <AnimatePresence>
                  {itemTitleQueue.length > 0 &&
                    itemTitleQueue.map((title) => {
                      return (
                        <motion.h3
                          key={title + '-build-path'}
                          className="font-bold text-lg absolute top-0 left-0 text-white"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{
                            ...easeOutExpo,
                            duration: 0.5,
                          }}
                        >
                          {title}
                        </motion.h3>
                      )
                    })}
                </AnimatePresence>
              </div>
              <p className="font-bold text-lg text-transparent select-none">{selectedItem.name}</p>
            </>
          )}

          <h4 className={cx('text-sm', itemSectionConstants[selectedItemRarity].textColor)}>
            {selectedItemRarity} item
          </h4>
          <BuildSuggestions
            items={items}
            baseItem={selectedItem}
            triggerSelection={triggerSelection}
            itemRefArray={itemRefArray}
            itemGridRef={itemGridRef}
          />
          <div className="flex h-full w-full flex-col items-center justify-center">
            <BuildTreeRoot
              baseItem={selectedItem}
              items={items}
              setTriggerSelection={setTriggerSelection}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          </div>
        </>
      )
    )
  } else {
    return (
      <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center">
        <img src="icons/poro_sleeping.png" alt="Poro sleeping" className="mx-auto h-32 w-auto opacity-75" />
        <p className="italic text-gray-500">Select an item to see its build path tree</p>
      </div>
    )
  }
}
