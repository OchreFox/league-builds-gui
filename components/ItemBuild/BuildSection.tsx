import { selectBuild, setBuildDeletePopup } from '@/store/appSlice'
import { selectItemBuild, updateBlockType } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { ReactSortable } from 'react-sortablejs'
import { BlockState } from 'types/Build'

import { easeInOutExpo } from 'utils/Transition'

import { DeleteSectionPopper } from './DeleteSectionPopper'

export const BuildSection = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch()
  const { deletePopup } = useSelector(selectBuild)
  const { blocks } = useSelector(selectItemBuild)
  const [block, setBlock] = useState<BlockState>()

  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const popperRef = useRef(null)
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

  useEffect(() => {
    const block = blocks.find((block) => block.id === id)
    if (block) {
      setBlock(block)
    }
  }, [blocks, id])

  if (!block) {
    return null
  }
  return (
    <motion.div
      variants={buildVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cx('h-full w-full mb-4 border border-yellow-900', deletePopup === block.id && 'ring-2 ring-red-500')}
    >
      <div className="flex">
        <button
          className="group right-0 flex items-center pl-1 border-b-2 border-yellow-900 bg-gray-700/50 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 ease-out"
          ref={deleteButtonRef}
        >
          <Icon
            icon="tabler:dots-vertical"
            className="mr-1 h-6 w-6 text-gray-500 group-hover:text-white group-active:text-white"
            inline={true}
          />
        </button>
        <input
          type="text"
          name="build-header"
          className="border-b-2 border-yellow-900 block w-full bg-gray-700/50 focus:bg-gray-500 py-1 pl-4 pr-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder={block.type}
          autoComplete="off"
          value={block.type}
          onChange={(e) => dispatch(updateBlockType({ id: block.id, type: e.target.value }))}
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
          <Dialog onClose={() => dispatch(setBuildDeletePopup(null))}>
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
      <div className="px-2 py-3">
        {block.items.length == 0 && (
          <p className="text-center text-gray-400">
            <em>Drag and drop items here </em>
          </p>
        )}
        {/* <ReactSortable group="shared" animation={150} sort={false} list={items} setList={() => {}}></ReactSortable> */}
      </div>
    </motion.div>
  )
}
