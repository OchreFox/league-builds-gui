import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { AppState } from '../../types/App'
import { Champion, Tag } from '../../types/Champions'
import { ItemsSchema } from '../../types/Items'
import { RootState } from './store'

const initialState: AppState = {
  selectedChampions: [],
  championPicker: {
    show: false,
    hover: false,
    hint: false,
    isLoading: false,
    category: Tag.All,
    query: '',
  },
  itemPicker: {
    hoveredItem: null,
    selectedItem: null,
    draggedItem: null,
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
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetApp: (_state) => {
      return initialState
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
    setItemPickerHoveredItem: (state, action: PayloadAction<number | null>) => {
      state.itemPicker.hoveredItem = action.payload
    },
    setItemPickerSelectedItem: (state, action: PayloadAction<ItemsSchema | null>) => {
      state.itemPicker.selectedItem = action.payload
    },
    setItemPickerDraggedItem: (state, action: PayloadAction<number | null>) => {
      state.itemPicker.draggedItem = action.payload
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
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.app,
      }
    },
  },
})

export const selectSelectedChampions = (state: RootState) => state.app.selectedChampions
export const selectChampionPicker = (state: RootState) => state.app.championPicker
export const selectItemPicker = (state: RootState) => state.app.itemPicker
export const selectMenu = (state: RootState) => state.app.menu
export const selectBuild = (state: RootState) => state.app.build

export const {
  resetApp,
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
  setItemPickerHoveredItem,
  setItemPickerSelectedItem,
  setItemPickerDraggedItem,
  setMenuShow,
  setBuildDeletePopup,
  setBuildItemContextMenuShow,
  setBuildItemContextMenuItem,
} = appSlice.actions
