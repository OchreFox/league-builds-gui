import {
  selectItemPicker,
  setItemPickerDraggedItem,
  setItemPickerHoveredItem,
  setItemPickerSelectedItem,
} from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { StandardItemState } from 'types/FilterProps'
import { CSSProperty } from 'types/Items'

import { ItemIcon } from './ItemIcon'
import { ItemTooltip } from './ItemTooltip'

export const StandardItem = ({ item, transition, isMythic, itemRefArray }: StandardItemState) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { selectedItem, hoveredItem, draggedItem } = useSelector(selectItemPicker)
  const [showPopper, setShowPopper] = useState(false)
  const [mouseEnter, setMouseEnter] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
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

  useEffect(() => {
    if (mouseEnter && !buttonClick) {
      const timer = setTimeout(() => {
        setShowPopper(true)
        dispatch(setItemPickerHoveredItem(item.id))
      }, 500)
      return () => clearTimeout(timer)
    } else {
      dispatch(setItemPickerHoveredItem(null))
      setShowPopper(false)
    }
  }, [mouseEnter, buttonClick])

  useEffect(() => {
    if (buttonClick) {
      setShowPopper(false)
      dispatch(setItemPickerHoveredItem(null))
    }
  }, [buttonClick])

  const addToRefs = (el: HTMLElement | null) => {
    if (el) {
      let itemRefArrayIndex = _.findIndex(itemRefArray.current, (itemRef) => itemRef.itemId === item.id)
      if (itemRefArrayIndex !== -1) {
        itemRefArray.current[itemRefArrayIndex].ref.current = el
      }
    }
  }

  if (!item.icon) {
    console.warn('No src for item:', item.name)
    return null
  }
  if (!item.visible) {
    return null
  }
  return (
    <li
      data-item-id={item.id}
      className="relative list-none"
      ref={addToRefs}
      onDragStart={(e) => {
        dispatch(setItemPickerDraggedItem(item.id))
        e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({
            item: item,
            isMythic: isMythic,
          })
        )
        e.currentTarget.style.opacity = '0.4'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
        setButtonClick(true)
      }}
      onDragEnd={(e) => {
        dispatch(setItemPickerDraggedItem(null))
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        setButtonClick(false)
      }}
    >
      <>
        <motion.button
          layout
          transition={transition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={item.id}
          className={cx(
            'group -m-1 flex flex-col items-center px-2 py-2 text-center relative',
            css`
              border: 2px solid rgba(0, 0, 0, 0);
            `,
            selectedItem !== null &&
              selectedItem.id === item.id &&
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

                  animation: ${potatoMode ? disableAnimations(CSSProperty.ANIMATION) : 'scroll 10s linear infinite;'}
                    @keyframes scroll {
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
                  animation: 6s rotate linear infinite forwards;
                  @keyframes rotate {
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
                animation: ${potatoMode
                    ? disableAnimations(CSSProperty.ANIMATION)
                    : '6s rotate linear infinite forwards;'}
                  @keyframes rotate {
                  from {
                    --angle: 0deg;
                  }
                  to {
                    --angle: 360deg;
                  }
                }
              `
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
              dispatch(setItemPickerSelectedItem(null))
            } else {
              dispatch(setItemPickerSelectedItem(item))
            }
          }}
          onMouseDown={() => {
            setButtonClick(true)
          }}
          onMouseUp={() => {
            setButtonClick(false)
          }}
          draggable={true}
          onDragOver={(e) => {
            e.preventDefault()
          }}
        >
          {/* Mythic item overlay */}
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
                      animation: Glow 3s ease infinite;
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
                        opacity: ${potatoMode ? disableAnimations(CSSProperty.OPACITY) : '0.5;'}
                        transition-property: ${
                          potatoMode
                            ? disableAnimations(CSSProperty.TRANSITION_PROPERTY)
                            : 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;'
                        };
                        transition-duration: 100ms;
                      `
                  )
                : ''
            }
          >
            <ItemIcon isMythic={isMythic} hoveredItem={hoveredItem} item={item} />
          </div>
          <p
            className={cx(
              'font-sans text-gray-200 group-hover:text-yellow-200',
              hoveredItem !== null &&
                item.id !== hoveredItem &&
                css`
                  opacity: ${potatoMode ? disableAnimations(CSSProperty.OPACITY) : '0.5;'}
                  transition-property: ${
                    potatoMode
                      ? disableAnimations(CSSProperty.TRANSITION_PROPERTY)
                      : 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;'
                  };
                `
            )}
          >
            {item.gold?.total}
          </p>
        </motion.button>
        {showPopper
          ? createPortal(
              <ItemTooltip
                popperRef={popperRef}
                styles={styles}
                attributes={attributes}
                setArrowRef={setArrowRef}
                isMythic={isMythic}
                hoveredItem={hoveredItem}
                item={item}
              />,
              document.querySelector('#item-container') as HTMLElement
            )
          : null}
      </>
    </li>
  )
}
