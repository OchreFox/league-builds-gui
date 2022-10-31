import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import type { TypedAddListener, TypedStartListening } from '@reduxjs/toolkit'
import { BlockState } from 'types/Build'
import { v4 as uuidv4 } from 'uuid'

import { addBlock, removeBlock, setBlocks, updateBlock } from './itemBuildSlice'
import { AppDispatch, RootState } from './store'

export const listenerMiddleware = createListenerMiddleware()
export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = listenerMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

// Add ID when adding a new block
startAppListening({
  actionCreator: addBlock,
  effect: (action, { getState, dispatch }) => {
    const { blocks } = getState().itemBuild
    const newBlock: BlockState = {
      ...action.payload,
      id: uuidv4(),
      position: blocks.length,
    }
    dispatch(addBlock(newBlock))
  },
})

// Move position when updating a block
// Example: Block 1 is moved to position 3
// Block 1 will have position 3
// Block 2 will have position 1
// Block 3 will have position 2
startAppListening({
  actionCreator: updateBlock,
  effect: (action, { getState, dispatch }) => {
    const { blocks } = getState().itemBuild
    const { id, block } = action.payload
    let newBlocks = [...blocks]
    const index = newBlocks.findIndex((block) => block.id === id)
    newBlocks.splice(index, 1)
    newBlocks.splice(block.position, 0, block)
    newBlocks = newBlocks.map((block, index) => ({ ...block, position: index }))
    dispatch(setBlocks(newBlocks))
  },
})

// Update position when removing a block
// Example: A middle block is removed (3) in a list of 5 blocks
// Block 1 will have position 1
// Block 2 will have position 2
// Block 4 will have position 3
// Block 5 will have position 4
startAppListening({
  actionCreator: removeBlock,
  effect: (action, { getState, dispatch }) => {
    const { blocks } = getState().itemBuild
    let newBlocks = [...blocks]
    newBlocks = newBlocks.map((block, index) => {
      return {
        ...block,
        position: index,
        type: block.type.includes('Empty Block') ? `Empty Block ${index + 1}` : block.type,
      }
    })
    dispatch(setBlocks(newBlocks))
  },
})
