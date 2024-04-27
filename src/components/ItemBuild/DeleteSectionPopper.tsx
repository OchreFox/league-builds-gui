import { setBuildDeletePopup } from '@/store/appSlice'
import { removeBlock } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Portal } from '@headlessui/react'
import trashIcon from '@iconify/icons-tabler/trash'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React from 'react'
import { DeleteSectionPopperProps } from '@/types/Build'

import popperStyles from '@/components/ItemGrid/ItemPopper.module.scss'

export function DeleteSectionPopper({
  popperRef,
  id,
  setArrowRef,
  styles,
  attributes,
}: Readonly<DeleteSectionPopperProps>) {
  const dispatch = useAppDispatch()
  return (
    <Portal>
      <motion.div
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        transition={{
          duration: 0.2,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        key={'popper-' + id}
        className={cx(
          'rounded-md border border-yellow-900 bg-gray-700/50 text-sm text-white shadow-lg backdrop-blur-md',
          popperStyles.itemDescriptionPopper
        )}
      >
        <div ref={setArrowRef} style={styles.arrow} key={'arrow-' + id} />
        <div className="flex w-full flex-col" key={'popper-content-' + id}>
          <div className="mb-1 flex items-center border-b border-yellow-900 pb-1">
            <span className="mr-2 flex items-center justify-center rounded-full bg-brand-dark p-1">
              <Icon icon={trashIcon} className="h-5 w-5 text-white" inline={true} />
            </span>
            <h3 className="font-body text-lg font-semibold text-red-400">Confirm delete</h3>
          </div>
          <p className="text-gray-200">Are you sure you want to delete this section?</p>
          <div className="mt-2 flex w-full flex-row space-x-2">
            <button
              className="inline-flex grow items-center justify-center rounded-md border-2 border-gray-500 bg-transparent px-2 py-1 text-center transition-colors duration-200 ease-out hover:bg-gray-700"
              onClick={() => dispatch(setBuildDeletePopup(null))}
            >
              Cancel
            </button>
            <button
              className="flex grow items-center justify-center rounded-md bg-brand-dark px-2 py-1 transition-colors duration-200 ease-out hover:bg-red-800"
              onClick={() => {
                dispatch(removeBlock(id))
                dispatch(setBuildDeletePopup(null))
              }}
            >
              <Icon icon={trashIcon} className="mr-1 h-5 w-5 text-gray-300" inline={true} />
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </Portal>
  )
}
