import React, { useCallback } from 'react'

import { cx } from '@emotion/css'
import { Portal } from '@headlessui/react'
import gripHorizontal from '@iconify/icons-tabler/grip-horizontal'
import minusIcon from '@iconify/icons-tabler/minus'
import plusIcon from '@iconify/icons-tabler/plus'
import trashIcon from '@iconify/icons-tabler/trash'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { batch } from 'react-redux'

import styles from '@/components/ItemBuild/BuildItemContextMenu.module.scss'
import { setBuildItemContextMenuShow } from '@/store/appSlice'
import { removeItemFromBlock } from '@/store/itemBuildSlice'
import { useAppDispatch } from '@/store/store'

export const BuildItemContextMenu = ({
  id,
  blockId,
  anchorPoint,
  show,
}: {
  id: string
  blockId: string
  anchorPoint: { x: number; y: number }
  show: boolean
}) => {
  const dispatch = useAppDispatch()

  const handleDeleteItem = useCallback(() => {
    batch(() => {
      dispatch(removeItemFromBlock({ blockId, id }))
      dispatch(setBuildItemContextMenuShow(false))
    })
  }, [blockId, dispatch, id])

  return (
    <Portal>
      <motion.div
        className={cx(
          'absolute z-30 mt-2 inline-block w-56 origin-top-right rounded-md border border-league-gold text-left drop-shadow-xl backdrop-blur-md',
          styles.contextMenu
        )}
        style={{ left: anchorPoint.x - 224, top: anchorPoint.y + 8 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.1 }}
      >
        <ul className="divide-y divide-gray-600 text-white">
          <li className="grid w-full grid-cols-2 divide-x divide-gray-600 rounded-t-md">
            <button className="group flex items-center justify-center px-4 py-2 text-sm hover:bg-red-700/50">
              <Icon icon={minusIcon} className="h-5 w-5 text-red-400 group-hover:text-white" aria-hidden="true" />
            </button>
            <button className="group flex items-center justify-center px-4 py-2 text-sm hover:bg-green-700/50">
              <Icon icon={plusIcon} className="h-5 w-5 text-green-400 group-hover:text-white" aria-hidden="true" />
            </button>
          </li>
          <li className="brightness-50 hover:bg-slate-500">
            <a href="#" className="group flex cursor-not-allowed items-center px-4 py-2 text-sm">
              <Icon
                icon={gripHorizontal}
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-200"
                aria-hidden="true"
              />
              Change Hotkey
            </a>
          </li>
          <button
            className="group flex w-full items-center px-4 py-2 text-sm hover:bg-slate-500"
            onClick={handleDeleteItem}
          >
            <Icon
              icon={trashIcon}
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-200"
              aria-hidden="true"
            />
            Delete
          </button>
        </ul>
      </motion.div>
    </Portal>
  )
}
