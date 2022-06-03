import { Dispatch, SetStateAction } from 'react'
import { Category, ChampionClass, ItemsSchema } from './Items'

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

export type ItemGridState = {
  goldOrderDirection: SortDirection
  tierFilter: Rarity
  typeFilters: FilterByTypeProps[]
  classFilters: FilterByClassProps[]
  searchFilter: string
  setAutocompleteResults: Dispatch<
    SetStateAction<Fuzzysort.KeysResults<ItemsSchema> | undefined>
  >
  selectedItem: ItemsSchema | null
  setSelectedItem: Dispatch<SetStateAction<ItemsSchema | null>>
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
  itemsCombined: ItemsSchema[]
  transition: any
  mythic: boolean
  hoveredItem: number | null
  selectedItem: ItemsSchema | null
  setHoveredItem: React.Dispatch<React.SetStateAction<number | null>>
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemsSchema | null>>
}

export type StandardItemState = {
  item: ItemsSchema
  transition: any
  hoveredItem: number | null
  isMythic: boolean
  selectedItem: ItemsSchema | null
  setHoveredItem: React.Dispatch<React.SetStateAction<number | null>>
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemsSchema | null>>
}
