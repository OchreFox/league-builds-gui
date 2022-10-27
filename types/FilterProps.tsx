import { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react'

import { Category, ChampionClass, ItemsSchema } from './Items'

export type ItemRefArrayType = MutableRefObject<
  {
    itemId: number
    ref: MutableRefObject<HTMLElement | null>
  }[]
>

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

export type FilterByClassProps = {
  name: string
  isActive: boolean
  icon: string
  class: ChampionClass
}

export type FilterByClassState = {
  filterItems: FilterByClassProps[]
  setFilterItems: Dispatch<SetStateAction<FilterByClassProps[]>>
}

export type ItemGridProps = {
  goldOrderDirection: SortDirection
  rarityFilter: Rarity
  setRarityFilter: Dispatch<SetStateAction<Rarity>>
  typeFilters: FilterByTypeProps[]
  classFilters: FilterByClassProps[]
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
  itemsCombined: ItemsSchema[]
  transition: any
  mythic: boolean
  itemRefArray: ItemRefArrayType
}

export type StandardItemState = {
  item: ItemsSchema
  transition: any
  isMythic: boolean
  itemRefArray: ItemRefArrayType
}

export type ItemBuildTreeProps = {
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
  classFilters: FilterByClassProps[]
  setClassFilters: Dispatch<SetStateAction<FilterByClassProps[]>>
}
