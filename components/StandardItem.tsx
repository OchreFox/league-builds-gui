import Image from 'next/image'

import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import _ from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import JsxParser from 'react-jsx-parser'
import { usePopper } from 'react-popper'

// SVG imports
import goldIcon from '../public/icons/gold.svg?url'
import { StandardItemState } from '../types/FilterProps'
import { CSSProperty } from '../types/Items'
import { StaticallyLoader } from '../utils/ImageLoader'
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
import { PotatoModeContext } from './hooks/PotatoModeStore'

export const StandardItem = ({
  item,
  transition,
  hoveredItem,
  isMythic,
  selectedItem,
  setHoveredItem,
  setSelectedItem,
  itemRefArray,
}: StandardItemState) => {
  if (!item.icon) {
    console.warn('No src for item:', item.name)
    return null
  }
  if (!item.visible) {
    return null
  }
  const { state } = useContext(PotatoModeContext)
  const [showPopper, setShowPopper] = useState(false)
  const [mouseEnter, setMouseEnter] = useState(false)
  const buttonRef = useRef(null)
  const popperRef = useRef(null)
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(buttonRef.current, popperRef.current, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  })

  function usePotatoMode(value: string, propertyType: CSSProperty) {
    if (state.enabled) {
      switch (propertyType) {
        case CSSProperty.OPACITY:
          return `1;`
        case CSSProperty.TRANSFORM:
        case CSSProperty.ANIMATION:
        case CSSProperty.TRANSITION_PROPERTY:
          return `none;`
      }
    }
    return value
  }

  useEffect(() => {
    if (mouseEnter) {
      const timer = setTimeout(() => {
        setShowPopper(true)
        setHoveredItem(item.id)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setHoveredItem(null)
      setShowPopper(false)
    }
  }, [mouseEnter])

  const addToRefs = (el: HTMLDivElement | null) => {
    // console.log(el)
    if (el) {
      let itemRefArrayIndex = _.findIndex(itemRefArray.current, (itemRef) => itemRef.itemId === item.id)
      if (itemRefArrayIndex !== -1) {
        // console.log('found itemRefArrayIndex:', itemRefArrayIndex)
        itemRefArray.current[itemRefArrayIndex].ref.current = el
      }
    }
  }

  return (
    <div className="relative" ref={addToRefs}>
      <motion.div
        layout
        transition={transition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={item.id}
        className={cx(
          'group -m-1 flex cursor-pointer flex-col items-center px-2 py-2 text-center',
          css`
            border: 2px solid rgba(0, 0, 0, 0);
          `,
          selectedItem !== null &&
            selectedItem.id === item.id &&
            cx(
              css`
                &:before {
                  content: '';
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  z-index: -1;
                  background: linear-gradient(
                    180deg,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(204, 41, 54, 0.75) 50%,
                    rgba(0, 0, 0, 0) 100%
                  );
                  background-size: 600% 600%;

                  animation: ${usePotatoMode('scroll 10s linear infinite;', CSSProperty.ANIMATION)} @keyframes scroll {
                    0% {
                      background-position: 50% 0%;
                    }
                    100% {
                      background-position: 50% -600%;
                    }
                  }
                }

                border: 2px solid;
                box-sizing: content-box;
                @supports (background: paint(something)) {
                  border-image: linear-gradient(var(--angle), #12c2e9, #b9f5ff, #c471ed, #14fff5, #f64f59) 1;
                  animation: ${usePotatoMode('6s rotate linear infinite forwards;', CSSProperty.ANIMATION)} @keyframes
                    rotate {
                    to {
                      --angle: 360deg;
                    }
                  }
                  @property --angle {
                    syntax: '<angle>';
                    initial-value: 0deg;
                    inherits: false;
                  }
                }
                /* Rotate the gradient */
                --angle: 0deg;
                border-image: linear-gradient(var(--angle), #12c2e9, #b9f5ff, #c471ed, #14fff5, #f64f59) 1;
                animation: ${usePotatoMode('6s rotate linear infinite forwards;', CSSProperty.ANIMATION)} @keyframes
                  rotate {
                  from {
                    --angle: 0deg;
                  }
                  to {
                    --angle: 360deg;
                  }
                }
              `
            )
        )}
        ref={buttonRef}
        onMouseEnter={() => {
          setMouseEnter(true)
        }}
        onMouseLeave={() => {
          setMouseEnter(false)
        }}
        onClick={() => {
          // Toggle selectedItem
          if (selectedItem !== null && selectedItem.id === item.id) {
            setSelectedItem(null)
          } else {
            setSelectedItem(item)
          }
        }}
      >
        <div
          className={
            isMythic
              ? cx(
                  'relative inline-flex shrink-0 items-center justify-center border border-yellow-700',
                  css`
                      background: linear-gradient(
                        180deg,
                        rgba(234, 179, 8, 1) 0%,
                        rgba(161, 98, 7, 1) 50%,
                        rgba(205, 46, 52, 1) 100%
                      );
                      background-size: 400% 400%;
                      animation: ${usePotatoMode('Glow 3s ease infinite;', CSSProperty.ANIMATION)}
                      padding: 2px;
                      @keyframes Glow {
                        0% {
                          background-position: 50% 0%;
                        }
                        50% {
                          background-position: 50% 100%;
                        }
                        100% {
                          background-position: 50% 0%;
                        }
                      }
                    `,
                  hoveredItem !== null &&
                    item.id !== hoveredItem &&
                    css`
                        opacity: ${usePotatoMode('0.5;', CSSProperty.OPACITY)}
                        transition-property: ${usePotatoMode(
                          'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;',
                          CSSProperty.TRANSITION_PROPERTY
                        )};
                        transition-duration: 100ms;
                      `
                )
              : ''
          }
        >
          {/* Display the item icon */}
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
        </div>
        <p
          className={cx(
            'font-sans text-gray-200 group-hover:text-yellow-200',
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
          {item.gold?.total}
        </p>
      </motion.div>
      {showPopper
        ? createPortal(
            <Tooltip
              ref={popperRef}
              style={styles.popper}
              {...attributes.popper}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={'popper-' + item.id}
              className={cx(!state.enabled && 'backdrop-blur-md', setPopperBg(state.enabled))}
            >
              <div ref={setArrowRef} style={styles.arrow} id="arrow" key={'arrow-' + item.id} />
              {/* Item information */}
              <div className="flex flex-col" key={'popper-content-' + item.id}>
                <div className="flex justify-between border-b border-yellow-900 pb-1">
                  <h3 className="font-body font-semibold text-gray-200">{item.name}</h3>
                  <p className="inline-flex items-center font-sans text-yellow-600">
                    <img className="mr-1 h-5 w-5" src={goldIcon} alt="gold" />
                    <span className="ml-1">{item.gold?.total}</span>
                  </p>
                </div>
                <div className="flex flex-col">
                  {item.description && (
                    <JsxParser
                      // autoCloseVoidElements
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
                      renderError={(error) => <div className="text-red-500">{error}</div>}
                    />
                  )}
                </div>
              </div>
            </Tooltip>,
            document.querySelector('#item-container') as HTMLElement
          )
        : null}
    </div>
  )
}
