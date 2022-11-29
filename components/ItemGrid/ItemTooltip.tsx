import { selectPotatoMode } from '@/store/potatoModeSlice'
import { cx } from '@emotion/css'
// SVG imports
import goldIcon from 'public/icons/gold.svg?url'
import React from 'react'
import JsxParser from 'react-jsx-parser'
import { useSelector } from 'react-redux'
import { ItemsSchema } from 'types/Items'

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
  Tooltip,
  TrueDamage,
  setPopperBg,
} from './ItemComponents'
import { ItemIcon } from './ItemIcon'

export function ItemTooltip({
  popperRef,
  styles,
  attributes,
  setArrowRef,
  isMythic,
  hoveredItem,
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
  isMythic: boolean
  hoveredItem: number | null
  item: ItemsSchema
}): JSX.Element {
  const potatoMode = useSelector(selectPotatoMode)
  return (
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
      key={'popper-' + item.id}
      className={cx(!potatoMode && 'backdrop-blur-md', setPopperBg(potatoMode))}
    >
      <div ref={setArrowRef} style={styles.arrow} id="arrow" key={'arrow-' + item.id} />
      {/* Item information */}
      <div className="flex flex-col w-full" key={'popper-content-' + item.id}>
        <div className="flex w-full">
          <ItemIcon isMythic={isMythic} hoveredItem={hoveredItem} item={item} size={35} addPlaceholder={false} />
          <div className="flex justify-between border-b border-yellow-900 pb-1 ml-4 w-full">
            <h3 className="font-body font-semibold text-gray-200">{item.name}</h3>
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
              renderError={(error) => <div className="text-red-500">{`${error}`}</div>}
            />
          )}
        </div>
      </div>
    </Tooltip>
  )
}
