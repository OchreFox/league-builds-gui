import { css } from '@emotion/css'
import { ItemType, TypeFilters } from 'components/ItemFilters/FilterComponents'
import { Variants } from 'framer-motion'
import fuzzy from 'fuzzy'
import { Rarity, SortDirection } from 'types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from 'types/Items'

/**
 * Function to determine if an item includes a category from an array of categories
 * @param item - ItemsSchema - Item to check
 * @param activeCategories - Array<Category[]> - Categories to check against
 * @returns boolean - True if item includes a category from categories
 */
export const includesCategory = (item: ItemsSchema, activeCategories: Array<Category[]>) => {
  // If Category All is present in categories, return true
  if (activeCategories.includes([Category.All])) {
    return true
  }
  // If item includes some category from every category in categories, or the Category All is present, return true
  return activeCategories.every((categoryArray) =>
    item.categories?.some(
      (categoryString) => categoryArray.includes(categoryString) || categoryArray.includes(Category.All)
    )
  )
}

export const includesCategoryAll = (activeCategories: Array<Category[]>) => {
  return activeCategories.flat().includes(Category.All)
}

/**
 * Function to determine if an item is from a champion class
 * @param item - ItemsSchema - Item to check
 * @param championClass - ChampionClass - Champion class to check against
 * @returns boolean - True if item is from champion class
 */
export const isFromChampionClass = (item: ItemsSchema, championClass: ChampionClass) => {
  if (championClass === ChampionClass.None) {
    return true
  }
  return item.classes?.includes(championClass)
}

/**
 * Function to sort items by gold
 * @param items - Array<ItemsSchema> - Items to sort
 * @param goldOrderDirection - SortDirection - Direction to sort
 * @returns Array<ItemsSchema> - Sorted items
 */
export const sortItems = (items: Array<ItemsSchema>, goldOrderDirection: SortDirection) => {
  return items.sort((a, b) => {
    if (goldOrderDirection === SortDirection.Asc) {
      return a.gold.total - b.gold.total
    }
    return b.gold.total - a.gold.total
  })
}

/**
 * Function to mark items as visible from an items array
 * @param itemsArray - Array<ItemsSchema> - Items to mark
 * @param filteredItems - Array<ItemsSchema> - Items to check against
 * @returns Array<ItemsSchema> - Items with visible set to true
 */
export const markItemsAsVisible = (
  itemsArray: Array<ItemsSchema>,
  filteredItems: Array<ItemsSchema>,
  goldOrderDirection: SortDirection
) => {
  let visibleItemCount = 0
  let visibleItems: Array<ItemsSchema> = itemsArray.map((item) => {
    if (filteredItems.some((filteredItem) => filteredItem.id === item.id)) {
      visibleItemCount++
      return { ...item, visible: true }
    }
    return { ...item, visible: false }
  })
  visibleItems = sortItems(visibleItems, goldOrderDirection)
  return { visibleItems: visibleItems, count: visibleItemCount }
}

/**
 * Function to determine if an item matches a search query
 * @param item - ItemsSchema - Item to check
 * @param searchQuery - string - Search query to check against
 * @returns boolean - True if item matches search query
 */
export const matchesSearchQuery = (item: ItemsSchema, searchQuery: string) => {
  let searchArray = []
  item.name && searchArray.push(item.name)
  item.nicknames && searchArray.push(...item.nicknames)

  let results = fuzzy.simpleFilter(searchQuery, searchArray)
  return results.length > 0
}

export const isInStore = (item: ItemsSchema) => {
  return item.inStore === true && (item.maps?.includes(11) || item.maps?.includes(12))
}

/**
 * Function to get the active categories
 * @returns Array<Category[]> - Active categories (or types) as an array of arrays
 */
export const getActiveCategories = (typeFilters: Array<ItemType>): Array<Category[]> => {
  return typeFilters.map((typeFilter) => TypeFilters[typeFilter].categories)
}

export function getPluralFromItems(count: number): string
/**
 * Get the pluralized name of an item
 * @param item - ItemsSchema - Item to check
 * @returns string - Pluralized name of the item
 */
export function getPluralFromItems(itemSubset: Array<ItemsSchema>): string

export function getPluralFromItems(x: any): string {
  if (Array.isArray(x)) {
    return x.length === 1 ? 'item' : 'items'
  }
  return x === 1 ? 'item' : 'items'
}

export const itemSectionConstants: {
  [key in Rarity]: {
    backgroundColor: string
    fallbackBackgroundColor: string
    textColor: string
    decorationColor: string
  }
} = {
  [Rarity.Empty]: {
    backgroundColor: 'bg-transparent',
    fallbackBackgroundColor: 'bg-transparent',
    textColor: 'text-white',
    decorationColor: 'decoration-white',
  },
  [Rarity.Basic]: {
    backgroundColor: 'bg-slate-900/25',
    fallbackBackgroundColor: 'bg-slate-900',
    textColor: '',
    decorationColor: '',
  },
  [Rarity.Epic]: {
    backgroundColor: 'bg-cyan-300/25',
    fallbackBackgroundColor: 'bg-cyan-700',
    textColor: 'text-cyan-500',
    decorationColor: 'decoration-cyan-700',
  },
  [Rarity.Legendary]: {
    backgroundColor: 'bg-red-800/50',
    fallbackBackgroundColor: 'bg-red-800',
    decorationColor: 'decoration-red-800',
    textColor: 'text-red-500',
  },
}

export const gridContainerVariants = {
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

export const titleVariants = {
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

export const transitionVariant = {
  type: 'tween',
  ease: [0.87, 0, 0.13, 1],
  duration: 0.4,
}

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}
