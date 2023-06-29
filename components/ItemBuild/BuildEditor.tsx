import React, { createRef, useCallback, useMemo, useRef, useState } from 'react'

import {
  Active,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  Over,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import appsIcon from '@iconify/icons-tabler/apps'
import checkIcon from '@iconify/icons-tabler/check'
import plusIcon from '@iconify/icons-tabler/plus'
import { PrimaryButton } from 'components/basic/PrimaryButton'
import { AnimatePresence } from 'framer-motion'
import { batch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { BlockState, Item } from 'types/Build'
import { ItemsSchema } from 'types/Items'

import { BuildSection } from '@/components/ItemBuild/BuildSection'
import DroppableContainer from '@/components/ItemBuild/DroppableContainer'
import { addBuildAnimationQueueItem } from '@/store/appSlice'
import { addBlock, addEmptyBlock, selectItemBuild, setBlocks, updateBlock } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'

import { getNewBlock } from 'utils/ItemBuild'

export const TRASH_ID = 'void'

const BuildEditor = () => {
  const dispatch = useAppDispatch()
  const { blocks } = useSelector(selectItemBuild)
  const itemGridRef = createRef<HTMLDivElement>()

  // Sortable state
  const [clonedItems, setClonedItems] = useState<BlockState[] | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const blockIds = useMemo(() => blocks.map((block) => block.id), [blocks])

  const activeItem = useCallback(
    (active: Active) => {
      return blocks.find((block) => block.items.find((item) => item.id === active.id))
    },
    [blocks]
  )

  const overItem = useCallback(
    (over: Over | null) => {
      return blocks.find((block) => block.items.find((item) => item.id === over?.id))
    },
    [blocks]
  )

  const findContainer = (id: UniqueIdentifier) => {
    return (
      blocks.find((block) => block.items.find((item) => item.id === id))?.id ||
      blocks.find((block) => block.id === id)?.id
    )
  }

  // Add empty block
  const handleClick = useCallback(() => {
    dispatch(addEmptyBlock())
    return true
  }, [])

  // Update an existing block
  const setBlock = (block: any, newItems: Item[]) => {
    dispatch(updateBlock({ id: block.id, block: { ...block, items: newItems } }))
  }

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
    console.log(active)
    setActiveId(active.id)
    setClonedItems(blocks)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log(active, over)
    if (activeItem(active) && overItem(over)) {
      // Check if the item is being moved to a different block or if it's being moved within the same block
    }
    // setActiveId(null)
  }

  const handleDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      dispatch(setBlocks(clonedItems))
    }
    setActiveId(null)
    setClonedItems(null)
  }

  // const handleDragOver = ({ active, over }: DragOverEvent) => {
  //   const overId = over?.id as string | null

  //   if (overId == null || overId === TRASH_ID || blockIds.includes(active.id as string)) {
  //     return
  //   }

  //   const overContainer = findContainer(overId)
  //   const activeContainer = findContainer(active.id)

  //   if (!overContainer || !activeContainer) {
  //     return
  //   }

  //   if (activeContainer !== overContainer) {
  //     setItems((items) => {
  //       const activeItems = blocks.find((block) => block.id === activeContainer)?.items.map((item) => item.id) ?? []
  //       const overItems = items[overContainer]
  //       const overIndex = overItems.indexOf(overId)
  //       const activeIndex = activeItems.indexOf(active.id)

  //       let newIndex: number

  //       if (overId in items) {
  //         newIndex = overItems.length + 1
  //       } else {
  //         const isBelowOverItem =
  //           over &&
  //           active.rect.current.translated &&
  //           active.rect.current.translated.top > over.rect.top + over.rect.height

  //         const modifier = isBelowOverItem ? 1 : 0

  //         newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
  //       }

  //       recentlyMovedToNewContainer.current = true

  //       return {
  //         ...items,
  //         [activeContainer]: items[activeContainer].filter((item) => item !== active.id),
  //         [overContainer]: [
  //           ...items[overContainer].slice(0, newIndex),
  //           items[activeContainer][activeIndex],
  //           ...items[overContainer].slice(newIndex, items[overContainer].length),
  //         ],
  //       }
  //     })
  //   }
  // }

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && blockIds.includes(activeId as string)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            blockIds.includes(container.id as string)
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)

      let overId = getFirstCollision(intersections, 'id')
      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections
        }

        if (blockIds.includes(overId as string)) {
          const containerItems: string[] =
            blocks.find((block) => block.id === overId)?.items.map((item) => item.id) ?? []

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.includes(container.id as string)
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, blockIds]
  )

  return (
    <div className="relative h-full w-full 2xl:absolute">
      <SimpleBar className="h-full justify-center overflow-y-auto" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="m-4 flex flex-col">
          <AnimatePresence>
            <DndContext
              collisionDetection={collisionDetectionStrategy}
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
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
                icon={plusIcon}
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
