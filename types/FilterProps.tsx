import { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react'

import { Category, ChampionClass, DraggableItem, ItemsSchema } from './Items'

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
  Mythic = 'Mythic',
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
  icon: string
}

export type ItemGridProps = {
  goldOrderDirection: SortDirection
  searchFilter: string
  setAutocompleteResults: Dispatch<SetStateAction<Fuzzysort.KeysResults<ItemsSchema> | undefined>>
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}

export type FilterBySearchState = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  autocompleteResults: Fuzzysort.KeysResults<ItemsSchema> | undefined
}

export interface ItemSectionState {
  items: ItemsSchema[]
  rarity: Rarity
  tier: number
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
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
