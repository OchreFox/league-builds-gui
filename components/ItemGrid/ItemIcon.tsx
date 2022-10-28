import Image from 'next/image'

import { selectPotatoMode } from '@/store/potatoModeSlice'
import { css, cx } from '@emotion/css'
import React from 'react'
import { useSelector } from 'react-redux'
import { CSSProperty, ItemsSchema } from 'types/Items'

import CustomLoader from 'utils/CustomLoader'

export const ItemIcon = ({
  size,
  isMythic,
  hoveredItem,
  item,
  className,
}: {
  size?: number
  isMythic: boolean
  hoveredItem: number | null
  item: ItemsSchema
  className?: string
}) => {
  const potatoMode = useSelector(selectPotatoMode)

  function disableAnimations(propertyType: CSSProperty) {
    switch (propertyType) {
      case CSSProperty.OPACITY:
        return `1;`
      case CSSProperty.TRANSFORM:
      case CSSProperty.ANIMATION:
      case CSSProperty.TRANSITION_PROPERTY:
        return `none;`
    }
  }
  return (
    <div
      className={cx(
        'border border-black object-cover ring-1 ring-yellow-700 duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125 flex',
        potatoMode ? 'transition-none' : 'transition',
        !isMythic &&
          hoveredItem !== null &&
          item.id !== hoveredItem &&
          css`
      opacity: ${potatoMode ? disableAnimations(CSSProperty.OPACITY) : '0.5;'}
      transition-property: ${
        potatoMode
          ? disableAnimations(CSSProperty.TRANSITION_PROPERTY)
          : 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;'
      };
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
