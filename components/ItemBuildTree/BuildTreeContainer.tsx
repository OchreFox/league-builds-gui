import Image from 'next/image'
import Link from 'next/link'

import React, { useCallback, useEffect, useState } from 'react'

import { cx } from '@emotion/css'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import _ from 'lodash'
import { useSelector } from 'react-redux'

import { easeOutExpo } from '@/components/ItemBuild/BuildMakerComponents'
import { BuildSuggestions } from '@/components/ItemBuildTree/BuildSuggestions'
import { BuildTreeRoot } from '@/components/ItemBuildTree/BuildTreeRoot'
import styles from '@/components/ItemFilters/FilterRarity.module.scss'
import { itemSectionConstants } from '@/components/ItemGrid/ItemGridComponents'
import { useItems } from '@/hooks/useItems'
import { selectItemFilters, selectItemPicker, setItemFiltersRarity } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { ItemBuildTreeProps, Rarity } from '@/types/FilterProps'
import { ItemsSchema } from '@/types/Items'
import CustomLoader from '@/utils/CustomLoader'
import { getRarity } from '@/utils/ItemRarity'
import { easeInOutExpo } from '@/utils/Transition'

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

const navVariants: Variants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      ...easeInOutExpo,
      duration: 0.5,
      staggerChildren: 0.05,
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
  }, [itemTitleQueue, pushItemTitleQueue, selectedItem])

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
          <motion.nav
            className="mb-2 flex items-center space-x-4 border-b border-yellow-900 py-1"
            variants={navVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h3
              className="shrink-0 border-r border-yellow-900 pr-2 font-body font-semibold text-gray-200"
              variants={navVariants}
            >
              ITEM
            </motion.h3>
            <motion.button
              className={cx(
                'group relative inline-flex flex-row items-center justify-center bg-transparent px-2 py-1 text-sm font-medium text-white hover:bg-cyan-900 hover:text-white',
                styles.filterButtonActive,
                styles.all
              )}
              variants={navVariants}
            >
              Build Path
              <motion.div
                layoutId="item-details-border"
                className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
              />
            </motion.button>
            <motion.button
              disabled
              className="group relative inline-flex cursor-help flex-row items-center justify-center bg-transparent px-2 py-1 text-sm font-medium text-gray-600"
              title="Coming soon!"
              variants={navVariants}
            >
              Description
              <motion.div
                layoutId="item-details-border"
                className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
              />
            </motion.button>
          </motion.nav>
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
                          className="absolute left-0 top-0 text-lg font-bold text-white"
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

          <Link
            href="#"
            className={cx('text-sm underline', itemSectionConstants[selectedItemRarity].textColor)}
            onClick={handleRarityClick}
          >
            {selectedItemRarity} item
          </Link>
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
        <Image
          loader={CustomLoader}
          src="data/league-builds/icons/poro_sleeping.webp"
          alt="Poro sleeping"
          width={128}
          height={128}
          className="mx-auto h-16 w-auto opacity-75 md:h-32"
        />
        <p className="italic text-gray-500">Select an item to see its build path tree</p>
      </div>
    )
  }
}
