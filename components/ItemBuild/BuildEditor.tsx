import { addBuildAnimationQueueItem } from '@/store/appSlice'
import { addBlock, addEmptyBlock, selectItemBuild } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import appsIcon from '@iconify/icons-tabler/apps'
import checkIcon from '@iconify/icons-tabler/check'
import { AnimatePresence } from 'framer-motion'
import React, { createRef, useCallback, useState } from 'react'
import { batch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { ItemsSchema } from 'types/Items'

import { PrimaryButton } from 'components/basic/PrimaryButton'

import { getNewBlock } from 'utils/ItemBuild'

import { BuildSection } from './BuildSection'
import DroppableContainer from './DroppableContainer'

const BuildEditor = () => {
  const dispatch = useAppDispatch()
  const { blocks } = useSelector(selectItemBuild)
  const itemGridRef = createRef<HTMLDivElement>()

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  // Add empty block
  const handleClick = useCallback(() => {
    dispatch(addEmptyBlock())
    return true
  }, [])

  // Add item to build from item grid
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const item: ItemsSchema = JSON.parse(e.dataTransfer.getData('text')) as ItemsSchema
      const block = getNewBlock(blocks.length, item.id)
      batch(() => {
        dispatch(addBlock(block))
        dispatch(addBuildAnimationQueueItem({ blockId: block.id, itemId: block.items[0].id }))
      })
    },
    [blocks]
  )

  // Sortable

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log(active, over)
    // const overItem = block.items.find((item) => item.id === over?.id)
    // if (activeItem && overItem) {
    //   const newItems = arrayMove(block.items, block.items.indexOf(activeItem), block.items.indexOf(overItem))
    //   dispatch(updateBlock({ id: block.id, block: { ...block, items: newItems } }))
    //   setBlock({ ...block, items: newItems })
    // }
    // setActiveId(null)
  }

  return (
    <div className="relative h-full w-full 2xl:absolute">
      <SimpleBar className="h-full justify-center overflow-y-auto" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="m-4 flex flex-col">
          <AnimatePresence>
            <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {blocks.map((block) => (
                <DroppableContainer key={block.id + '-build-item'} id={block.id} items={block.items}>
                  <SortableContext strategy={rectSortingStrategy} items={block.items}>
                    <BuildSection id={block.id} />
                  </SortableContext>
                </DroppableContainer>
              ))}
              <PrimaryButton
                label="Add Section"
                icon={appsIcon}
                labelReactive="Added"
                iconReactive={checkIcon}
                handleClick={handleClick}
                handleDrop={handleDrop}
              />
            </DndContext>
          </AnimatePresence>
        </div>
      </SimpleBar>
    </div>
  )
}

export default BuildEditor
