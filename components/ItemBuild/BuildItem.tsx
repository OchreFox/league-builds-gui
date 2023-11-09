// https://github.com/clauderic/dnd-kit/blob/33e6dd2dc954f1f2da90d8f8af995021031b6b41/stories/2%20-%20Presets/Sortable/FramerMotion.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cx } from '@emotion/css'
import { ItemIcon } from 'components/ItemGrid/ItemIcon'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { ItemsSchema } from 'types/Items'

import styles from '@/components/ItemBuild/BuildItem.module.scss'
import { BuildItemContextMenu } from '@/components/ItemBuild/BuildItemContextMenu'
import {
  removeBuildAnimationQueueItem,
  selectBuild,
  setBuildItemContextMenuItem,
  setBuildItemContextMenuShow,
  setItemPickerSelectedItem,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import { easeOutExpo } from 'utils/Transition'

const baseStyles: React.CSSProperties = {
  position: 'relative',
  width: 140,
  height: 140,
}

const initialStyles = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
}

const BuildItem = ({
  id,
  itemId,
  item,
  blockId,
}: {
  id: string
  itemId: number
  item: ItemsSchema | null
  blockId: string
}) => {
  const dispatch = useAppDispatch()
  const { itemContextMenu, animationQueue } = useSelector(selectBuild)

  const { attributes, setNodeRef, listeners, transform, isDragging, transition } = useSortable({
    id: id,
  })

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const shouldAnimate = useMemo(() => {
    return animationQueue.find((q) => q.blockId === blockId)?.items.find((i) => i === id)
  }, [animationQueue, blockId, id])

  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })

  const handleClick = () => {
    dispatch(setItemPickerSelectedItem(item))
  }

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      setAnchorPoint({ x: e.pageX, y: e.pageY })
      dispatch(setBuildItemContextMenuShow(true))
      dispatch(setBuildItemContextMenuItem(itemId))
    },
    [dispatch, itemId]
  )

  const handleAnimationComplete = useCallback(() => {
    setTimeout(() => {
      dispatch(
        removeBuildAnimationQueueItem({
          blockId: blockId,
          itemId: id,
        })
      )
    }, 500)
  }, [blockId, dispatch, id])

  // Add document event listener to close context menu
  useEffect(() => {
    const closeContextMenu = () => {
      dispatch(setBuildItemContextMenuShow(false))
    }
    document.addEventListener('click', closeContextMenu)
    return () => {
      document.removeEventListener('click', closeContextMenu)
    }
  }, [dispatch, itemContextMenu])

  if (!item) {
    return null
  }

  return (
    <motion.div
      className={cx('group flex flex-col items-center text-center', shouldAnimate && styles.animatedTileBg)}
      onContextMenu={(e) => handleContextMenu(e)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={easeOutExpo}
      onAnimationComplete={handleAnimationComplete}
    >
      <button
        ref={setNodeRef}
        className={cx(
          'flex h-full w-full flex-col items-center justify-center border border-transparent px-4 py-2 hover:bg-black/25',
          shouldAnimate && styles.animatedTileBgOverlay,
          isDragging && 'opacity-50'
        )}
        style={sortableStyle}
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        <ItemIcon item={item} usePlaceholder={false} />
        <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
      </button>
      <AnimatePresence>
        {itemContextMenu.show && itemContextMenu.item === itemId && (
          <BuildItemContextMenu id={id} blockId={blockId} anchorPoint={anchorPoint} show={itemContextMenu.show} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BuildItem
