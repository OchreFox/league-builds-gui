import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { Rarity } from 'types/FilterProps'

import { ItemType } from 'components/ItemFilters/FilterComponents'

import { AppState, emptyContainer } from '../../types/App'
import { Champion, Tag } from '../../types/Champions'
import { ChampionClass, ItemsSchema } from '../../types/Items'
import { RootState } from './store'

const hydrate = createAction<AppState>(HYDRATE)

const initialState: AppState = {
  itemFilters: {
    class: ChampionClass.None,
    rarity: Rarity.Empty,
    types: [ItemType.All],
  },
  selectedChampions: [],
  championPicker: {
    show: false,
    hover: false,
    hint: false,
    isLoading: false,
    category: Tag.All,
    query: '',
    loadedChampionIds: [],
  },
  itemPicker: {
    hoveredItem: null,
    selectedItem: null,
    draggedItem: null,
    containers: {
      [Rarity.Empty]: emptyContainer,
      [Rarity.Basic]: emptyContainer,
      [Rarity.Epic]: emptyContainer,
      [Rarity.Legendary]: emptyContainer,
      [Rarity.Mythic]: emptyContainer,
    },
  },
  menu: {
    show: false,
  },
  build: {
    deletePopup: null,
    itemContextMenu: {
      show: false,
      item: null,
    },
    allowSave: false,
    savePopup: false,
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetApp: (_state) => {
      // Reset the app state to the initial state, except for the itemPicker.containers
      return {
        ...initialState,
        itemPicker: {
          ...initialState.itemPicker,
          containers: _state.itemPicker.containers,
        },
      }
    },
    setItemFiltersClass: (state, action: PayloadAction<ChampionClass>) => {
      state.itemFilters.class = action.payload
    },
    setItemFiltersRarity: (state, action: PayloadAction<Rarity>) => {
      state.itemFilters.rarity = action.payload
    },
    setItemFilterType: (state, action: PayloadAction<{ type: ItemType; value: boolean }>) => {
      const { type, value } = action.payload
      const index = state.itemFilters.types.indexOf(type)
      if (value && index === -1) {
        state.itemFilters.types.push(type)
      } else if (!value && index !== -1) {
        state.itemFilters.types.splice(index, 1)
      }
    },
    toggleItemFiltersType: (state, action: PayloadAction<string>) => {
      const itemType = action.payload as ItemType
      const index = state.itemFilters.types.indexOf(itemType)
      if (index === -1) {
        state.itemFilters.types.push(itemType)
      } else {
        state.itemFilters.types.splice(index, 1)
      }
    },
    resetItemFiltersTypes: (state) => {
      state.itemFilters.types = [ItemType.All]
    },
    setSelectedChampions: (state, action: PayloadAction<Champion[]>) => {
      state.selectedChampions = action.payload
    },
    addSelectedChampion: (state, action: PayloadAction<Champion>) => {
      state.selectedChampions.push(action.payload)
    },
    removeSelectedChampion: (state, action: PayloadAction<Champion>) => {
      state.selectedChampions = state.selectedChampions.filter((champion) => champion.id !== action.payload.id)
    },
    updateSelectedChampion: (state, action: PayloadAction<Champion>) => {
      const index = state.selectedChampions.findIndex((champion) => champion.id === action.payload.id)
      state.selectedChampions[index] = action.payload
    },
    setChampionPickerShow: (state, action: PayloadAction<boolean>) => {
      state.championPicker.show = action.payload
    },
    setChampionPickerHover: (state, action: PayloadAction<boolean>) => {
      state.championPicker.hover = action.payload
    },
    setChampionPickerHint: (state, action: PayloadAction<boolean>) => {
      state.championPicker.hint = action.payload
    },
    setChampionPickerIsLoading: (state, action: PayloadAction<boolean>) => {
      state.championPicker.isLoading = action.payload
    },
    setChampionPickerCategory: (state, action: PayloadAction<Tag>) => {
      state.championPicker.category = action.payload
    },
    setChampionPickerQuery: (state, action: PayloadAction<string>) => {
      state.championPicker.query = action.payload
    },
    addChampionPickerLoadedChampionId: (state, action: PayloadAction<number>) => {
      state.championPicker.loadedChampionIds.push(action.payload)
    },
    setItemPickerHoveredItem: (state, action: PayloadAction<number | null>) => {
      state.itemPicker.hoveredItem = action.payload
    },
    setItemPickerSelectedItem: (state, action: PayloadAction<ItemsSchema | null>) => {
      state.itemPicker.selectedItem = action.payload
    },
    setItemPickerDraggedItem: (state, action: PayloadAction<number | null>) => {
      state.itemPicker.draggedItem = action.payload
    },
    resetItemPickerContainer: (state, action: PayloadAction<Rarity>) => {
      state.itemPicker.containers[action.payload] = emptyContainer
    },
    setItemPickerContainerHeight: (state, action: PayloadAction<{ rarity: Rarity; height: number }>) => {
      state.itemPicker.containers[action.payload.rarity].height = action.payload.height
    },
    setItemPickerContainerGridHeight: (state, action: PayloadAction<{ rarity: Rarity; height: number }>) => {
      state.itemPicker.containers[action.payload.rarity].gridHeight = action.payload.height
    },
    setItemPickerContainerTitleHeight: (state, action: PayloadAction<{ rarity: Rarity; height: number }>) => {
      state.itemPicker.containers[action.payload.rarity].titleHeight = action.payload.height
    },
    setItemPickerContainerRows: (state, action: PayloadAction<{ rarity: Rarity; rows: number }>) => {
      state.itemPicker.containers[action.payload.rarity].rows = action.payload.rows
    },
    setItemPickerContainerColumns: (state, action: PayloadAction<{ rarity: Rarity; columns: number }>) => {
      state.itemPicker.containers[action.payload.rarity].columns = action.payload.columns
    },
    setItemPickerContainerCount: (state, action: PayloadAction<{ rarity: Rarity; count: number }>) => {
      state.itemPicker.containers[action.payload.rarity].count = action.payload.count
    },
    setMenuShow: (state, action: PayloadAction<boolean>) => {
      state.menu.show = action.payload
    },
    setBuildDeletePopup: (state, action: PayloadAction<string | null>) => {
      state.build.deletePopup = action.payload
    },
    setBuildItemContextMenuShow: (state, action: PayloadAction<boolean>) => {
      state.build.itemContextMenu.show = action.payload
    },
    setBuildItemContextMenuItem: (state, action: PayloadAction<number | null>) => {
      state.build.itemContextMenu.item = action.payload
    },
    setBuildAllowSave: (state, action: PayloadAction<boolean>) => {
      state.build.allowSave = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })
  },
})

