import Image from 'next/image'

import { css, cx } from '@emotion/css'
import React from 'react'

import { CSSProperty, ItemsSchema } from '../types/Items'
import { PotatoModeInterface } from '../types/Store'
import { StaticallyLoader } from '../utils/ImageLoader'

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
        loader={StaticallyLoader}
        width={50}
        height={50}
        src={item.icon ?? ''}
        alt={item.name ?? ''}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzNjAgMzYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzNjAgMzYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMjA5LjQsMzMuNGMtMjQuMi04LjQtNDMuNy03LjQtNjguNywzLjNjLTIzLjgsMTAuNC00OCwzMi40LTU4LjMsNTMuNWMtOS45LDIwLjQtMTAuOSwyNy4zLTEyLjYsNzguNQ0KCQljLTAuNywyNS41LTIuMiw0OC44LTMsNTEuOGMtMi4zLDctOS4zLDE4LjktMTIuNiwyMS44Yy0zLjgsMy0zLjMsNi41LDIuNSwyMWM2LjYsMTcsMTguMiwzNS4zLDI5LDQ2YzEwLjQsMTAuNCwyOSwyMC4yLDQxLjcsMjEuNw0KCQlsOC44LDEuMmwtNS04LjFjLTE1LjItMjQuNy0xNy40LTYwLjMtNS44LTk3YzIuMy03LjEsMy44LTEzLjYsMy4zLTE0LjRjLTAuNS0wLjgtMy0yLTUuNS0yLjZjLTcuNC0xLjgtMTguNC05LjEtMjQuNS0xNi4yDQoJCWMtOS44LTExLjQtMTEuMy0yNC43LTQuOC00MC45bDIuOC03bDguOSwxYzE5LjIsMi4zLDM4LjQsMTMuMiw1MC4yLDI4LjVsNyw4LjhsLTAuMiwzOS42bC0wLjMsMzkuNmw0LjMsNS4zDQoJCWMyLjUsMi44LDYuNSw2LjYsOS4xLDguNGw0LjYsMy4zbDguNC03LjZsOC40LTcuNnYtNDAuOXYtNDEuMWw0LjYtNi41YzEyLjYtMTcuNCwzNi42LTMwLjUsNTUuOS0zMC41YzQuOCwwLDUuNiwwLjcsNy45LDcuOA0KCQljNCwxMS40LDMuNSwyNS0xLjIsMzMuOGMtNC41LDguMy0xNS45LDE3LjctMjYuMywyMS41Yy04LjQsMy4xLTguNCwzLjUtMi4yLDIzLjhjNC4xLDEzLjIsNC42LDE3LjQsNC44LDM4LjkNCgkJYzAuMiwyNi44LTEuMywzMy42LTExLjQsNTAuNWwtNS44LDkuNmw4LjYtMS4yYzEyLjctMS41LDMxLjUtMTEuMyw0MS43LTIxLjdjNC44LTQuOCwxMi4yLTE0LjIsMTYuNC0yMC45DQoJCWM3LjQtMTEuOSwxNy43LTM1LjYsMTcuNy00MC42YzAtMS4zLTMtNi4xLTYuNi0xMC44Yy0zLjUtNC41LTcuMy0xMS4xLTguNC0xNC40Yy0xLTMuNS0yLjUtMjYuNS0zLjEtNTMuM2MtMS0zNC4zLTIuMi00OS44LTQtNTcuMQ0KCQlDMjc2LjQsNzYuNSwyNDcuNCw0Ni41LDIwOS40LDMzLjR6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="
      />
    </div>
  )
}
