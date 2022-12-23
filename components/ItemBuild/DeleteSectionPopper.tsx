import { setBuildDeletePopup } from '@/store/appSlice'
import { removeBlock } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Portal } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { batch, useSelector } from 'react-redux'
import { DeleteSectionPopperProps } from 'types/Build'

import { Tooltip, setPopperBg } from 'components/ItemGrid/ItemComponents'

export function DeleteSectionPopper({ popperRef, id, setArrowRef, styles, attributes }: DeleteSectionPopperProps) {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  return (
    <Portal>
      <Tooltip
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
          <p className="text-gray-200">Are you sure you want to delete this section?</p>
          <div className="flex flex-row w-full mt-2">
            <button
              className="mr-2 px-2 py-1 bg-brand-dark hover:bg-red-800 transition-colors duration-200 ease-out rounded-md flex grow items-center justify-center"
              onClick={() => {
                batch(() => {
                  dispatch(removeBlock(id))
                  dispatch(setBuildDeletePopup(null))
                })
              }}
            >
              <Icon icon="tabler:trash" className="h-5 w-5 text-gray-300 mr-1" inline={true} />
              Delete
            </button>
            <button
              className="px-2 py-1 bg-transparent hover:bg-gray-700 transition-colors duration-200 ease-out rounded-md inline-flex grow items-center border-2 border-gray-500 text-center justify-center"
              onClick={() => dispatch(setBuildDeletePopup(null))}
            >
              <Icon icon="tabler:x" className="h-5 w-5 text-gray-300 mr-1" inline={true} />
              Cancel
            </button>
          </div>
        </div>
      </Tooltip>
    </Portal>
  )
}
