import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { css, cx } from '@emotion/css'
import { AnimatePresence, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import _ from 'lodash'
import React, { Fragment, createRef, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { ItemGridProps, Rarity } from '../types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from '../types/Items'
import { isBasic, isEpic, isLegendary, isMythic } from '../utils/ItemRarity'
import { ItemContainer } from './ItemContainer'
import {
  getActiveCategories,
  getActiveChampionClass,
  getPluralFromItems,
  includesCategory,
  isFromChampionClass,
  isInStore,
  markItemsAsVisible,
  matchesSearchQuery,
} from './ItemGridComponents'
import { RarityTitle } from './RarityTitle'
import { useItems } from './hooks/useItems'

export default function ItemGrid({
  goldOrderDirection,
  rarityFilter,
  setRarityFilter,
  typeFilters,
  classFilters,
  searchFilter,
  setAutocompleteResults,
  selectedItem,
  setSelectedItem,
  itemRefArray,
  itemGridRef,
}: ItemGridProps) {
  // Fetch items from custom JSON
  const { items, itemsError } = useItems()
  // Basic items state
  const [basicItems, setBasicItems] = useState<Array<ItemsSchema>>([])
  const [basicItemsCount, setBasicItemsCount] = useState(0)
  // Epic items state
  const [epicItems, setEpicItems] = useState<Array<ItemsSchema>>([])
  const [epicItemsCount, setEpicItemsCount] = useState(0)
  // Legendary items state
  const [legendaryItems, setLegendaryItems] = useState<Array<ItemsSchema>>([])
  const [legendaryItemsCount, setLegendaryItemsCount] = useState(0)
  // Mythic items state
  const [mythicItems, setMythicItems] = useState<Array<ItemsSchema>>([])
  const [mythicItemsCount, setMythicItemsCount] = useState(0)
  // Data initialization flag
  const [dataInitialized, setDataInitialized] = useState(false)
  // Current hovered item
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Previous refs
  const previousValues = useRef({
    goldOrderDirection,
    rarityFilter,
    typeFilters,
    classFilters,
    searchFilter,
  })

  if (itemsError) {
    console.error(itemsError.message)
  }

  /**
   * Initializes items: takes an object of all the items, sorts them by type, and then sets the state of each type of item.
   */
  function initializeItems() {
    // Only run the function if the items are present
    if (!items) return

    // Create temporary arrays for each item type
    let tempBasicItems: Array<ItemsSchema> = []
    let tempEpicItems: Array<ItemsSchema> = []
    let tempLegendaryItems: Array<ItemsSchema> = []
    let tempMythicItems: Array<ItemsSchema> = []
    // Sort items by type
    let itemsArray = Object.values(items)
    for (let item of itemsArray) {
      // Set item as visible by default
      item.visible = true
      // Sort item by rarity
      if (isBasic(item)) {
        tempBasicItems.push(item)
      } else if (isEpic(item)) {
        tempEpicItems.push(item)
      } else if (isLegendary(item)) {
        tempLegendaryItems.push(item)
      } else if (isMythic(item)) {
        tempMythicItems.push(item)
      }
    }

    // Order temp arrays with the type of goldOrderDirection
    tempBasicItems = _.orderBy(tempBasicItems, ['gold.total'], ['asc'])
    tempEpicItems = _.orderBy(tempEpicItems, ['gold.total'], ['asc'])
    tempLegendaryItems = _.orderBy(tempLegendaryItems, ['gold.total'], ['asc'])
    tempMythicItems = _.orderBy(tempMythicItems, ['gold.total'], ['asc'])
    setBasicItems(tempBasicItems)
    setEpicItems(tempEpicItems)
    setLegendaryItems(tempLegendaryItems)
    setMythicItems(tempMythicItems)

    // Set the count of each rarity
    setBasicItemsCount(tempBasicItems.length)
    setEpicItemsCount(tempEpicItems.length)
    setLegendaryItemsCount(tempLegendaryItems.length)
    setMythicItemsCount(tempMythicItems.length)

    // Initialize itemRefArray
    let totalItemsAmount =
      tempBasicItems.length + tempEpicItems.length + tempLegendaryItems.length + tempMythicItems.length
    for (let i = 0; i < totalItemsAmount; i++) {
      // Set a temporal item id to read the id of the element i in the arrays tempBasicItems, tempEpicItems, etc.
      let tempItemId = -1
      if (i < tempBasicItems.length) {
        tempItemId = tempBasicItems[i].id
      } else if (i < tempBasicItems.length + tempEpicItems.length) {
        tempItemId = tempEpicItems[i - tempBasicItems.length].id
      } else if (i < tempBasicItems.length + tempEpicItems.length + tempLegendaryItems.length) {
        tempItemId = tempLegendaryItems[i - tempBasicItems.length - tempEpicItems.length].id
      } else {
        tempItemId = tempMythicItems[i - tempBasicItems.length - tempEpicItems.length - tempLegendaryItems.length].id
      }

      itemRefArray.current.push({
        itemId: tempItemId,
        ref: createRef(),
      })
    }
  }

  /**
   * Updates the items state when the filters change.
   */
  function reduceItems(categories: Array<Category[]>, championClass: ChampionClass) {
    if (!items) {
      console.error('No items array provided to reduceItems')
      return
    }
    // Create an array of filter methods to filter the items
    let filterMethods: Array<Function> = [
      (item: ItemsSchema) => includesCategory(item, categories),
      (item: ItemsSchema) => isFromChampionClass(item, championClass),
      (item: ItemsSchema) => matchesSearchQuery(item, searchFilter),
      (item: ItemsSchema) => isInStore(item),
    ]

    let filteredItems = Object.values(items).filter((item) => {
      // If any filter method returns false, the item is filtered out
      return filterMethods.every((method) => method(item))
    })

    let { visibleItems: basicVisibleItems, count: basicCount } = markItemsAsVisible(
      basicItems,
      filteredItems,
      goldOrderDirection
    )
    let { visibleItems: epicVisibleItems, count: epicCount } = markItemsAsVisible(
      epicItems,
      filteredItems,
      goldOrderDirection
    )
    let { visibleItems: legendaryVisibleItems, count: legendaryCount } = markItemsAsVisible(
      legendaryItems,
      filteredItems,
      goldOrderDirection
    )
    let { visibleItems: mythicVisibleItems, count: mythicCount } = markItemsAsVisible(
      mythicItems,
      filteredItems,
      goldOrderDirection
    )

    setBasicItems(basicVisibleItems)
    setEpicItems(epicVisibleItems)
    setLegendaryItems(legendaryVisibleItems)
    setMythicItems(mythicVisibleItems)

    setBasicItemsCount(basicCount)
    setEpicItemsCount(epicCount)
    setLegendaryItemsCount(legendaryCount)
    setMythicItemsCount(mythicCount)

    // Check if the searchFilter has changed
    if (previousValues.current.searchFilter !== searchFilter) {
      // Return fuzzy search results
      let fuzzySearchResults = fuzzysort.go(searchFilter, filteredItems, {
        limit: 10,
        keys: ['name', 'nicknames'],
      })
      setAutocompleteResults(fuzzySearchResults)
    }
  }

  useEffect(() => {
    // Data initialization
    if (items && !dataInitialized) {
      setDataInitialized(true)
      console.log('Initializing data...')
      initializeItems()
    }
    // Data filters
    if (dataInitialized && items) {
      // Return if no changes were made to the filters
      if (
        previousValues.current.goldOrderDirection === goldOrderDirection &&
        previousValues.current.typeFilters === typeFilters &&
        previousValues.current.classFilters === classFilters &&
        previousValues.current.searchFilter === searchFilter
      )
        return
      else {
        // Reduce items
        const activeCategories = getActiveCategories(typeFilters)
        const activeChampionClass = getActiveChampionClass(classFilters)

        reduceItems(activeCategories, activeChampionClass)

        // Set previous values
        previousValues.current.goldOrderDirection = goldOrderDirection
        previousValues.current.typeFilters = typeFilters
        previousValues.current.classFilters = classFilters
        previousValues.current.searchFilter = searchFilter
      }
    }
  }, [items, goldOrderDirection, rarityFilter, typeFilters, classFilters, searchFilter])

  const gridContainerVariants = {
    enter: {
      opacity: 0,
      y: 20,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  }

  const titleVariants = {
    enter: {
      opacity: 0,
      x: -100,
    },
    center: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -100,
    },
  }

  const transitionVariant = {
    type: 'tween',
    ease: [0.87, 0, 0.13, 1],
    duration: 0.4,
  }

  return (
    <SimpleBar
      className="mt-4 mb-4 flex-1 select-none overflow-y-auto pl-2 md:h-0 md:pr-5"
      scrollableNodeProps={{ ref: itemGridRef }}
    >
      <AnimatePresence exitBeforeEnter>
        <motion.div transition={transitionVariant}>
          {/* Create a grid to display the items */}
          {basicItemsCount === 0 && epicItemsCount === 0 && legendaryItemsCount === 0 && mythicItemsCount === 0 && (
            <Fragment key="noItems">
              <motion.h3
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                className={cx(
                  'mb-2 text-center font-body font-semibold text-gray-200',
                  rarityFilter !== Rarity.Epic && 'mt-6'
                )}
              >
                No items match your filters.
              </motion.h3>
              <motion.img
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                src="icons/poro_question.png"
                alt="Poro question mark"
                className="mx-auto h-32 w-32 brightness-200"
              />
            </Fragment>
          )}
          {/* Display only items where item.tier is 1 */}
          {basicItemsCount > 0 &&
            (rarityFilter === Rarity.Empty || rarityFilter === Rarity.Basic ? (
              <React.Fragment key="basicContainer">
                <RarityTitle
                  rarity={Rarity.Basic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={1}
                  backgroundColor="bg-slate-900/25"
                  fallbackBackgroundColor="bg-slate-900"
                />
                <motion.div
                  key="basicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={basicItems}
                    transition={transitionVariant}
                    hoveredItem={hoveredItem}
                    selectedItem={selectedItem}
                    setHoveredItem={setHoveredItem}
                    setSelectedItem={setSelectedItem}
                    itemRefArray={itemRefArray}
                  />
                </motion.div>
              </React.Fragment>
            ) : (
              <motion.p
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                key="basicItemsHidden"
                className="mb-2 cursor-pointer italic text-gray-400 underline-offset-1 hover:underline"
                onClick={() => setRarityFilter(Rarity.Basic)}
              >
                {basicItemsCount} basic {getPluralFromItems(basicItemsCount)} hidden.
              </motion.p>
            ))}

          {epicItemsCount > 0 &&
            (rarityFilter === Rarity.Empty || rarityFilter === Rarity.Epic ? (
              <React.Fragment key="epicContainer">
                <RarityTitle
                  rarity={Rarity.Epic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={2}
                  backgroundColor="bg-purple-800/25"
                  fallbackBackgroundColor="bg-purple-800"
                />
                <motion.div
                  key="epicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
                >
                  {/* Loop through the epic items */}
                  <ItemContainer
                    itemsCombined={epicItems}
                    transition={transitionVariant}
                    hoveredItem={hoveredItem}
                    selectedItem={selectedItem}
                    setHoveredItem={setHoveredItem}
                    setSelectedItem={setSelectedItem}
                    itemRefArray={itemRefArray}
                  />
                </motion.div>
              </React.Fragment>
            ) : (
              <motion.p
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                key="epicItemsHidden"
                className="mb-2 cursor-pointer italic text-gray-400 decoration-purple-700 underline-offset-1 hover:underline"
                onClick={() => setRarityFilter(Rarity.Epic)}
              >
                {epicItemsCount} <span className="text-purple-500">epic</span> {getPluralFromItems(epicItemsCount)}{' '}
                hidden.
              </motion.p>
            ))}

          {legendaryItemsCount > 0 &&
            (rarityFilter === Rarity.Empty || rarityFilter === Rarity.Legendary ? (
              <React.Fragment key="legendaryContainer">
                <RarityTitle
                  rarity={Rarity.Legendary}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={3}
                  backgroundColor="bg-red-800/25"
                  fallbackBackgroundColor="bg-red-800"
                />
                <motion.div
                  key="legendaryGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={legendaryItems}
                    transition={transitionVariant}
                    hoveredItem={hoveredItem}
                    selectedItem={selectedItem}
                    setHoveredItem={setHoveredItem}
                    setSelectedItem={setSelectedItem}
                    itemRefArray={itemRefArray}
                  />
                </motion.div>
              </React.Fragment>
            ) : (
              <motion.p
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                key="legendaryItemsHidden"
                className="mb-2 cursor-pointer italic text-gray-400 decoration-red-800 underline-offset-1 hover:underline"
                onClick={() => setRarityFilter(Rarity.Legendary)}
              >
                {legendaryItemsCount} <span className="text-red-600">legendary</span>{' '}
                {getPluralFromItems(legendaryItemsCount)} hidden.
              </motion.p>
            ))}

          {mythicItemsCount > 0 &&
            (rarityFilter === Rarity.Empty || rarityFilter === Rarity.Mythic ? (
              <React.Fragment key="mythicContainer">
                <RarityTitle
                  rarity={Rarity.Mythic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={3}
                  backgroundColor={css`
                    background: radial-gradient(rgb(234 179 8 / 25%), rgb(161 98 7 / 25%));
                    background-size: 400% 400%;
                    animation: Glow 3s ease infinite;

                    @keyframes Glow {
                      0% {
                        background-position: 50% 0;
                      }
                      50% {
                        background-position: 50% 100%;
                      }
                      100% {
                        background-position: 50% 0;
                      }
                    }
                  `}
                  fallbackBackgroundColor="bg-orange-600"
                />
                <motion.div
                  key="mythicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={mythicItems}
                    transition={transitionVariant}
                    mythic={true}
                    hoveredItem={hoveredItem}
                    selectedItem={selectedItem}
                    setHoveredItem={setHoveredItem}
                    setSelectedItem={setSelectedItem}
                    itemRefArray={itemRefArray}
                  />
                </motion.div>
              </React.Fragment>
            ) : (
              <motion.p
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                key="mythicItemsHidden"
                className="mb-2 cursor-pointer italic text-gray-400 decoration-orange-800 underline-offset-1 hover:underline"
                onClick={() => setRarityFilter(Rarity.Mythic)}
              >
                {mythicItemsCount} <span className="text-orange-600">mythic</span>{' '}
                {getPluralFromItems(mythicItemsCount)} hidden.
              </motion.p>
            ))}
        </motion.div>
      </AnimatePresence>
    </SimpleBar>
  )
}
