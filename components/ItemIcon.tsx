import Image from 'next/image'

import { css, cx } from '@emotion/css'
import React from 'react'

import { CSSProperty, ItemsSchema } from '../types/Items'
import { PotatoModeInterface } from '../types/Store'
import { CustomLoader } from '../utils/ImageLoader'

export const ItemIcon = ({
  state,
  isMythic,
  hoveredItem,
  item,
  usePotatoMode,
}: {
  state: PotatoModeInterface
  isMythic: boolean
  hoveredItem: number | null
  item: ItemsSchema
  usePotatoMode(value: string, propertyType: CSSProperty): string
}) => {
  return (
    <div
      className={cx(
        'border border-black object-cover ring-1 ring-yellow-700 duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125 flex',
        state.enabled ? 'transition-none' : 'transition',
        !isMythic &&
          hoveredItem !== null &&
          item.id !== hoveredItem &&
          css`
      opacity: ${usePotatoMode('0.5;', CSSProperty.OPACITY)}
      transition-property: ${usePotatoMode(
        'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;',
        CSSProperty.TRANSITION_PROPERTY
      )};
    `
      )}
    >
      <Image
        loader={CustomLoader}
        width={50}
        height={50}
        src={item.icon ?? ''}
        alt={item.name ?? ''}
        placeholder="blur"
        blurDataURL={item.placeholder}
      />
    </div>
  )
}
