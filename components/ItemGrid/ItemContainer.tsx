import React, { useCallback, useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { batch } from 'react-redux'
import { ItemContainerState } from 'types/FilterProps'

import { gridContainerVariants, transitionVariant } from '@/components/ItemGrid/ItemGridComponents'
import { StandardItem } from '@/components/ItemGrid/StandardItem'
import {
  setItemPickerContainerAnimation,
  setItemPickerContainerColumns,
  setItemPickerContainerGridHeight,
  setItemPickerContainerRows,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

export const ItemContainer = ({ gridKey, itemsCombined, rarity, itemRefArray, itemGridRef }: ItemContainerState) => {
  const dispatch = useAppDispatch()
  const listRef = useRef<HTMLUListElement>(null)

  const setAnimation = useCallback(
    (value: boolean) => {
      dispatch(setItemPickerContainerAnimation({ animation: value, rarity: rarity }))
    },
    [dispatch, rarity]
  )

  useEffect(() => {
    if (listRef.current) {
      const grid = listRef.current
      // console.log(grid.scrollTop, grid.scrollHeight, grid.clientHeight)
      const height = Math.ceil(grid.getBoundingClientRect().height)

      // Get count of rows and columns in the grid
      const gridStyles = window.getComputedStyle(grid)
      const gridTemplateColumns = gridStyles.getPropertyValue('grid-template-columns')
      const gridTemplateRows = gridStyles.getPropertyValue('grid-template-rows')
      const columnCount = gridTemplateColumns.split(' ').length
      const rowCount = gridTemplateRows.split(' ').length

      batch(() => {
        dispatch(setItemPickerContainerGridHeight({ height: height, rarity: rarity }))
        dispatch(setItemPickerContainerRows({ rows: rowCount, rarity: rarity }))
        dispatch(setItemPickerContainerColumns({ columns: columnCount, rarity: rarity }))
      })
    }
  }, [dispatch, itemsCombined, rarity])

  // On dismount, reset values to 0
  useEffect(() => {
    return () => {
      batch(() => {
        dispatch(setItemPickerContainerGridHeight({ height: 0, rarity: rarity }))
        dispatch(setItemPickerContainerRows({ rows: 0, rarity: rarity }))
        dispatch(setItemPickerContainerColumns({ columns: 0, rarity: rarity }))
      })
    }
  }, [dispatch, rarity])

  return !itemsCombined || itemsCombined.length === 0 ? null : (
    <motion.ul
      key={gridKey}
      id={'item-grid-' + rarity.toLowerCase()}
      ref={listRef}
      variants={gridContainerVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transitionVariant}
      className="item-grid mb-2 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-7 3xl:grid-cols-9"
      onAnimationStart={() => setAnimation(true)}
      onAnimationComplete={() => setAnimation(false)}
    >
      <AnimatePresence>
        {itemsCombined.map((item) => (
          <StandardItem key={'item-' + item.id} item={item} itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
ItemContainer.defaultProps = {
  mythic: false,
}
