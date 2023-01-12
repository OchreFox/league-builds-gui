import { cx } from '@emotion/css'
import { Portal } from '@headlessui/react'
import gripHorizontal from '@iconify/icons-tabler/grip-horizontal'
import minusIcon from '@iconify/icons-tabler/minus'
import plusIcon from '@iconify/icons-tabler/plus'
import trashIcon from '@iconify/icons-tabler/trash'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React from 'react'

import styles from './BuildItemContextMenu.module.scss'

export const BuildItemContextMenu = ({
  blockId,
  itemUid,
  anchorPoint,
  show,
}: {
  blockId: string
  itemUid: string
  anchorPoint: { x: number; y: number }
  show: boolean
}) => {
  return (
    <Portal>
      <motion.div
        className="absolute z-20 inline-block text-left"
        style={{ left: anchorPoint.x, top: anchorPoint.y }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.1 }}
      >
        <div className={styles.contextMenu}>
          <ul className="divide-y divide-gray-600 text-white overflow-hidden">
            <li className="rounded-t-md grid grid-cols-2 divide-x divide-gray-600 brightness-50">
              <a
                href="#"
                className="group flex items-center justify-center px-4 py-2 text-sm hover:bg-red-700/50 cursor-not-allowed"
              >
                <Icon icon={minusIcon} className="h-5 w-5 text-red-400 group-hover:text-white" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="group flex items-center justify-center px-4 py-2 text-sm hover:bg-green-700/50 cursor-not-allowed"
              >
                <Icon icon={plusIcon} className="h-5 w-5 text-green-400 group-hover:text-white" aria-hidden="true" />
              </a>
            </li>
            <li className="hover:bg-slate-500 brightness-50">
              <a href="#" className="group flex items-center px-4 py-2 text-sm cursor-not-allowed">
                <Icon
                  icon={gripHorizontal}
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-200"
                  aria-hidden="true"
                />
                Change Hotkey
              </a>
            </li>
            <li className="hover:bg-slate-500 rounded-b-md brightness-50">
              <a href="#" className="group flex items-center px-4 py-2 text-sm cursor-not-allowed">
                <Icon
                  icon={trashIcon}
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-200"
                  aria-hidden="true"
                />
                Delete
              </a>
            </li>
            <li className="hover:bg-slate-500 rounded-b-md text-center bg-slate-800">
              <p className="group flex justify-center items-center px-4 py-2 text-sm font-bold cursor-help">
                Coming Soon!
              </p>
            </li>
          </ul>
        </div>
      </motion.div>
    </Portal>
  )
}
