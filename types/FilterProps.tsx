import { Dispatch, SetStateAction } from 'react'
import { Category, ChampionClass } from './Items'

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

export type SortByFilters = {
  goldOrderDirection: SortDirection
  tierFilter: Rarity
  typeFilters: FilterByTypeProps[]
  classFilters: FilterByClassProps[]
  searchFilter: string
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
}
