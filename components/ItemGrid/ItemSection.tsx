import {
  selectItemFilters,
  selectItemPicker,
  setItemFiltersRarity,
  setItemPickerContainerHeight,
  setItemPickerContainerTitleHeight,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import React, { RefObject, useEffect, useMemo, useRef } from 'react'
import { batch, useSelector } from 'react-redux'
import { ItemFilters } from 'types/App'
import { ItemRefArrayType, ItemSectionState, Rarity } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { ItemContainer } from './ItemContainer'
import { getPluralFromItems, itemSectionConstants, titleVariants, transitionVariant } from './ItemGridComponents'
import { RarityTitle } from './RarityTitle'

const ItemSection = ({ items, rarity, tier, itemRefArray, itemGridRef }: ItemSectionState) => {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const itemPicker = useSelector(selectItemPicker)
  const rarityConstants = itemSectionConstants[rarity]
  const itemCount = useMemo(() => itemPicker.containers[rarity].count, [itemPicker.containers])

  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const fallbackTitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      const height = titleRef.current.getBoundingClientRect().height
      dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: height }))
    } else {
      const height = fallbackTitleRef.current?.getBoundingClientRect().height ?? 0
      dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: height }))
    }
    if (containerRef.current) {
      const height = Math.ceil(containerRef.current.getBoundingClientRect().height)
      dispatch(setItemPickerContainerHeight({ rarity: rarity, height: height }))
    }
  }, [items, titleRef.current])

  useEffect(() => {
    return () => {
      batch(() => {
        dispatch(setItemPickerContainerHeight({ rarity: rarity, height: 0 }))
        dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: 0 }))
      })
    }
  }, [])

  return (
    <div ref={containerRef} id={'container-' + rarity.toLowerCase()}>
      {itemFilters.rarity === Rarity.Empty || itemFilters.rarity === rarity ? (
        <>
          <RarityTitle
            rarity={rarity}
            ref={titleRef}
            variants={titleVariants}
            transition={transitionVariant}
            tier={tier}
            backgroundColor={rarityConstants.backgroundColor}
            fallbackBackgroundColor={rarityConstants.fallbackBackgroundColor}
          />
          <ItemContainer
            gridKey={rarity + 'Grid'}
            itemsCombined={items}
            rarity={rarity}
            itemRefArray={itemRefArray}
            itemGridRef={itemGridRef}
          />
        </>
      ) : (
        <motion.p
          ref={fallbackTitleRef}
          variants={titleVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionVariant}
          key="basicItemsHidden"
          className={cx(
            'mb-2 cursor-pointer italic text-gray-400 underline-offset-1 hover:underline',
            rarityConstants.decorationColor
          )}
          onClick={() => dispatch(setItemFiltersRarity(rarity))}
        >
          {itemCount}{' '}
          <span className={rarityConstants.textColor}>
            <b>{rarity}</b>
          </span>{' '}
          {getPluralFromItems(itemCount)} hidden.
        </motion.p>
      )}
    </div>
  )
}

export default ItemSection
