import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { ItemSectionState, Rarity } from '@/types/FilterProps'

import { ItemContainer } from '@/components/ItemGrid/ItemContainer'
import {
  getPluralFromItems,
  itemSectionConstants,
  titleVariants,
  transitionVariant,
} from '@/components/ItemGrid/ItemGridComponents'
import { RarityTitle } from '@/components/ItemGrid/RarityTitle'
import {
  selectItemFilters,
  selectItemPicker,
  setItemFiltersRarity,
  setItemPickerContainerAnimation,
  setItemPickerContainerHeight,
  setItemPickerContainerTitleHeight,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

const ItemSection = ({ items, rarity, tier, itemRefArray, itemGridRef }: ItemSectionState) => {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const itemPicker = useSelector(selectItemPicker)
  const rarityConstants = itemSectionConstants[rarity]
  const itemCount = useMemo(() => itemPicker.containers[rarity].count, [itemPicker.containers, rarity])

  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const fallbackTitleRef = useRef<HTMLButtonElement>(null)

  const titleStyle = useMemo(() => {
    if (titleRef.current) {
      return window.getComputedStyle(titleRef.current)
    } else if (fallbackTitleRef.current) {
      return window.getComputedStyle(fallbackTitleRef.current)
    }
    return {
      marginTop: '0px',
      marginBottom: '0px',
    }
  }, [])

  const setAnimation = useCallback(
    (value: boolean) => {
      dispatch(setItemPickerContainerAnimation({ animation: value, rarity: rarity }))
    },
    [dispatch, rarity]
  )

  useEffect(() => {
    // Title height
    if (titleRef.current) {
      const height =
        titleRef.current.getBoundingClientRect().height +
        parseInt(titleStyle.marginTop) +
        parseInt(titleStyle.marginBottom)
      dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: height }))
    } else if (fallbackTitleRef.current) {
      const height =
        fallbackTitleRef.current.getBoundingClientRect().height +
        parseInt(titleStyle.marginTop) +
        parseInt(titleStyle.marginBottom)
      dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: height }))
    }
    // Container height
    if (containerRef.current) {
      const height = Math.ceil(containerRef.current.getBoundingClientRect().height)
      dispatch(setItemPickerContainerHeight({ rarity: rarity, height: height }))
    }
  }, [items, titleStyle.marginTop, titleStyle.marginBottom, dispatch, rarity])

  useEffect(() => {
    return () => {
      dispatch(setItemPickerContainerHeight({ rarity: rarity, height: 0 }))
      dispatch(setItemPickerContainerTitleHeight({ rarity: rarity, height: 0 }))
    }
  }, [dispatch, rarity])

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
        <motion.button
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
          onAnimationStart={() => setAnimation(true)}
          onAnimationComplete={() => setAnimation(false)}
        >
          {itemCount}{' '}
          <span className={rarityConstants.textColor}>
            <b>{rarity}</b>
          </span>{' '}
          {getPluralFromItems(itemCount)} hidden.
        </motion.button>
      )}
    </div>
  )
}

export default ItemSection
