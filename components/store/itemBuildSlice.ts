import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from 'types/App'
import { v4 as uuidv4 } from 'uuid'
import { string } from 'yup'

import { Block, BlockState, ItemBuild, RiotItemBuild } from '../../types/Build'
import { ChampionsSchema, DefaultChampionSchema } from '../../types/Champions'
import { RootState } from './store'

const hydrate = createAction<AppState>(HYDRATE)

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
    setRiotItemBuild: (state, action: PayloadAction<RiotItemBuild>) => {
      const { title, associatedMaps, associatedChampions, blocks } = action.payload
      state.title = title
      state.associatedMaps = associatedMaps
      state.associatedChampions = associatedChampions
      state.blocks = blocks.map((block, index) => {
        return {
          id: uuidv4(),
          position: index,
          type: block.type,
          items: block.items.map((item) => {
            return {
              id: item.id,
              uid: uuidv4(),
              count: item.count,
            }
          }),
        }
      })
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
    addItemToBlock: (state, action: PayloadAction<{ blockId: string; itemId: number }>) => {
      const { blockId, itemId } = action.payload
      const block = state.blocks.find((block) => block.id === blockId)
      if (block) {
        block.items.push({
          id: itemId.toString(),
          uid: uuidv4(),
          count: 1,
        })
      }
    },
    removeItemFromBlock: (state, action: PayloadAction<{ blockId: string; itemId: number }>) => {
      const { blockId, itemId } = action.payload
      const block = state.blocks.find((block) => block.id === blockId)
      if (block) {
        block.items = block.items.filter((item) => item.id !== itemId.toString())
      }
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
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })
  },
})

export const selectItemBuild = (state: RootState) => state.itemBuild
export const selectAssociatedChampions = (state: RootState) => state.itemBuild.associatedChampions
export const {
  resetItemBuild,
  setItemBuild,
  setRiotItemBuild,
  setTitle,
  setAssociatedMaps,
  setAssociatedChampions,
  addAssociatedChampion,
  removeAssociatedChampion,
  setBlocks,
  addBlock,
  addEmptyBlock,
  addItemToBlock,
  removeItemFromBlock,
  removeBlock,
  updateBlock,
  updateBlockType,
} = itemBuildSlice.actions
export default itemBuildSlice.reducer
