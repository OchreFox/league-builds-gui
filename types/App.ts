import { ItemType } from 'components/ItemFilters/FilterComponents'

import { Champion, Tag } from './Champions'
import { Rarity } from './FilterProps'
import { ChampionClass, ItemsSchema } from './Items'

export interface ItemFilters {
  class: ChampionClass
  rarity: Rarity
  types: ItemType[]
}
export interface ChampionPickerState {
  show: boolean
  hover: boolean
  hint: boolean
  isLoading: boolean
  category: Tag
  query: string
  loadedChampionIds: number[]
}

export interface ItemContainer {
  titleHeight: number
  gridHeight: number
  height: number
  columns: number
  rows: number
  count: number
  isAnimating?: boolean
}

export const emptyContainer: ItemContainer = {
  titleHeight: 0,
  gridHeight: 0,
  height: 0,
  columns: 0,
  rows: 0,
  count: 0,
  isAnimating: false,
}

export interface ItemPickerState {
  hoveredItem: number | null
  selectedItem: ItemsSchema | null
  draggedItem: number | null
  containers: Record<Rarity, ItemContainer>
}

export interface MenuState {
  show: boolean
}

export interface AnimationQueueItem {
  blockId: string
  items: string[]
}

export interface BuildState {
  deletePopup: string | null
  itemContextMenu: {
    show: boolean
    item: number | null
  }
  animationQueue: AnimationQueueItem[]
}

// Main state
export interface AppState {
  itemFilters: ItemFilters
  selectedChampions: Champion[]
  championPicker: ChampionPickerState
  itemPicker: ItemPickerState
  menu: MenuState
  build: BuildState
}

export type LoaderOptions = {
  src: string
  width?: number
  height?: number
  quality?: number
}
