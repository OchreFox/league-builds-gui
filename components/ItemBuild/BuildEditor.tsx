import { addBlock, addEmptyBlock, selectItemBuild } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'
import { AnimatePresence } from 'framer-motion'
import React, { createRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { BlockState } from 'types/Build'
import { ItemsSchema } from 'types/Items'
import { v4 as uuidv4 } from 'uuid'

import { PrimaryButton } from 'components/basic/PrimaryButton'

import { BuildSection } from './BuildSection'

const BuildEditor = () => {
  const dispatch = useAppDispatch()
  const { blocks } = useSelector(selectItemBuild)
  const itemGridRef = createRef<HTMLDivElement>()

  const handleClick = useCallback(() => {
    dispatch(addEmptyBlock())
    return true
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const item: ItemsSchema = JSON.parse(e.dataTransfer.getData('text')) as ItemsSchema
      let block: BlockState = {
        id: uuidv4(),
        type: 'New Section',
        items: [
          {
            id: item.id.toString(),
            count: 1,
            uid: uuidv4(),
          },
        ],
        position: blocks.length,
      }
      dispatch(addBlock(block))
    },
    [blocks]
  )

  return (
    <div className="relative h-full w-full 2xl:absolute">
      <SimpleBar className="h-full justify-center overflow-y-auto" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="m-4 flex flex-col">
          <AnimatePresence>
            {blocks.map((block) => (
              <BuildSection key={block.id + '-build-item'} id={block.id} />
            ))}
            <PrimaryButton
              label="Add Section"
              icon="tabler:apps"
              labelReactive="Added"
              iconReactive="tabler:check"
              handleClick={handleClick}
              handleDrop={handleDrop}
            />
          </AnimatePresence>
        </div>
      </SimpleBar>
    </div>
  )
}

export default BuildEditor
