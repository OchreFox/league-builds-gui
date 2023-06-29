import React, { Fragment, createRef, useEffect, useMemo, useRef, useState } from 'react'

import { css, cx } from '@emotion/css'
import { scrollIntoItem } from 'components/ItemBuildTree/BuildTreeComponents'
import { AnimatePresence, motion } from 'framer-motion'
import { batch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { ItemGridProps, Rarity, SortDirection } from 'types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from 'types/Items'

import { useItems } from '@/hooks/useItems'
import {
  selectItemFilters,
  selectItemPicker,
  setItemFiltersClass,
  setItemFiltersRarity,
  setItemPickerContainerCount,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import { getRarity, isBasic, isEpic, isLegendary, isMythic } from 'utils/ItemRarity'

import 'simplebar-react/dist/simplebar.min.css'

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
} from './ItemGridComponents'
import ItemSection from './ItemSection'

export default function ItemGrid({ goldOrderDirection, itemRefArray, itemGridRef }: ItemGridProps) {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const itemPicker = useSelector(selectItemPicker)
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
    tempBasicItems = sortItems(tempBasicItems, goldOrderDirection)
    tempEpicItems = sortItems(tempEpicItems, goldOrderDirection)
    tempLegendaryItems = sortItems(tempLegendaryItems, goldOrderDirection)
    tempMythicItems = sortItems(tempMythicItems, goldOrderDirection)

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
    if (hasCategoryAll && championClass === ChampionClass.None && goldOrderDirection === SortDirection.Asc) {
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
        (item: ItemsSchema) => isInStore(item),
      ]

      let filteredItems = Object.values(items).filter((item) => {
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
  }, [items, goldOrderDirection, itemFilters])

  // Listen for changes in itemPicker
  useEffect(() => {
    if (itemPicker) {
      handleScrollShow({ target: itemGridRef.current })
    }
  }, [itemPicker.containers])

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
  }, [itemPicker.selectedItem])

  // Scroll to item
  useEffect(() => {
    if (shouldScrollToItem && itemPicker.selectedItem) {
      const selectedItem = itemPicker.selectedItem
      // Check if the item is visible
      scrollIntoItem(selectedItem, itemRefArray, itemGridRef)
      setShouldScrollToItem(false)
    }
  }, [shouldScrollToItem])

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

  // Add scroll event listener to item grid
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
              src="icons/poro_question.webp"
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
