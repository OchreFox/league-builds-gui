'use client'

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { cx } from '@emotion/css'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom-interactions'
import { Portal } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { useSelector } from 'react-redux'
import { StandardItemState } from 'types/FilterProps'

import { ItemNameTooltipVariants } from '@/components/ItemGrid/ItemComponents'
import { transitionVariant } from '@/components/ItemGrid/ItemGridComponents'
import { ItemIcon } from '@/components/ItemGrid/ItemIcon'
import { ItemPopper } from '@/components/ItemGrid/ItemPopper'
import itemStyles from '@/components/ItemGrid/StandardItem.module.scss'
import { selectItemPicker, setItemPickerDraggedItem, setItemPickerSelectedItem } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import { easeInOutQuad } from 'utils/Transition'

export const StandardItem = ({ item, itemRefArray, itemGridRef }: StandardItemState) => {
  const dispatch = useAppDispatch()
  const { selectedItem } = useSelector(selectItemPicker)
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

  const itemRefArrayIndex = useMemo(
    () => itemRefArray.current.findIndex((itemRef) => itemRef.itemId === item.id),
    [itemRefArray, item.id]
  )

  const isSelected = useMemo(() => selectedItem !== null && selectedItem.id === item.id, [selectedItem, item.id])

  const addToRefs = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        // If the item is not in the array, add it
        if (itemRefArrayIndex !== -1) {
          itemRefArray.current[itemRefArrayIndex].ref.current = el
          itemRef.current = el
        }
      }
    },
    [itemRefArray, item.id]
  )

  const itemDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      dispatch(setItemPickerDraggedItem(item.id))
      e.dataTransfer.setData('text/plain', JSON.stringify(item))
      e.currentTarget.style.opacity = '0.4'
      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
      setButtonClick(true)
    },
    [item]
  )

  const itemDragEnd = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    dispatch(setItemPickerDraggedItem(null))
    e.currentTarget.style.opacity = '1'
    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    setButtonClick(false)
  }, [])

  const toggleSelectedItem = useCallback(() => {
    // Toggle selectedItem
    if (isSelected) {
      dispatch(setItemPickerSelectedItem(null))
    } else {
      dispatch(setItemPickerSelectedItem(item))
    }
  }, [isSelected, item])

  useLayoutEffect(() => {
    // Call reference with the virtual element inside an effect or event handler.
    reference({
      getBoundingClientRect() {
        return buttonRef.current!.getBoundingClientRect()
      },
    })
  }, [reference])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (mouseEnter && !buttonClick) {
      setShowTooltip(true)
      timer = setTimeout(() => {
        setShowPopper(true)
        setShowTooltip(false)
        // dispatch(setItemPickerHoveredItem(item.id))
      }, 700)

      return () => {
        if (timer) {
          clearTimeout(timer)
        }
      }
    } else {
      setShowTooltip(false)
      // dispatch(setItemPickerHoveredItem(null))
      setShowPopper(false)
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [mouseEnter, buttonClick])

  useEffect(() => {
    if (buttonClick) {
      setShowPopper(false)
      // dispatch(setItemPickerHoveredItem(null))
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
      onDragStart={itemDragStart}
      onDragEnd={itemDragEnd}
    >
      <>
        <motion.button
          layout
          transition={transitionVariant}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={item.id}
          className={cx(
            itemStyles.itemButton,
            showPopper && itemStyles.itemButtonHovered,
            isSelected && itemStyles.itemButtonSelected
          )}
          ref={buttonRef}
          onMouseEnter={() => {
            setMouseEnter(true)
          }}
          onMouseLeave={() => {
            setMouseEnter(false)
          }}
          onClick={toggleSelectedItem}
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
          <div ref={reference} className={item.mythic ? itemStyles.itemMythicOverlay : ''}>
            <ItemIcon item={item} usePlaceholder={true} />
          </div>
          <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
        </motion.button>
        <AnimatePresence>
          {showTooltip && (
            <Portal>
              <motion.div
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                }}
                className={itemStyles.itemTooltip}
                variants={ItemNameTooltipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  ...easeInOutQuad,
                  duration: 0.1,
                }}
              >
                <motion.span className="pointer-events-none">{item.name}</motion.span>
                <div
                  ref={arrowTooltipRef}
                  data-tooltip-placement={placement}
                  className={itemStyles.itemTooltipArrow}
                  style={{
                    top: arrowY,
                    left: arrowX,
                  }}
                />
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
        {showPopper
          ? createPortal(
              <ItemPopper
                popperRef={popperRef}
                styles={styles}
                attributes={attributes}
                setArrowRef={setArrowRef}
                item={item}
              />,
              document.querySelector('#item-container') as HTMLElement
            )
          : null}
      </>
    </li>
  )
}
