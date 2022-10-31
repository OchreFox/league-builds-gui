import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { v4 as uuidv4 } from 'uuid'

import { Block, BlockState, ItemBuild } from '../../types/Build'
import { ChampionsSchema, DefaultChampionSchema } from '../../types/Champions'
import { RootState } from './store'

const initialState: ItemBuild = {
  title: '',
  associatedMaps: [],
  associatedChampions: [],
  blocks: [],
}

export const itemBuildSlice = createSlice({
  name: 'itemBuild',
  initialState,
  reducers: {
    resetItemBuild: (_state) => {
      return initialState
    },
    setItemBuild: (_state, action: PayloadAction<ItemBuild>) => {
      return action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setAssociatedMaps: (state, action: PayloadAction<number[]>) => {
      state.associatedMaps = action.payload
    },
    setAssociatedChampions: (state, action: PayloadAction<number[]>) => {
      state.associatedChampions = action.payload
    },
    addAssociatedChampion: (state, action: PayloadAction<number>) => {
      state.associatedChampions.push(action.payload)
    },
    removeAssociatedChampion: (state, action: PayloadAction<number>) => {
      state.associatedChampions = state.associatedChampions.filter((championId) => championId !== action.payload)
    },
    setBlocks: (state, action: PayloadAction<BlockState[]>) => {
      state.blocks = action.payload
    },
    addBlock: (state, action: PayloadAction<BlockState>) => {
      state.blocks.push(action.payload)
    },
    addEmptyBlock: (state) => {
      state.blocks.push({
        id: uuidv4(),
        position: state.blocks.length,
        type: `Empty Block ${state.blocks.length + 1}`,
        items: [],
      })
    },
    removeBlock: (state, action: PayloadAction<string>) => {
      state.blocks = state.blocks.filter((block) => block.id !== action.payload)
    },
    updateBlock: (state, action: PayloadAction<{ id: string; block: BlockState }>) => {
      const { id, block } = action.payload
      const index = state.blocks.findIndex((block) => block.id === id)
      state.blocks[index] = block
    },
    updateBlockType: (state, action: PayloadAction<{ id: string; type: string }>) => {
      const { id, type } = action.payload
      const index = state.blocks.findIndex((block) => block.id === id)
      state.blocks[index].type = type
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.itemBuild,
      }
    },
  },
})

export const selectItemBuild = (state: RootState) => state.itemBuild
export const selectAssociatedChampions = (state: RootState) => state.itemBuild.associatedChampions
export const {
  resetItemBuild,
  setItemBuild,
  setTitle,
  setAssociatedMaps,
  setAssociatedChampions,
  addAssociatedChampion,
  removeAssociatedChampion,
  setBlocks,
  addBlock,
  addEmptyBlock,
  removeBlock,
  updateBlock,
  updateBlockType,
} = itemBuildSlice.actions
export default itemBuildSlice.reducer
