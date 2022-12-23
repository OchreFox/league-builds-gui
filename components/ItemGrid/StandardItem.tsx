import {
  selectItemPicker,
  setItemPickerDraggedItem,
  setItemPickerHoveredItem,
  setItemPickerSelectedItem,
} from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom-interactions'
import { AnimatePresence, motion } from 'framer-motion'
import _ from 'lodash'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { StandardItemState } from 'types/FilterProps'

import { easeInOutQuad } from 'utils/Transition'

import { ItemNameTooltipVariants, itemButtonClass, itemTooltipClass, mythicOverlayClass } from './ItemComponents'
import { transitionVariant } from './ItemGridComponents'
import { ItemIcon } from './ItemIcon'
import { ItemPopper } from './ItemPopper'

export const StandardItem = ({ item, itemRefArray, itemGridRef }: StandardItemState) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { selectedItem, hoveredItem } = useSelector(selectItemPicker)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showPopper, setShowPopper] = useState(false)
  const [mouseEnter, setMouseEnter] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const itemRef = useRef<HTMLElement | null>(null)
  // Item description popper
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
  // Name tooltip
  const arrowTooltipRef = useRef(null)
  const {
    x,
    y,
    reference,
    floating,
    strategy,
    placement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    open: showTooltip,
    onOpenChange: setShowTooltip,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [offset(2), shift({ padding: 5 }), flip(), arrow({ element: arrowTooltipRef })],
  })

  const addToRefs = (el: HTMLElement | null) => {
    if (el) {
      let itemRefArrayIndex = _.findIndex(itemRefArray.current, (itemRef) => itemRef.itemId === item.id)
      if (itemRefArrayIndex !== -1) {
        itemRefArray.current[itemRefArrayIndex].ref.current = el
        itemRef.current = el
      }
    }
  }

  const isSelected = useMemo(() => selectedItem !== null && selectedItem.id === item.id, [selectedItem, item.id])

  useLayoutEffect(() => {
    // Call reference with the virtual element inside an effect or event handler.
    reference({
      getBoundingClientRect() {
        return buttonRef.current!.getBoundingClientRect()
      },
    })
  }, [reference])

  useEffect(() => {}, [])

  useEffect(() => {
    if (mouseEnter && !buttonClick) {
      setShowTooltip(true)
      const timer = setTimeout(() => {
        setShowPopper(true)
        setShowTooltip(false)
        dispatch(setItemPickerHoveredItem(item.id))
      }, 700)
      return () => clearTimeout(timer)
    } else {
      setShowTooltip(false)
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
        e.dataTransfer.setData('text/plain', JSON.stringify(item))
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
          transition={transitionVariant}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={item.id}
          className={itemButtonClass(item, hoveredItem, isSelected, potatoMode)}
          ref={buttonRef}
          onMouseEnter={() => {
            setMouseEnter(true)
          }}
          onMouseLeave={() => {
            setMouseEnter(false)
          }}
          onClick={() => {
            // Toggle selectedItem
            if (isSelected) {
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
          <div ref={reference} className={mythicOverlayClass(item.mythic)} data-mythic={item.mythic}>
            <ItemIcon item={item} />
          </div>
          <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
        </motion.button>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
              }}
              className={cx(
                'z-20 px-2 py-1 border border-yellow-700 shadow-lg text-white font-semibold text-center',
                !potatoMode &&
                  css`
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(5px);
                  `,
                isSelected ? 'bg-yellow-700/50' : 'bg-slate-700/50'
              )}
              variants={ItemNameTooltipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                ...easeInOutQuad,
                duration: 0.1,
              }}
            >
              <span>{item.name}</span>
              <div
                ref={arrowTooltipRef}
                className={itemTooltipClass(placement, arrowX, arrowY, potatoMode, isSelected)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {showPopper
          ? createPortal(
              <ItemPopper
                popperRef={popperRef}
                styles={styles}
                attributes={attributes}
                setArrowRef={setArrowRef}
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
