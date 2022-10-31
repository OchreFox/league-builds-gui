import { Champion, Tag } from './Champions'
import { ItemsSchema } from './Items'

export interface ChampionPickerState {
  show: boolean
  hover: boolean
  hint: boolean
  isLoading: boolean
  category: Tag
  query: string
}

export interface ItemPickerState {
  hoveredItem: number | null
  selectedItem: ItemsSchema | null
  draggedItem: number | null
}

export interface BuildState {
  deletePopup: string | null
}

export interface MenuState {
  show: boolean
}

export interface AppState {
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
