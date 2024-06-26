import { MutableRefObject, RefObject } from 'react'

import { Category, DraggableItem, ItemsSchema } from '@/types/Items'

// Auxiliary types
export type ItemRefArrayType = MutableRefObject<
  {
    itemId: number
    ref: MutableRefObject<HTMLElement | null>
  }[]
>

export enum Rarity {
  Empty = 'All',
  Basic = 'Basic',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export type SortByTier = {
  tierSortType: Rarity
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

// Filters
export interface ClassFilter {
  name: string
  icon: any
}

export interface TypeFilter {
  name: string
  categories: Category[]
  icon: any
}

export type ItemGridProps = {
  goldOrderDirection: SortDirection
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}

export interface ItemSectionState {
  items: ItemsSchema[]
  rarity: Rarity
  tier: number
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
  // style: React.CSSProperties
}

export type ItemContainerState = {
  gridKey: string
  itemsCombined: DraggableItem[]
  rarity: Rarity
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}

export interface StandardItemState {
  item: ItemsSchema
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}

export type ItemBuildTreeProps = {
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}
