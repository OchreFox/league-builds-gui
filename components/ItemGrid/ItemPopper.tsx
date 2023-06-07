import React, { useCallback, useMemo } from 'react'

import { cx } from '@emotion/css'
import { RarityIcon } from 'components/ItemFilters/FilterItemsByRarity'
import { motion } from 'framer-motion'
// SVG imports
import goldIcon from 'public/icons/gold.svg?url'
import JsxParser from 'react-jsx-parser'
import { useSelector } from 'react-redux'
import { ItemsSchema } from 'types/Items'

import { selectPotatoMode } from '@/store/potatoModeSlice'

import { getRarity } from 'utils/ItemRarity'

import {
  Active,
  Attention,
  FlavorText,
  Healing,
  KeywordStealth,
  MagicDamage,
  MainText,
  Passive,
  PhysicalDamage,
  RarityGeneric,
  RarityLegendary,
  RarityMythic,
  Rules,
  ScaleLevel,
  ScaleMana,
  Stat,
  Stats,
  Status,
  TrueDamage,
} from './ItemComponents'
import { itemSectionConstants } from './ItemGridComponents'
import { ItemIcon } from './ItemIcon'
import popperStyles from './ItemPopper.module.scss'

export function ItemPopper({
  popperRef,
  styles,
  attributes,
  setArrowRef,
  item,
}: {
  popperRef: React.MutableRefObject<null>
  styles: {
    [key: string]: React.CSSProperties
  }
  attributes: {
    [key: string]:
      | {
          [key: string]: string
        }
      | undefined
  }
  setArrowRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>
  item: ItemsSchema
}): JSX.Element {
  const rarity = useMemo(() => getRarity(item), [item])

  const renderError = useCallback(
    (props: { error: string }) => <div className="text-red-500">{`${props.error}`}</div>,
    []
  )

  return (
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
      key={'popper-' + item.id}
      className={popperStyles.itemDescriptionPopper}
    >
      <div ref={setArrowRef} style={styles.arrow} key={'arrow-' + item.id} />
      {/* Item information */}
      <div className="flex w-full flex-col" key={'popper-content-' + item.id}>
        <div className="flex items-center">
          <ItemIcon item={item} size={50} />
          <div className="ml-4 flex w-full grow flex-row justify-between border-b border-yellow-900 pb-1">
            <motion.div className="pointer-events-none flex flex-col font-body font-semibold text-gray-200">
              <span>{item.name}</span>
              <span className={cx('text-sm', itemSectionConstants[rarity].textColor)}>{rarity}</span>
            </motion.div>
            <p className="inline-flex items-center font-sans font-bold text-yellow-600">
              <img className="mr-1 h-5 w-5" src={goldIcon} alt="gold" />
              <span className="ml-1">{item.gold?.total}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          {item.description && (
            <JsxParser // autoCloseVoidElements
              bindings={{
                item: item,
              }}
              components={{
                Active,
                Attention,
                FlavorText,
                Healing,
                KeywordStealth,
                MagicDamage,
                MainText,
                Passive,
                PhysicalDamage,
                RarityGeneric,
                RarityLegendary,
                RarityMythic,
                Rules,
                ScaleLevel,
                ScaleMana,
                Status,
                TrueDamage,
                Stats,
                Stat,
              }}
              jsx={item.description}
              showWarnings={true}
              renderError={renderError}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
