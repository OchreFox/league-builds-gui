import { useItems } from '@/hooks/useItems'
import { selectItemFilters, selectItemPicker, setItemPickerContainerCount } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { AnimatePresence, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import _ from 'lodash'
import React, { Fragment, createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { batch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { ItemGridProps, Rarity, SortDirection } from 'types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from 'types/Items'

import { isBasic, isEpic, isLegendary, isMythic } from 'utils/ItemRarity'
import { easeInOutExpo } from 'utils/Transition'

import {
  getActiveCategories,
  includesCategory,
  includesCategoryAll,
  isFromChampionClass,
  isInStore,
  markItemsAsVisible,
  matchesSearchQuery,
  overlayVariants,
  titleVariants,
  transitionVariant,
} from './ItemGridComponents'
import ItemSection from './ItemSection'

export default function ItemGrid({
  goldOrderDirection,
  searchFilter,
  setAutocompleteResults,
  itemRefArray,
  itemGridRef,
}: ItemGridProps) {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const itemPicker = useSelector(selectItemPicker)
  const { hoveredItem } = useSelector(selectItemPicker)
  const basicItemsCount = useMemo(() => itemPicker.containers[Rarity.Basic].count, [itemPicker.containers])
  const epicItemsCount = useMemo(() => itemPicker.containers[Rarity.Epic].count, [itemPicker.containers])
  const legendaryItemsCount = useMemo(() => itemPicker.containers[Rarity.Legendary].count, [itemPicker.containers])
  const mythicItemsCount = useMemo(() => itemPicker.containers[Rarity.Mythic].count, [itemPicker.containers])

  // Fetch items from custom JSON
  const { items, itemsError } = useItems()
  // Items state
  const [basicItems, setBasicItems] = useState<Array<ItemsSchema>>([])
  const [epicItems, setEpicItems] = useState<Array<ItemsSchema>>([])
  const [legendaryItems, setLegendaryItems] = useState<Array<ItemsSchema>>([])
  const [mythicItems, setMythicItems] = useState<Array<ItemsSchema>>([])
  // Initial items state
  const [initialBasicItems, setInitialBasicItems] = useState<Array<ItemsSchema>>([])
  const [initialEpicItems, setInitialEpicItems] = useState<Array<ItemsSchema>>([])
  const [initialLegendaryItems, setInitialLegendaryItems] = useState<Array<ItemsSchema>>([])
  const [initialMythicItems, setInitialMythicItems] = useState<Array<ItemsSchema>>([])
  // Data initialization flag
  const [dataInitialized, setDataInitialized] = useState(false)
  // Scroll to bottom
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [scrollToBottom, setScrollToBottom] = useState(false)
  const topRef = useRef(0)
  const bottomRef = useRef(0)

  // Memoize total height of the item grid
  const totalHeight = useMemo(() => {
    return Object.values(itemPicker.containers).reduce((acc, container) => {
      return acc + (container.height || 0)
    }, 0)
  }, [itemPicker.containers])

  // Previous refs
  const previousValues = useRef({
    goldOrderDirection,
    itemFilters,
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

    // Set initial items
    setInitialBasicItems(tempBasicItems)
    setInitialEpicItems(tempEpicItems)
    setInitialLegendaryItems(tempLegendaryItems)
    setInitialMythicItems(tempMythicItems)

    setBasicItems(tempBasicItems)
    setEpicItems(tempEpicItems)
    setLegendaryItems(tempLegendaryItems)
    setMythicItems(tempMythicItems)

    // Set the count of each rarity
    batch(() => {
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Basic, count: tempBasicItems.length }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Epic, count: tempEpicItems.length }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Legendary, count: tempLegendaryItems.length }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Mythic, count: tempMythicItems.length }))
    })

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

    let filteredItems: ItemsSchema[]

    let basicVisibleItems: Array<ItemsSchema> = []
    let epicVisibleItems: Array<ItemsSchema> = []
    let legendaryVisibleItems: Array<ItemsSchema> = []
    let mythicVisibleItems: Array<ItemsSchema> = []

    let basicVisibleItemsCount = 0
    let epicVisibleItemsCount = 0
    let legendaryVisibleItemsCount = 0
    let mythicVisibleItemsCount = 0

    // If no filters are selected, return all items
    const hasCategoryAll = includesCategoryAll(categories)
    if (
      hasCategoryAll &&
      championClass === ChampionClass.None &&
      searchFilter === '' &&
      goldOrderDirection === SortDirection.Asc
    ) {
      filteredItems = items
      console.log('No filters selected')
      basicVisibleItems = initialBasicItems
      epicVisibleItems = initialEpicItems
      legendaryVisibleItems = initialLegendaryItems
      mythicVisibleItems = initialMythicItems

      basicVisibleItemsCount = initialBasicItems.length
      epicVisibleItemsCount = initialEpicItems.length
      legendaryVisibleItemsCount = initialLegendaryItems.length
      mythicVisibleItemsCount = initialMythicItems.length
    } else {
      // Create an array of filter methods to filter the items
      let filterMethods: Array<Function> = [
        (item: ItemsSchema) => includesCategory(item, categories),
        (item: ItemsSchema) => isFromChampionClass(item, championClass),
        (item: ItemsSchema) => matchesSearchQuery(item, searchFilter),
        (item: ItemsSchema) => isInStore(item),
      ]

      filteredItems = Object.values(items).filter((item) => {
        // If any filter method returns false, the item is filtered out
        return filterMethods.every((method) => method(item))
      })
      let basicResults = markItemsAsVisible(basicItems, filteredItems, goldOrderDirection)
      let epicResults = markItemsAsVisible(epicItems, filteredItems, goldOrderDirection)
      let legendaryResults = markItemsAsVisible(legendaryItems, filteredItems, goldOrderDirection)
      let mythicResults = markItemsAsVisible(mythicItems, filteredItems, goldOrderDirection)

      basicVisibleItems = basicResults.visibleItems
      epicVisibleItems = epicResults.visibleItems
      legendaryVisibleItems = legendaryResults.visibleItems
      mythicVisibleItems = mythicResults.visibleItems

      basicVisibleItemsCount = basicResults.count
      epicVisibleItemsCount = epicResults.count
      legendaryVisibleItemsCount = legendaryResults.count
      mythicVisibleItemsCount = mythicResults.count
    }

    setBasicItems(basicVisibleItems)
    setEpicItems(epicVisibleItems)
    setLegendaryItems(legendaryVisibleItems)
    setMythicItems(mythicVisibleItems)

    batch(() => {
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Basic, count: basicVisibleItemsCount }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Epic, count: epicVisibleItemsCount }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Legendary, count: legendaryVisibleItemsCount }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Mythic, count: mythicVisibleItemsCount }))
    })

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
      initializeItems()
    }
    // Data filters
    if (dataInitialized && items) {
      // Return if no changes were made to the filters
      if (
        previousValues.current.goldOrderDirection === goldOrderDirection &&
        previousValues.current.searchFilter === searchFilter &&
        previousValues.current.itemFilters === itemFilters
      )
        return
      else {
        // Reduce items
        const activeCategories = getActiveCategories(itemFilters.types)
        reduceItems(activeCategories, itemFilters.class)

        // Set previous values
        previousValues.current.goldOrderDirection = goldOrderDirection
        previousValues.current.searchFilter = searchFilter
        previousValues.current.itemFilters = itemFilters
      }
    }
  }, [items, goldOrderDirection, itemFilters, searchFilter])

  // Listen for changes in itemPicker
  useEffect(() => {
    if (itemPicker) {
      handleScrollShow({ target: itemGridRef.current })
    }
  }, [itemPicker])

  // Handle scroll to bottom
  const handleScroll = (e: any) => {
    const div = e.target as HTMLDivElement
    topRef.current = div.scrollTop
    bottomRef.current = div.scrollTop + div.clientHeight
    console.log(topRef.current)
    console.log(bottomRef.current)
    const bottom = Math.abs(div.scrollHeight - div.clientHeight - div.scrollTop) < 1
    if (bottom) {
      setScrollToBottom(true)
    } else {
      setScrollToBottom(false)
    }
  }

  // Handle scroll show if the item grid requires a scroll bar
  const handleScrollShow = (e: any) => {
    const div = e.target as HTMLDivElement
    const hasVerticalScrollbar = totalHeight > div.clientHeight
    if (hasVerticalScrollbar) {
      setShowScrollToBottom(true)
    } else {
      setShowScrollToBottom(false)
    }
  }

  useEffect(() => {
    itemGridRef.current?.addEventListener('scroll', handleScroll)

    return () => {
      itemGridRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {showScrollToBottom && !scrollToBottom && (
          <motion.div
            className={cx(
              'absolute bottom-4 left-0 right-4 h-16 z-10 pointer-events-none',
              css`
                background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 1) 100%);
              `
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <SimpleBar
        className="mt-4 mb-4 flex-1 select-none overflow-y-auto pl-2 md:h-0 md:pr-5"
        scrollableNodeProps={{ ref: itemGridRef }}
      >
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              className={cx('absolute inset-0 w-full h-full z-[5] pointer-events-none bg-black/25')}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={easeInOutExpo}
            ></motion.div>
          )}
        </AnimatePresence>
        <div id="item-virtual-container">
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
                  itemFilters.rarity !== Rarity.Epic && 'mt-6'
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
          {basicItemsCount > 0 && (
            <ItemSection
              items={basicItems}
              rarity={Rarity.Basic}
              tier={1}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          )}

          {epicItemsCount > 0 && (
            <ItemSection
              items={epicItems}
              rarity={Rarity.Epic}
              tier={2}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          )}

          {legendaryItemsCount > 0 && (
            <ItemSection
              items={legendaryItems}
              rarity={Rarity.Legendary}
              tier={3}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          )}

          {mythicItemsCount > 0 && (
            <ItemSection
              items={mythicItems}
              rarity={Rarity.Mythic}
              tier={3}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          )}
        </div>
      </SimpleBar>
    </>
  )
}
