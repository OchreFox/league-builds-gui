import { useItems } from '@/hooks/useItems'
import { selectBuild, setBuildItemContextMenuItem, setBuildItemContextMenuShow } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ItemsSchema } from 'types/Items'

import { ItemIcon } from 'components/ItemGrid/ItemIcon'

import { isMythic } from 'utils/ItemRarity'

import styles from './BuildItem.module.scss'
import { BuildItemContextMenu } from './BuildItemContextMenu'
import { easeOutExpo } from './BuildMakerComponents'

const BuildItem = ({
  itemId,
  itemUid,
  blockId,
  index,
}: {
  itemId: number
  itemUid: string
  blockId: string
  index: number
}) => {
  const { items } = useItems()
  const dispatch = useAppDispatch()
  const { itemContextMenu } = useSelector(selectBuild)

  const [item, setItem] = useState<ItemsSchema | null>(null)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      setAnchorPoint({ x: e.pageX, y: e.pageY })
      dispatch(setBuildItemContextMenuShow(true))
      dispatch(setBuildItemContextMenuItem(itemId))
    },
    [itemContextMenu, setAnchorPoint]
  )

  useEffect(() => {
    if (items) {
      setItem(Object.values(items).find((item) => item.id === itemId) || null)
    }
  }, [itemId, items])

  // Add document event listener to close context menu
  useEffect(() => {
    const closeContextMenu = () => {
      dispatch(setBuildItemContextMenuShow(false))
    }
    document.addEventListener('click', closeContextMenu)
    return () => {
      document.removeEventListener('click', closeContextMenu)
    }
  }, [itemContextMenu])

  if (!item) {
    return null
  }

  return (
    <motion.div
      className={cx('flex flex-col items-center text-center relative group select-none', styles.animatedTileBg)}
      onContextMenu={(e) => handleContextMenu(e)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={easeOutExpo}
    >
      <button
        className={cx(
          'border border-transparent focus:border-yellow-900 flex flex-col items-center justify-center w-full h-full px-4 py-2 hover:bg-black/25 focus:bg-black/50',
          styles.animatedTileBgOverlay
        )}
      >
        <ItemIcon item={item} isMythic={isMythic(item)} hoveredItem={null} />
        <p className="font-sans text-gray-200 group-hover:text-yellow-200 select-none">{item.gold?.total}</p>
      </button>
      <AnimatePresence>
        {itemContextMenu.show && itemContextMenu.item === itemId && (
          <BuildItemContextMenu
            blockId={blockId}
            itemUid={itemUid}
            anchorPoint={anchorPoint}
            show={itemContextMenu.show}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BuildItem
