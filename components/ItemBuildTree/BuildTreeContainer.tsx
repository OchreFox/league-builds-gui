import { useItems } from '@/hooks/useItems'
import { selectItemFilters, selectItemPicker, setItemFiltersRarity } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ItemBuildTreeProps, Rarity } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { easeOutExpo } from 'components/ItemBuild/BuildMakerComponents'
import styles from 'components/ItemFilters/FilterRarity.module.scss'

import { getRarity, isBasic, isEpic, isLegendary, isMythic } from 'utils/ItemRarity'
import { easeInOutExpo } from 'utils/Transition'

import { itemSectionConstants } from '../ItemGrid/ItemGridComponents'
import { BuildSuggestions } from './BuildSuggestions'
import { BuildTreeRoot } from './BuildTreeRoot'

const itemNameVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
    transition: {
      ...easeInOutExpo,
      duration: 0.4,
    },
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      ...easeInOutExpo,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      ...easeOutExpo,
      duration: 0.5,
    },
  },
}

export const BuildTreeContainer = ({ itemRefArray, itemGridRef }: ItemBuildTreeProps) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { selectedItem } = useSelector(selectItemPicker)
  const itemFilters = useSelector(selectItemFilters)
  const [selectedItemRarity, setSelectedItemRarity] = useState<Rarity>(Rarity.Empty)

  const { items } = useItems()
  const [triggerSelection, setTriggerSelection] = useState<number | null>()
  const [itemTitleQueue, setItemTitleQueue] = useState<string[]>([])

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

  const handleRarityClick = useCallback(
    (
      e:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | React.KeyboardEvent<HTMLAnchorElement>
        | React.TouchEvent<HTMLAnchorElement>
    ) => {
      e.preventDefault()
      if (itemFilters.rarity !== selectedItemRarity) {
        dispatch(setItemFiltersRarity(selectedItemRarity))
      } else {
        dispatch(setItemFiltersRarity(Rarity.Empty))
      }
    },
    [dispatch, itemFilters.rarity, selectedItemRarity]
  )

  useEffect(() => {
    if (selectedItem) {
      setSelectedItemRarity(getRarity(selectedItem))
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
          <div className="mb-2 flex items-center space-x-4 border-b border-yellow-900 py-1">
            <h3 className="shrink-0 border-r border-yellow-900 pr-2 font-body font-semibold text-gray-200">ITEM</h3>
            <button
              className={cx(
                'group relative inline-flex flex-row items-center justify-center bg-transparent py-1 px-2 text-sm font-medium text-white hover:bg-cyan-900 hover:text-white',
                styles.filterButtonActive,
                styles.all
              )}
            >
              Build Path
              <motion.div
                layoutId="item-details-border"
                className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
              />
            </button>
            <button
              disabled
              className="group relative inline-flex cursor-help flex-row items-center justify-center bg-transparent py-1 px-2 text-sm font-medium text-gray-600"
              title="Coming soon!"
            >
              Description
              <motion.div
                layoutId="item-details-border"
                className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
              />
            </button>
          </div>
          {potatoMode ? (
            <h3 className="text-lg font-bold text-white">{selectedItem.name}</h3>
          ) : (
            <>
              <div className="relative inline-flex w-full shrink-0 text-clip">
                <AnimatePresence>
                  {itemTitleQueue.length > 0 &&
                    itemTitleQueue.map((title) => {
                      return (
                        <motion.h3
                          key={title + '-build-path'}
                          className="absolute top-0 left-0 text-lg font-bold text-white"
                          variants={itemNameVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                        >
                          {title}
                        </motion.h3>
                      )
                    })}
                </AnimatePresence>
              </div>
              <p className="select-none text-lg font-bold text-transparent">{selectedItem.name}</p>
            </>
          )}

          <a
            href="/"
            className={cx('text-sm underline', itemSectionConstants[selectedItemRarity].textColor)}
            onClick={handleRarityClick}
          >
            {selectedItemRarity} item
          </a>
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
        <img src="icons/poro_sleeping.webp" alt="Poro sleeping" className="mx-auto h-16 w-auto opacity-75 md:h-32" />
        <p className="italic text-gray-500">Select an item to see its build path tree</p>
      </div>
    )
  }
}
