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

export interface AppState {
  selectedChampions: Champion[]
  championPicker: ChampionPickerState
  itemPicker: ItemPickerState
}
