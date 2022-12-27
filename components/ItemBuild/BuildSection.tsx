import { useItems } from '@/hooks/useItems'
import { selectBuild, setBuildDeletePopup } from '@/store/appSlice'
import { addItemToBlock, selectItemBuild, updateBlockType } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import dragHandleLine from '@iconify/icons-clarity/drag-handle-line'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { BlockState } from 'types/Build'
import { ItemsSchema } from 'types/Items'

import RiotMagicParticles from 'components/ChampionPicker/RiotMagicParticles'

import { easeInOutExpo } from 'utils/Transition'

import BuildItem from './BuildItem'
import { easeOutExpo } from './BuildMakerComponents'
import { DeleteSectionPopper } from './DeleteSectionPopper'

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
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { deletePopup } = useSelector(selectBuild)
  const { blocks } = useSelector(selectItemBuild)
  const [block, setBlock] = useState<BlockState>(
    blocks.find((block) => block.id === id) || { id: '', items: [], type: 'item', position: 0 }
  )

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

  const closePopup = useCallback(() => {
    dispatch(setBuildDeletePopup(null))
  }, [])

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
    const block = blocks.find((block) => block.id === id)
    if (block) {
      setBlock(block)
    }
  }, [blocks])

  return (
    <motion.div
      variants={buildVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout="position"
      className={cx(
        'h-full w-full mb-4 ring-2 border border-yellow-900',
        deletePopup === block.id ? 'ring-2 ring-red-500' : 'ring-transparent',
        hover ? 'ring-brand-light' : 'ring-transparent'
      )}
    >
      <div className="flex">
        <button
          className="group right-0 flex items-center pl-1 border-b-2 border-yellow-900 bg-gray-700/50 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 ease-out"
          ref={deleteButtonRef}
        >
          <Icon
            icon={dragHandleLine}
            className="mr-1 h-6 w-6 text-gray-500 group-hover:text-white group-active:text-white"
            inline={true}
          />
        </button>
        <input
          type="text"
          name="build-header"
          className="border-b-2 border-yellow-900 block w-full bg-gray-700/50 focus:bg-gray-500 py-1 pl-4 pr-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder={block?.type}
          autoComplete="off"
          value={block?.type}
          onChange={(e) => dispatch(updateBlockType({ id: block.id, type: e.target.value }))}
          onDrop={(e) => e.preventDefault()}
        />
        <button
          className="group right-0 flex items-center pl-2 pr-1 border-b-2 border-yellow-900 bg-gray-700 hover:bg-brand-dark transition-colors duration-200 ease-out"
          onClick={() => dispatch(setBuildDeletePopup(block.id))}
          ref={deleteButtonRef}
        >
          <Icon
            icon={deletePopup === block.id ? 'tabler:question-mark' : 'tabler:trash'}
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
              <Dialog.Overlay className="fixed inset-0 bg-black/50 transition-opacity w-full h-full z-20" />
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
        className={cx('px-2 py-3 relative', block.items.length !== 0 && 'grid grid-cols-6 gap-2')}
        ref={sectionRef}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setHover(true)
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setHover(false)
          const data = JSON.parse(e.dataTransfer.getData('text')) as ItemsSchema
          if (data) {
            dispatch(addItemToBlock({ blockId: block.id, itemId: data.id }))
          }
        }}
      >
        {!potatoMode && !init && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-overlay"
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
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              src="/effects/summoner-object-magic-action-blue-intro.webm"
            />
          </motion.div>
        )}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-cyan-700/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={easeOutExpo}
        >
          {!potatoMode && size.width > 0 && size.height > 0 && (
            <>
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
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
        <AnimatePresence>
          {block.items.length === 0 ? (
            <p className={cx('text-center inset-0 transition-colors', hover ? 'text-white' : 'text-gray-400')}>
              <em>Drag and drop items here </em>
            </p>
          ) : (
            block.items.map((item, index) => (
              <BuildItem
                key={item.id + '-build-section-item'}
                itemId={parseInt(item.id, 10)}
                itemUid={item.uid}
                blockId={block.id}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
