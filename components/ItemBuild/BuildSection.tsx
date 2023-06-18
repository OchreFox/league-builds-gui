import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
import { cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import dragHandleLine from '@iconify/icons-clarity/drag-handle-line'
import questionMark from '@iconify/icons-tabler/question-mark'
import trashIcon from '@iconify/icons-tabler/trash'
import { Icon } from '@iconify/react'
import RiotMagicParticles from 'components/ChampionPicker/RiotMagicParticles'
import { AnimatePresence, motion } from 'framer-motion'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { BlockState } from 'types/Build'
import { ItemsSchema } from 'types/Items'

import { useItems } from '@/hooks/useItems'
import { addBuildAnimationQueueItem, selectBuild, setBuildDeletePopup } from '@/store/appSlice'
import { addItemToBlock, selectItemBuild, updateBlock, updateBlockType } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

import { easeInOutExpo } from 'utils/Transition'

import BuildItem from './BuildItem'
import { easeOutExpo } from './BuildMakerComponents'
import { DeleteSectionPopper } from './DeleteSectionPopper'
import ItemDragOverlay from './ItemDragOverlay'

const buildVariant = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeInOutExpo,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: easeInOutExpo,
  },
}

export const BuildSection = ({ id }: { id: string }) => {
  const { items } = useItems()
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { deletePopup } = useSelector(selectBuild)
  const { blocks } = useSelector(selectItemBuild)
  const [block, setBlock] = useState<BlockState>(
    blocks.find((block) => block.id === id) || { id: '', items: [], type: 'item', position: 0 }
  )
  const previousBlock = useRef<BlockState>(block)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const popperRef = useRef(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [init, setInit] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [hover, setHover] = useState(false)
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(deleteButtonRef.current, popperRef.current, {
    placement: 'left',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  })

  const getItemFromId = useCallback(
    (itemId: number) => {
      if (items) {
        return Object.values(items).find((item) => item.id === itemId) || null
      }
      return null
    },
    [items]
  )

  const activeItem = useMemo(() => {
    return block.items.find((item) => item.id === activeId)
  }, [activeId, block.items])

  const draggingItem = useMemo(() => {
    if (activeItem && activeItem.itemId) {
      return getItemFromId(parseInt(activeItem.itemId, 10))
    }
  }, [activeId, items])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const closePopup = useCallback(() => {
    dispatch(setBuildDeletePopup(null))
  }, [])

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const overItem = block.items.find((item) => item.id === over?.id)
    if (activeItem && overItem) {
      const newItems = arrayMove(block.items, block.items.indexOf(activeItem), block.items.indexOf(overItem))
      dispatch(updateBlock({ id: block.id, block: { ...block, items: newItems } }))
      setBlock({ ...block, items: newItems })
    }
    setActiveId(null)
  }

  const handleNewItemDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setHover(false)
      const data = JSON.parse(e.dataTransfer.getData('text')) as ItemsSchema
      if (data) {
        dispatch(addItemToBlock({ blockId: block.id, itemId: data.id }))
      }
    },
    [block.id, dispatch]
  )

  useEffect(() => {
    if (sectionRef.current) {
      const { width, height } = sectionRef.current.getBoundingClientRect()
      setSize({
        width: width,
        height: height,
      })
    }
  }, [sectionRef, block.items, hover])

  useEffect(() => {
    const block = blocks.find((x) => x.id === id)
    if (block) {
      if (previousBlock.current.items !== block.items) {
        // Get the item that was added
        const addedItem = block.items.find((item) => !previousBlock.current.items.find((x) => x.id === item.id))
        if (addedItem) {
          console.log('added item', addedItem)
          dispatch(addBuildAnimationQueueItem({ blockId: block.id, itemId: addedItem.id }))
          previousBlock.current = block
        }
      }
      setBlock(block)
    }
  }, [blocks])

  return (
    <motion.div
      key={block.id}
      id={`build_section_${block.id}`}
      variants={buildVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout="position"
      className={cx(
        'mb-4 h-full w-full border border-yellow-900 bg-black/25 ring-2',
        deletePopup === block.id ? 'ring-2 ring-red-500' : 'ring-transparent',
        hover ? 'ring-brand-light' : 'ring-transparent'
      )}
    >
      <div className="flex" id={`build_section_${block.id}_header`}>
        <button
          id={`build_section_${block.id}_drag_handle`}
          className="group right-0 flex items-center border-b-2 border-yellow-900 bg-gray-700/50 pl-1 transition-colors duration-200 ease-out hover:bg-gray-700 active:bg-gray-600"
        >
          <Icon
            icon={dragHandleLine}
            className="mr-1 h-6 w-6 text-gray-500 group-hover:text-white group-active:text-white"
            inline={true}
          />
        </button>
        <input
          id={`build_section_${block.id}_input`}
          type="text"
          name="build-header"
          className="block w-full border-b-2 border-yellow-900 bg-gray-700/50 py-1 pl-4 pr-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:bg-gray-500 focus:outline-none focus:ring-indigo-500"
          placeholder={block?.type}
          autoComplete="off"
          value={block?.type}
          onChange={(e) => dispatch(updateBlockType({ id: block.id, type: e.target.value }))}
          onDrop={(e) => e.preventDefault()}
        />
        <button
          id={`build_section_${block.id}_delete`}
          className="group right-0 flex items-center border-b-2 border-yellow-900 bg-gray-700 pl-2 pr-1 transition-colors duration-200 ease-out hover:bg-brand-dark"
          onClick={() => dispatch(setBuildDeletePopup(block.id))}
          ref={deleteButtonRef}
        >
          <Icon
            icon={deletePopup === block.id ? questionMark : trashIcon}
            className="mr-1 h-6 w-6 text-gray-300 group-hover:text-white"
            inline={true}
          />
        </button>
        <Transition.Root show={deletePopup === block.id} as={Fragment}>
          <Dialog onClose={closePopup}>
            <Transition.Child
              as={Fragment}
              enter="ease-out-expo duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 z-20 h-full w-full bg-black/50 transition-opacity" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out-expo duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="w-screen max-w-md">
                <DeleteSectionPopper
                  popperRef={popperRef}
                  id={block.id}
                  setArrowRef={setArrowRef}
                  styles={styles}
                  attributes={attributes}
                />
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </div>
      <motion.div
        className="relative px-2 py-3"
        ref={sectionRef}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setHover(true)
        }}
        onDragLeave={() => setHover(false)}
        onDrop={handleNewItemDrop}
      >
        {!potatoMode && !init && (
          <motion.div
            className="pointer-events-none absolute top-0 left-0 h-full w-full mix-blend-overlay"
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: {
                duration: 1.5,
                delay: 0.6,
              },
            }}
            onAnimationComplete={() => {
              setInit(true)
            }}
          >
            <video
              className="absolute top-0 left-0 h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              src="/effects/summoner-object-magic-action-blue-intro.webm"
            />
          </motion.div>
        )}
        <motion.div
          className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-cyan-700/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={easeOutExpo}
        >
          {!potatoMode && size.width > 0 && size.height > 0 && (
            <>
              <video
                className="absolute top-0 left-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                src="/effects/loop-magic-vertical.webm"
              />
              <RiotMagicParticles width={size.width} height={size.height} />
            </>
          )}
        </motion.div>

        {block.items.length === 0 ? (
          <p className={cx('inset-0 text-center transition-colors', hover ? 'text-white' : 'text-gray-400')}>
            <em>Drag and drop items here </em>
          </p>
        ) : (
          // <SortableContext strategy={rectSortingStrategy} items={block.items}>
          <div className="grid grid-cols-6 gap-2">
            <AnimatePresence>
              {block.items.map((item) => (
                <BuildItem
                  key={item.id}
                  id={item.id}
                  itemId={item.itemId ? parseInt(item.itemId, 10) : -1}
                  item={item.itemId ? getItemFromId(parseInt(item.itemId, 10)) : null}
                  blockId={block.id}
                />
              ))}
            </AnimatePresence>
          </div>
          // </SortableContext>
        )}
        {/* <DragOverlay
          dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          zIndex={100}
        >
          {draggingItem ? <ItemDragOverlay item={draggingItem} /> : null}
        </DragOverlay> */}
      </motion.div>
    </motion.div>
  )
}
