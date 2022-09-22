import { GlobalState, useStateMachine } from 'little-state-machine'
import React from 'react'
import SimpleBar from 'simplebar-react'

import { Block } from '../types/Build'
import { ItemsSchema } from '../types/Items'
import { Droppable } from './Droppable'

const appendBuildBlock = (state: GlobalState, payload: Block) => {
  return {
    itemBuild: {
      ...state.itemBuild,
      blocks: [...state.itemBuild.blocks, payload],
    },
  }
}

const editBuildBlock = (state: GlobalState, payload: Block, index: number) => {
  let newBlocks = state.itemBuild.blocks
  newBlocks[index] = payload

  return {
    itemBuild: {
      ...state.itemBuild,
      blocks: newBlocks,
    },
  }
}

const resetBuild = (state: GlobalState) => {
  return {
    itemBuild: {
      ...state.itemBuild,
      blocks: [],
    },
  }
}

const BuildSection = ({ id, children }: { id: number; children: JSX.Element }) => {
  return (
    <div className="h-full w-full border border-yellow-900 ">
      <div className="relative">
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div> */}
        <input
          type="text"
          name="build-header"
          className="border-b-2 border-yellow-900 block w-full bg-yellow-900/50 focus:bg-brand-dark py-1 px-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder="Section Title"
        />
      </div>
      <div className="px-2 py-3">{children}</div>
    </div>
  )
}

const Build = () => {
  const { actions, state } = useStateMachine({
    appendBuildBlock,
    editBuildBlock
  })

  return (
    <div className="absolute h-full w-full">
      <SimpleBar className="m-4 h-full overflow-y-auto">
        {/* Build Title */}
        <BuildSection id={1}>
          <Droppable id={1}>
            <p className="text-center text-gray-400">
              <em>Drag and drop items here</em>
            </p>
          </Droppable>
        </BuildSection>
      </SimpleBar>
    </div>
  )
}

export default Build
