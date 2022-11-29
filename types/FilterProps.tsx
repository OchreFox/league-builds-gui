import { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react'

import { Category, ChampionClass, DraggableItem, ItemsSchema } from './Items'

export type ItemRefArrayType = MutableRefObject<
  {
    itemId: number
    ref: MutableRefObject<HTMLElement | null>
  }[]
>

export interface ClassFilter {
  name: string
  isActive: boolean
  icon: any
  class: ChampionClass
}

export type FilterByTypeProps = {
  name: string
  isActive: boolean
  icon: string
  categories: Array<Category>
}
export type FilterByTypeState = {
  filterItems: FilterByTypeProps[]
  setFilterItems: Dispatch<SetStateAction<FilterByTypeProps[]>>
}

export type FilterByClassState = {
  filterItems: ClassFilter[]
  setFilterItems: Dispatch<SetStateAction<ClassFilter[]>>
}

export type ItemGridProps = {
  goldOrderDirection: SortDirection
  rarityFilter: Rarity
  setRarityFilter: Dispatch<SetStateAction<Rarity>>
  typeFilters: FilterByTypeProps[]
  classFilters: ClassFilter[]
  searchFilter: string
  setAutocompleteResults: Dispatch<SetStateAction<Fuzzysort.KeysResults<ItemsSchema> | undefined>>
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}

export enum Rarity {
  Empty = 'All',
  Basic = 'Basic',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Mythic = 'Mythic',
}

export type FilterByRarityState = {
  rarityFilter: Rarity
  setRarityFilter: Dispatch<SetStateAction<Rarity>>
}

export type SortByTier = {
  tierSortType: Rarity
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type FilterBySearchState = {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  autocompleteResults: Fuzzysort.KeysResults<ItemsSchema> | undefined
}

export type ItemContainerState = {
  gridKey: string
  itemsCombined: DraggableItem[]
  setItemsCombined: Dispatch<SetStateAction<DraggableItem[]>>
  transition: any
  mythic: boolean
  itemRefArray: ItemRefArrayType
}

export interface ItemState {
  item: ItemsSchema
  isMythic: boolean
}

export interface StandardItemState extends ItemState {
  transition: any
  itemRefArray: ItemRefArrayType
}

export type ItemBuildTreeProps = {
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
  classFilters: ClassFilter[]
  setClassFilters: Dispatch<SetStateAction<ClassFilter[]>>
}
