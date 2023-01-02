// https://github.com/clauderic/dnd-kit/blob/33e6dd2dc954f1f2da90d8f8af995021031b6b41/stories/2%20-%20Presets/Sortable/FramerMotion.tsx
import { useItems } from '@/hooks/useItems'
import { selectBuild, setBuildItemContextMenuItem, setBuildItemContextMenuShow } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { useSortable } from '@dnd-kit/sortable'
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

const initialStyles = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
}

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

  const { attributes, setNodeRef, listeners, transform, isDragging } = useSortable({
    id: itemUid,
    transition: null,
  })

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

  useEffect(() => {
    if (isDragging) {
      console.log('dragging', transform)
    } else {
      console.log('not dragging')
    }
  }, [isDragging, transform])

  if (!item) {
    return null
  }

  return (
    <motion.div
      className={cx('flex flex-col items-center text-center relative group', styles.animatedTileBg)}
      onContextMenu={(e) => handleContextMenu(e)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={easeOutExpo}
    >
      <motion.button
        className={cx(
          'relative border border-transparent flex flex-col items-center justify-center w-full h-full px-4 py-2 hover:bg-black/25',
          styles.animatedTileBgOverlay
        )}
        ref={setNodeRef}
        layoutId={itemUid}
        transition={{
          duration: !isDragging ? 0.25 : 0,
          easings: {
            type: 'spring',
          },
          scale: {
            duration: 0.25,
          },
          zIndex: {
            delay: isDragging ? 0 : 0.25,
          },
        }}
        animate={
          transform
            ? {
                x: transform.x,
                y: transform.y,
                scale: isDragging ? 1.05 : 1,
                zIndex: isDragging ? 1 : 0,
                boxShadow: isDragging
                  ? '0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
                  : undefined,
              }
            : initialStyles
        }
        {...attributes}
        {...listeners}
      >
        <ItemIcon item={item} />
        <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
      </motion.button>
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