export const selectItemFilters = (state: RootState) => state.app.itemFilters
export const selectSelectedChampions = (state: RootState) => state.app.selectedChampions
export const selectChampionPicker = (state: RootState) => state.app.championPicker
export const selectItemPicker = (state: RootState) => state.app.itemPicker
export const selectMenu = (state: RootState) => state.app.menu
export const selectBuild = (state: RootState) => state.app.build

export const {
  resetApp,
  setItemFiltersClass,
  setItemFiltersRarity,
  setItemFilterType,
  toggleItemFiltersType,
  resetItemFiltersTypes,
  setSelectedChampions,
  addSelectedChampion,
  removeSelectedChampion,
  updateSelectedChampion,
  setChampionPickerShow,
  setChampionPickerHover,
  setChampionPickerHint,
  setChampionPickerIsLoading,
  setChampionPickerCategory,
  setChampionPickerQuery,
  addChampionPickerLoadedChampionId,
  setItemPickerHoveredItem,
  setItemPickerSelectedItem,
  setItemPickerDraggedItem,
  resetItemPickerContainer,
  setItemPickerContainerHeight,
  setItemPickerContainerGridHeight,
  setItemPickerContainerTitleHeight,
  setItemPickerContainerRows,
  setItemPickerContainerColumns,
  setItemPickerContainerCount,
  setMenuShow,
  setBuildDeletePopup,
  setBuildItemContextMenuShow,
  setBuildItemContextMenuItem,
  setBuildAllowSave,
} = appSlice.actions
