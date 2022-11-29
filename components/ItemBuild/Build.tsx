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

const Build = () => {
  const dispatch = useAppDispatch()
  const { blocks } = useSelector(selectItemBuild)
  const itemGridRef = createRef<HTMLDivElement>()

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const item: ItemsSchema = JSON.parse(e.dataTransfer.getData('text'))?.item
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
    <div className="absolute h-full w-full">
      <SimpleBar className="h-full overflow-y-auto justify-center" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="flex flex-col m-4">
          <AnimatePresence>
            {blocks.map((block) => (
              <BuildSection key={block.id} id={block.id} />
            ))}
            <PrimaryButton
              label="Add Section"
              icon="tabler:apps"
              labelReactive="Added"
              iconReactive="tabler:check"
              dropReactive={true}
              handleClick={() => {
                dispatch(addEmptyBlock())
              }}
              handleDrop={(e) => handleDrop(e)}
            />
          </AnimatePresence>
        </div>
      </SimpleBar>
    </div>
  )
}

export default Build
