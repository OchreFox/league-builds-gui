import Image from 'next/image'

import { css, cx } from '@emotion/css'
import React from 'react'
import { useSelector } from 'react-redux'

import { CSSProperty, ItemsSchema } from '../types/Items'
import { CustomLoader } from '../utils/CustomLoader'
import { selectPotatoMode } from './store/potatoModeSlice'

export const ItemIcon = ({
  size,
  isMythic,
  hoveredItem,
  item,
  usePotatoMode,
  className,
}: {
  size?: number
  isMythic: boolean
  hoveredItem: number | null
  item: ItemsSchema
  usePotatoMode(value: string, propertyType: CSSProperty): string
  className?: string
}) => {
  const potatoMode = useSelector(selectPotatoMode)
  return (
    <div
      className={cx(
        'border border-black object-cover ring-1 ring-yellow-700 duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125 flex',
        potatoMode ? 'transition-none' : 'transition',
        !isMythic &&
          hoveredItem !== null &&
          item.id !== hoveredItem &&
          css`
      opacity: ${usePotatoMode('0.5;', CSSProperty.OPACITY)}
      transition-property: ${usePotatoMode(
        'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;',
        CSSProperty.TRANSITION_PROPERTY
      )};
    `,
        className
      )}
    >
      <Image
        loader={CustomLoader}
        width={size ?? 50}
        height={size ?? 50}
        src={item.icon ?? ''}
        alt={item.name ?? ''}
        placeholder="blur"
        blurDataURL={item.placeholder}
      />
    </div>
  )
}
