import React, { Fragment, createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { css, cx } from '@emotion/css'
import { scrollIntoItem } from '@/components/ItemBuildTree/BuildTreeComponents'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { ItemGridProps, Rarity, SortDirection } from '@/types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from '@/types/Items'

import {
  getActiveCategories,
  includesCategory,
  includesCategoryAll,
  isFromChampionClass,
  isInStore,
  markItemsAsVisible,
  sortItems,
  titleVariants,
  transitionVariant,
} from '@/components/ItemGrid/ItemGridComponents'
import ItemSection from '@/components/ItemGrid/ItemSection'
import { useItems } from '@/hooks/useItems'
import {
  selectItemFilters,
  selectItemPicker,
  setItemFiltersClass,
  setItemFiltersRarity,
  setItemPickerContainerCount,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import { getRarity, isBasic, isEpic, isLegendary } from '@/utils/ItemRarity'

import 'simplebar-react/dist/simplebar.min.css'
import { ItemPickerState } from '@/types/App'

export default function ItemGrid({ goldOrderDirection, itemRefArray, itemGridRef }: Readonly<ItemGridProps>) {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const itemPicker: ItemPickerState = useSelector(selectItemPicker)
  const basicItemsCount = useMemo(() => itemPicker.containers[Rarity.Basic].count, [itemPicker.containers])
  const epicItemsCount = useMemo(() => itemPicker.containers[Rarity.Epic].count, [itemPicker.containers])
  const legendaryItemsCount = useMemo(() => itemPicker.containers[Rarity.Legendary].count, [itemPicker.containers])

  // Fetch items from custom JSON
  const { items, itemsError } = useItems()
  // Items state
  const [basicItems, setBasicItems] = useState<Array<ItemsSchema>>([])
  const [epicItems, setEpicItems] = useState<Array<ItemsSchema>>([])
  const [legendaryItems, setLegendaryItems] = useState<Array<ItemsSchema>>([])
  // Initial items state
  const [initialBasicItems, setInitialBasicItems] = useState<Array<ItemsSchema>>([])
  const [initialEpicItems, setInitialEpicItems] = useState<Array<ItemsSchema>>([])
  const [initialLegendaryItems, setInitialLegendaryItems] = useState<Array<ItemsSchema>>([])
  // Data initialization flag
  const [dataInitialized, setDataInitialized] = useState(false)
  // Scroll to bottom
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [scrollToBottom, setScrollToBottom] = useState(false)
  // Scroll to item
  const [shouldScrollToItem, setShouldScrollToItem] = useState(false)

  const isAnimating = useMemo(() => {
    return Object.values(itemPicker.containers).some((container) => container.isAnimating)
  }, [itemPicker.containers])

  // Total height of the item grid
  const totalHeight = useMemo(() => {
    return Object.values(itemPicker.containers).reduce((acc, container) => {
      return acc + (container.height || 0)
    }, 0)
  }, [itemPicker.containers])

  // Previous refs
  const previousValues = useRef({
    goldOrderDirection,
    itemFilters,
  })

  if (itemsError) {
    console.error(itemsError.message)
  }

  /**
   * Initializes items: takes an object of all the items, sorts them by type, and then sets the state of each type of item.
   */
  const initializeItems = useCallback(() => {
    // Only run the function if the items are present
    if (!items) return

    // Create temporary arrays for each item type
    let tempBasicItems: Array<ItemsSchema> = []
    let tempEpicItems: Array<ItemsSchema> = []
    let tempLegendaryItems: Array<ItemsSchema> = []
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
      }
    }

    // Order temp arrays with the type of goldOrderDirection
    tempBasicItems = sortItems(tempBasicItems, goldOrderDirection)
    tempEpicItems = sortItems(tempEpicItems, goldOrderDirection)
    tempLegendaryItems = sortItems(tempLegendaryItems, goldOrderDirection)

    // Set initial items
    setInitialBasicItems(tempBasicItems)
    setInitialEpicItems(tempEpicItems)
    setInitialLegendaryItems(tempLegendaryItems)

    setBasicItems(tempBasicItems)
    setEpicItems(tempEpicItems)
    setLegendaryItems(tempLegendaryItems)

    // Set the count of each rarity
    dispatch(setItemPickerContainerCount({ rarity: Rarity.Basic, count: tempBasicItems.length }))
    dispatch(setItemPickerContainerCount({ rarity: Rarity.Epic, count: tempEpicItems.length }))
    dispatch(setItemPickerContainerCount({ rarity: Rarity.Legendary, count: tempLegendaryItems.length }))

    // Initialize itemRefArray
    let totalItemsAmount = tempBasicItems.length + tempEpicItems.length + tempLegendaryItems.length
    for (let i = 0; i < totalItemsAmount; i++) {
      // Set a temporal item id to read the id of the element i in the arrays tempBasicItems, tempEpicItems, etc.
      let tempItemId = -1
      if (i < tempBasicItems.length) {
        tempItemId = tempBasicItems[i].id
      } else if (i < tempBasicItems.length + tempEpicItems.length) {
        tempItemId = tempEpicItems[i - tempBasicItems.length].id
      } else if (i < tempBasicItems.length + tempEpicItems.length + tempLegendaryItems.length) {
        tempItemId = tempLegendaryItems[i - tempBasicItems.length - tempEpicItems.length].id
      }

      itemRefArray.current.push({
        itemId: tempItemId,
        ref: createRef(),
      })
    }
  }, [items, goldOrderDirection, itemRefArray, dispatch])

  /**
   * Updates the items state when the filters change.
   */
  const reduceItems = useCallback(
    (categories: Array<Category[]>, championClass: ChampionClass) => {
      if (!items) {
        console.error('No items array provided to reduceItems')
        return
      }
      let basicVisibleItems: Array<ItemsSchema> = []
      let epicVisibleItems: Array<ItemsSchema> = []
      let legendaryVisibleItems: Array<ItemsSchema> = []

      let basicVisibleItemsCount = 0
      let epicVisibleItemsCount = 0
      let legendaryVisibleItemsCount = 0

      // If no filters are selected, return all items
      const hasCategoryAll = includesCategoryAll(categories)
      if (hasCategoryAll && championClass === ChampionClass.None && goldOrderDirection === SortDirection.Asc) {
        basicVisibleItems = initialBasicItems
        epicVisibleItems = initialEpicItems
        legendaryVisibleItems = initialLegendaryItems

        basicVisibleItemsCount = initialBasicItems.length
        epicVisibleItemsCount = initialEpicItems.length
        legendaryVisibleItemsCount = initialLegendaryItems.length
      } else {
        // Create an array of filter methods to filter the items
        let filterMethods: Array<Function> = [
          (item: ItemsSchema) => includesCategory(item, categories),
          (item: ItemsSchema) => isFromChampionClass(item, championClass),
          (item: ItemsSchema) => isInStore(item),
        ]

        let filteredItems = Object.values(items).filter((item) => {
          // If any filter method returns false, the item is filtered out
          return filterMethods.every((method) => method(item))
        })
        let basicResults = markItemsAsVisible(basicItems, filteredItems, goldOrderDirection)
        let epicResults = markItemsAsVisible(epicItems, filteredItems, goldOrderDirection)
        let legendaryResults = markItemsAsVisible(legendaryItems, filteredItems, goldOrderDirection)

        basicVisibleItems = basicResults.visibleItems
        epicVisibleItems = epicResults.visibleItems
        legendaryVisibleItems = legendaryResults.visibleItems

        basicVisibleItemsCount = basicResults.count
        epicVisibleItemsCount = epicResults.count
        legendaryVisibleItemsCount = legendaryResults.count
      }

      setBasicItems(basicVisibleItems)
      setEpicItems(epicVisibleItems)
      setLegendaryItems(legendaryVisibleItems)

      dispatch(setItemPickerContainerCount({ rarity: Rarity.Basic, count: basicVisibleItemsCount }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Epic, count: epicVisibleItemsCount }))
      dispatch(setItemPickerContainerCount({ rarity: Rarity.Legendary, count: legendaryVisibleItemsCount }))
    },
    [
      items,
      goldOrderDirection,
      initialBasicItems,
      initialEpicItems,
      initialLegendaryItems,
      basicItems,
      epicItems,
      legendaryItems,
      dispatch,
    ]
  )

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
        previousValues.current.itemFilters === itemFilters
      ) {
        return
      } else {
        // Reduce items
        const activeCategories = getActiveCategories(itemFilters.types)
        reduceItems(activeCategories, itemFilters.class)

        // Set previous values
        previousValues.current.goldOrderDirection = goldOrderDirection
        previousValues.current.itemFilters = itemFilters
      }
    }
  }, [items, goldOrderDirection, itemFilters, dataInitialized, initializeItems, reduceItems])

  // Handle scroll show if the item grid requires a scroll bar
  const handleScrollShow = useCallback(
    (e: any) => {
      const div = e.target as HTMLDivElement
      const hasVerticalScrollbar = totalHeight > div.clientHeight
      if (hasVerticalScrollbar) {
        setShowScrollToBottom(true)
      } else {
        setShowScrollToBottom(false)
      }
    },
    [totalHeight]
  )

  // Listen for changes in itemPicker
  useEffect(() => {
    if (itemPicker) {
      handleScrollShow({ target: itemGridRef.current })
    }
  }, [handleScrollShow, itemGridRef, itemPicker, itemPicker.containers])

  // Listen for changes in selected item and scroll to it
  useEffect(() => {
    // Wait until all filters are applied
    if (itemPicker.selectedItem) {
      const selectedItem = itemPicker.selectedItem
      const itemRarity = getRarity(selectedItem)

      // If there is a rarity filter, change the filter to the item's rarity and scroll to it
      if (itemFilters.rarity !== itemRarity && itemFilters.rarity !== Rarity.Empty) {
        dispatch(setItemFiltersRarity(itemRarity))
      }
      // Remove champion class filter if the item is obfuscated by it
      if (!isFromChampionClass(selectedItem, itemFilters.class)) {
        dispatch(setItemFiltersClass(ChampionClass.None))
      }

      setShouldScrollToItem(true)
    }
  }, [dispatch, itemFilters.class, itemFilters.rarity, itemPicker.selectedItem])

  // Scroll to item
  useEffect(() => {
    if (shouldScrollToItem && itemPicker.selectedItem) {
      const selectedItem = itemPicker.selectedItem
      // Check if the item is visible
      scrollIntoItem(selectedItem, itemRefArray, itemGridRef)
      setShouldScrollToItem(false)
    }
  }, [itemGridRef, itemPicker.selectedItem, itemRefArray, shouldScrollToItem])

  // Handle scroll to bottom
  const handleScroll = (e: any) => {
    const div = e.target as HTMLDivElement
    const bottom = Math.abs(div.scrollHeight - div.clientHeight - div.scrollTop) < 1
    if (bottom) {
      setScrollToBottom(true)
    } else {
      setScrollToBottom(false)
    }
  }

  // Add scroll event listener to item grid
  useEffect(() => {
    console.log('Adding scroll event listener to item grid')
    const gridRef = itemGridRef.current
    gridRef?.addEventListener('scroll', handleScroll)

    return () => {
      gridRef?.removeEventListener('scroll', handleScroll)
    }
  }, [itemGridRef])

  return (
    <>
      <AnimatePresence>
        {showScrollToBottom && !scrollToBottom && (
          <motion.div
            className={cx(
              'pointer-events-none absolute bottom-4 left-0 right-4 z-10 h-16',
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
        className="mb-4 mt-4 flex-1 select-none overflow-y-auto pl-2 md:h-0 md:pr-5"
        scrollableNodeProps={{ ref: itemGridRef }}
      >
        {basicItemsCount === 0 && epicItemsCount === 0 && legendaryItemsCount === 0 && (
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
              src="https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/icons/poro_question.webp"
              alt="Poro question mark"
              className="mx-auto h-32 w-32 brightness-200"
            />
          </Fragment>
        )}
        <div id="item-virtual-container">
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
        </div>
      </SimpleBar>
    </>
  )
}
