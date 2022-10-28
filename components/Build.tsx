import { cx } from '@emotion/css'
import { Portal } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { ReactSortable } from 'react-sortablejs'
import SimpleBar from 'simplebar-react'
import { v4 as uuidv4 } from 'uuid'

import { Block, BlockState, Item } from '../types/Build'
import { ItemsSchema } from '../types/Items'
import { easeInOutExpo } from '../utils/Transition'
import { Tooltip, setPopperBg } from './ItemGrid/ItemComponents'
import { selectPotatoMode } from './store/potatoModeSlice'

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

const BuildSection = ({ id, block }: { id: number | undefined; block: Block }) => {
  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const popperRef = useRef(null)
  const [showPopper, setShowPopper] = useState(false)
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
  // React hook form
  const { register } = useForm<Block>()
  const potatoMode = useSelector(selectPotatoMode)

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>, id: number | undefined) => {
    // if (!id) return
    // const newBlocks = [...blocks]
    // const blockIndex = newBlocks.findIndex((block) => block.id === id)
    // newBlocks[blockIndex].type = e.target.value
    // actions.setBuildBlocks(newBlocks)
  }
  return (
    <motion.div
      variants={buildVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      // layoutId={`build-${id}`}
      className="h-full w-full border border-yellow-900 mb-4"
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
          {...register('type')}
          type="text"
          name="build-header"
          className="border-b-2 border-yellow-900 block w-full bg-gray-700/50 focus:bg-gray-500 py-1 pl-4 pr-2 text-lg font-bold text-white placeholder-gray-300 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          placeholder={block.type}
          autoComplete="off"
          onChange={(e) => handleTypeChange(e, id)}
        />
        <button
          className="group right-0 flex items-center pl-2 pr-1 border-b-2 border-yellow-900 bg-gray-700 hover:bg-brand-dark transition-colors duration-200 ease-out"
          onClick={() => setShowPopper(!showPopper)}
          ref={deleteButtonRef}
        >
          <Icon
            icon={showPopper ? 'tabler:question-mark' : 'tabler:trash'}
            className="mr-1 h-6 w-6 text-gray-300 group-hover:text-white"
            inline={true}
          />
        </button>
        {showPopper && (
          <Portal>
            <Tooltip
              ref={popperRef}
              style={styles.popper}
              {...attributes.popper}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={'popper-' + id}
              className={cx(
                'bg-gray-700/50 border border-yellow-900 text-white text-sm rounded-md shadow-lg backdrop-blur-md',
                setPopperBg(potatoMode)
              )}
            >
              <div ref={setArrowRef} style={styles.arrow} id="arrow" key={'arrow-' + id} />
              <div className="flex flex-col w-full" key={'popper-content-' + id}>
                <div className="flex pb-1 mb-1 border-b border-yellow-900 items-center">
                  <span className="rounded-full bg-brand-dark flex items-center justify-center mr-2 p-1">
                    <Icon icon="tabler:trash" className="h-5 w-5 text-white" inline={true} />
                  </span>
                  <h3 className="font-body font-semibold text-red-400 text-lg">Confirm delete</h3>
                </div>
                <p className="text-gray-200">Are you sure you want to delete this section? {id}</p>
                <div className="flex flex-row w-full mt-2">
                  <button
                    className="mr-2 px-2 py-1 bg-transparent hover:bg-gray-700 transition-colors duration-200 ease-out rounded-md inline-flex grow items-center border-2 border-gray-500 text-center justify-center"
                    onClick={() => setShowPopper(false)}
                  >
                    <Icon icon="tabler:x" className="h-5 w-5 text-gray-300 mr-1" inline={true} />
                    Cancel
                  </button>
                  <button
                    className="px-2 py-1 bg-brand-dark hover:bg-red-800 transition-colors duration-200 ease-out rounded-md flex grow items-center justify-center"
                    onClick={() => {
                      // const blockIndex = blocks.findIndex((block) => block.id === id)
                      // console.log('Index of block to delete: ', blockIndex)
                      // const newBlocks = [...blocks]
                      // newBlocks.splice(blockIndex, 1)
                      // console.log('New blocks: ', newBlocks)
                      // actions.setBuildBlocks(newBlocks)
                      // setShowPopper(false)
                    }}
                  >
                    <Icon icon="tabler:trash" className="h-5 w-5 text-gray-300 mr-1" inline={true} />
                    Delete
                  </button>
                </div>
              </div>
            </Tooltip>
          </Portal>
        )}
      </div>
      <div className="px-2 py-3">
        {block.items.length === 0 && (
          <p className="text-center text-gray-400">
            <em>Drag and drop items here</em>
            {id}
          </p>
        )}
        {/* <ReactSortable group="shared" animation={150} sort={false} list={items} setList={() => {}}></ReactSortable> */}
      </div>
    </motion.div>
  )
}

const Build = () => {
  const [addBuildBlockClick, setAddBuildBlockClick] = useState(false)
  const itemGridRef = createRef<HTMLDivElement>()
  const sectionButtonRef = useRef<HTMLButtonElement>(null)

  const addIdToBlocks = (blocksArray: Array<BlockState>): BlockState[] => {
    let tempLastBlockId = 0
    let newBlocks: BlockState[] = []
    blocksArray.forEach((block, index) => {
      // Check if block has an id
      if (block.id) {
        newBlocks.push(block)
      } else {
        newBlocks.push({ ...block, id: uuidv4() })
      }
    })
    return newBlocks
  }

  const handleSetBlocks = (blocksArray: BlockState[]) => {
    // actions.setBuildBlocks(blocksArray)
  }

  const handleAddBlock = (block: BlockState) => {
    // let newBlock = { ...block, id: uuidv4() }
    // let newBlocks = [...blocks, newBlock]
    // handleSetBlocks(newBlocks)
  }

  // useEffect(() => {
  //   // Initialize the blocks state
  //   if (blocks.length > 0) {
  //     console.log('Initializing blocks')
  //     let modifiedBlocks = addIdToBlocks(blocks)
  //     handleSetBlocks(modifiedBlocks)
  //   }
  // }, [])

  useEffect(() => {
    if (addBuildBlockClick) {
      setTimeout(() => {
        setAddBuildBlockClick(false)
        sectionButtonRef.current?.blur()
      }, 1000)
    }
  }, [addBuildBlockClick])

  return (
    <div className="absolute h-full w-full">
      <SimpleBar className="h-full overflow-y-auto justify-center" scrollableNodeProps={{ ref: itemGridRef }}>
        <div className="flex flex-col m-4">
          <AnimatePresence>
            {/* {blocks.map((block, index) => (
              <BuildSection key={index} id={block.id} block={block} />
            ))} */}
            <motion.button
              layout="position"
              layoutId="add-block"
              ref={sectionButtonRef}
              className="inline-flex items-center bg-brand-default transition-colors duration-200 ease-out hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded-full justify-center my-4 shadow-xl hover:shadow focus:bg-green-400"
              onClick={() => {
                handleAddBlock({ type: 'New Section', items: [] })
                setAddBuildBlockClick(true)
              }}
            >
              <Icon icon="tabler:apps" inline={true} className="mr-1" width="20" height="20" />
              Add Section
            </motion.button>
          </AnimatePresence>
        </div>
      </SimpleBar>
    </div>
  )
}

export default Build
