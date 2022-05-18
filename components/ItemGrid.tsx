import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { css, cx } from '@emotion/css'
import fuzzy from 'fuzzy'
import _ from 'lodash'
import { AnimatePresence, AnimationProps, motion, Reorder } from 'framer-motion'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import JSONFetcher from './JSONFetcher'

import {
  Category,
  ItemsSchema,
  RequiredChampion,
  ChampionClass,
} from '../types/Items'
import { Rarity, SortByFilters } from '../types/FilterProps'
import { ItemContainer } from './ItemContainer'
import { RarityTitle } from './RarityTitle'

export default function ItemGrid({
  goldOrderDirection,
  tierFilter,
  typeFilters,
  classFilters,
  searchFilter,
}: SortByFilters) {
  // Fetch items from custom JSON
  const { data: items, error: itemsError } = useSWR<Array<ItemsSchema>>(
    // 'https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/latest/items.json',
    'https://cdn.ochrefox.net/data/latest/items.json',
    JSONFetcher
  )

  // Basic items state
  const [basicItems, setBasicItems] = useState<Array<ItemsSchema>>([])
  const [showBasicItems, setShowBasicItems] = useState(true)
  // Epic items state
  const [epicItems, setEpicItems] = useState<Array<ItemsSchema>>([])
  const [showEpicItems, setShowEpicItems] = useState(true)
  // Legendary items state
  const [legendaryItems, setLegendaryItems] = useState<Array<ItemsSchema>>([])
  const [showLegendaryItems, setShowLegendaryItems] = useState(true)
  // Mythic items state
  const [mythicItems, setMythicItems] = useState<Array<ItemsSchema>>([])
  const [showMythicItems, setShowMythicItems] = useState(true)
  // Data initialization flag
  const [dataInitialized, setDataInitialized] = useState(false)

  // Previous refs
  const previousValues = useRef({
    goldOrderDirection,
    tierFilter,
    typeFilters,
    classFilters,
    searchFilter,
  })

  if (itemsError) {
    console.error(itemsError.message)
  }

  // Filters to determine the rarity of an item
  function isBasic(item: ItemsSchema) {
    return item.tier === 1 && item.inStore
  }
  function isEpic(item: ItemsSchema) {
    return item.tier === 2 && item.inStore
  }
  function isLegendary(item: ItemsSchema) {
    return item.tier === 3 && item.mythic !== true && item.inStore
  }
  function isMythic(item: ItemsSchema) {
    return (
      item.mythic === true &&
      item.requiredChampion === RequiredChampion.Empty &&
      item.inStore
    )
  }

  /**
   * Get the pluralized name of an item
   * @param item - ItemsSchema - Item to check
   * @returns string - Pluralized name of the item
   */
  function getPluralFromItems(itemSubset: Array<ItemsSchema>) {
    return itemSubset.length === 1 ? 'item' : 'items'
  }

  /**
   * Initializes items: takes an object of all the items, sorts them by type, and then sets the state of each type of item.
   * @returns the following:
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
  }

  /**
   * Function to determine if an item includes a category from an array of categories
   * @param item - ItemsSchema - Item to check
   * @param activeCategories - Array<Category[]> - Categories to check against
   * @returns boolean - True if item includes a category from categories
   */
  const includesCategory = (
    item: ItemsSchema,
    activeCategories: Array<Category[]>
  ) => {
    // If Category All is present in categories, return true
    if (activeCategories.includes([Category.All])) {
      return true
    }
    // If item includes some category from every category in categories, or the Category All is present, return true
    return activeCategories.every((categoryArray) =>
      item.categories?.some(
        (categoryString) =>
          categoryArray.includes(categoryString) ||
          categoryArray.includes(Category.All)
      )
    )
  }

  /**
   * Function to determine if an item is from a champion class
   * @param item - ItemsSchema - Item to check
   * @param championClass - ChampionClass - Champion class to check against
   * @returns boolean - True if item is from champion class
   */
  const isFromChampionClass = (
    item: ItemsSchema,
    championClass: ChampionClass
  ) => {
    if (championClass === ChampionClass.None) {
      return true
    }
    return item.classes?.includes(championClass)
  }

  /**
   * Function to mark items as visible from an items array
   * @param itemsArray - Array<ItemsSchema> - Items to mark
   * @param filteredItems - Array<ItemsSchema> - Items to check against
   * @returns Array<ItemsSchema> - Items with visible set to true
   */
  const markItemsAsVisible = (
    itemsArray: Array<ItemsSchema>,
    filteredItems: Array<ItemsSchema>
  ) => {
    let visibleItemCount = 0
    let visibleItems: Array<ItemsSchema> = itemsArray.map((item) => {
      if (filteredItems.some((filteredItem) => filteredItem.id === item.id)) {
        visibleItemCount++
        return { ...item, visible: true }
      }
      return { ...item, visible: false }
    })
    visibleItems = _.orderBy(
      visibleItems,
      ['gold.total'],
      [goldOrderDirection as any]
    )
    return { visibleItems: visibleItems, count: visibleItemCount }
  }

  /**
   * Function to determine if an item matches a search query
   * @param item - ItemsSchema - Item to check
   * @param searchQuery - string - Search query to check against
   * @returns boolean - True if item matches search query
   */
  const matchesSearchQuery = (item: ItemsSchema, searchQuery: string) => {
    if (searchQuery === '') {
      return true
    }
    let searchArray = []
    item.name && searchArray.push(item.name)
    item.nicknames && searchArray.push(...item.nicknames)

    var results = fuzzy.simpleFilter(searchQuery, searchArray)
    return results.length > 0
  }

  /**
   * Function to get the active categories
   * @returns Array<Category[]> - Active categories (or types) as an array of arrays
   */
  const getActiveCategories = (): Array<Category[]> => {
    let activeCategories: Array<Category[]> = []
    typeFilters.forEach((filter) => {
      if (filter.isActive) {
        activeCategories.push([...filter.categories])
      }
    })
    return activeCategories
  }

  /**
   * Function to get the active champion class
   * @returns ChampionClass - Active champion class
   * @returns ChampionClass.None - If no champion class is active
   */
  const getActiveChampionClass = (): ChampionClass => {
    let activeClass = classFilters.filter((filter) => filter.isActive)[0]
    if (activeClass) {
      return activeClass.class
    }
    return ChampionClass.None
  }

  function reduceItems(
    categories: Array<Category[]>,
    championClass: ChampionClass,
    searchQuery: string
  ) {
    if (!items) {
      console.error('No items array provided to reduceItems')
      return
    }
    // Create an array of filter methods to filter the items
    let filterMethods: Array<Function> = [
      (item: ItemsSchema) => includesCategory(item, categories),
      (item: ItemsSchema) => isFromChampionClass(item, championClass),
      (item: ItemsSchema) => matchesSearchQuery(item, searchQuery),
    ]

    let filteredItems = Object.values(items).filter((item) => {
      // If any filter method returns false, the item is filtered out
      return filterMethods.every((method) => method(item))
    })

    let { visibleItems: basicVisibleItems, count: basicItemsCount } =
      markItemsAsVisible(basicItems, filteredItems)
    let { visibleItems: epicVisibleItems, count: epicItemsCount } =
      markItemsAsVisible(epicItems, filteredItems)
    let { visibleItems: legendaryVisibleItems, count: legendaryItemsCount } =
      markItemsAsVisible(legendaryItems, filteredItems)
    let { visibleItems: mythicVisibleItems, count: mythicItemsCount } =
      markItemsAsVisible(mythicItems, filteredItems)

    setBasicItems(basicVisibleItems)
    setEpicItems(epicVisibleItems)
    setLegendaryItems(legendaryVisibleItems)
    setMythicItems(mythicVisibleItems)

    setShowBasicItems(basicItemsCount > 0)
    setShowEpicItems(epicItemsCount > 0)
    setShowLegendaryItems(legendaryItemsCount > 0)
    setShowMythicItems(mythicItemsCount > 0)
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
        const activeCategories = getActiveCategories()
        const activeChampionClass = getActiveChampionClass()
        console.log('Rarity filter: ' + tierFilter)
        console.log('Categories filter: ' + activeCategories)
        console.log('Champion class filter: ' + activeChampionClass)

        reduceItems(activeCategories, activeChampionClass, searchFilter)
      }
    }
  }, [
    items,
    goldOrderDirection,
    tierFilter,
    typeFilters,
    classFilters,
    searchFilter,
  ])

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
    <SimpleBar className="mt-4 mb-4 flex-1 overflow-y-auto md:h-0 md:pr-5">
      <AnimatePresence>
        <motion.div layout="position" transition={transitionVariant}>
          {/* Create a grid to display the items */}
          {!showBasicItems &&
            !showEpicItems &&
            !showLegendaryItems &&
            !showMythicItems && (
              <motion.h3
                key="epicLabel"
                variants={titleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionVariant}
                className={cx(
                  'mb-2 text-center font-body font-semibold text-gray-200',
                  tierFilter !== Rarity.Epic && 'mt-6'
                )}
              >
                No items match your filters.
              </motion.h3>
            )}
          {/* Display only items where item.tier is 1 */}
          {showBasicItems &&
            (tierFilter === Rarity.Empty || tierFilter === Rarity.Basic ? (
              <React.Fragment key="basicContainer">
                <RarityTitle
                  rarity={Rarity.Basic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={1}
                  backgroundColor="bg-slate-900/25"
                />
                <motion.div
                  key="basicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-6 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={basicItems}
                    transition={transitionVariant}
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
                className="mb-2 italic text-gray-400"
              >
                {basicItems.length} basic {getPluralFromItems(basicItems)}{' '}
                hidden.
              </motion.p>
            ))}

          {showEpicItems &&
            (tierFilter === Rarity.Empty || tierFilter === Rarity.Epic ? (
              <React.Fragment key="epicContainer">
                <RarityTitle
                  rarity={Rarity.Epic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={2}
                  backgroundColor="bg-purple-800/25"
                />
                <motion.div
                  key="epicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-6 3xl:grid-cols-9"
                >
                  {/* Loop through the epic items */}
                  <ItemContainer
                    itemsCombined={epicItems}
                    transition={transitionVariant}
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
                className="mb-2 italic text-gray-400"
              >
                {epicItems.length} <span className="text-purple-600">epic</span>{' '}
                {getPluralFromItems(epicItems)} hidden.
              </motion.p>
            ))}

          {showLegendaryItems &&
            (tierFilter === Rarity.Empty || tierFilter === Rarity.Legendary ? (
              <React.Fragment key="legendaryContainer">
                <RarityTitle
                  rarity={Rarity.Legendary}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={3}
                  backgroundColor="bg-red-800/25"
                />
                <motion.div
                  key="legendaryGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-6 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={legendaryItems}
                    transition={transitionVariant}
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
                className="mb-2 italic text-gray-400"
              >
                {legendaryItems.length}{' '}
                <span className="text-red-600">legendary</span>{' '}
                {getPluralFromItems(legendaryItems)} hidden.
              </motion.p>
            ))}

          {showMythicItems &&
            (tierFilter === Rarity.Empty || tierFilter === Rarity.Mythic ? (
              <React.Fragment key="mythicContainer">
                <RarityTitle
                  rarity={Rarity.Mythic}
                  variants={titleVariants}
                  transition={transitionVariant}
                  tier={3}
                  backgroundColor={css`
                    background: radial-gradient(
                      rgb(234 179 8 / 25%),
                      rgb(161 98 7 / 25%)
                    );
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
                />
                <motion.div
                  key="mythicGrid"
                  variants={gridContainerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transitionVariant}
                  className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-6 3xl:grid-cols-9"
                >
                  {/* Loop through the items object */}
                  <ItemContainer
                    itemsCombined={mythicItems}
                    transition={transitionVariant}
                    mythic={true}
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
                className="mb-2 italic text-gray-400"
              >
                {mythicItems.length}{' '}
                <span className="text-orange-600">mythic</span>{' '}
                {getPluralFromItems(mythicItems)} hidden.
              </motion.p>
            ))}
        </motion.div>
      </AnimatePresence>
    </SimpleBar>
  )
}
