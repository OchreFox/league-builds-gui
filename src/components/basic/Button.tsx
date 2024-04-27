import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { cx } from '@emotion/css'
import { IconifyIcon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'

import { ButtonError, ButtonLabel, ButtonLabelReactive, setButtonTimer } from '@/components/basic/ButtonComponents'

export interface BaseButtonProps {
  label?: string
  icon?: string | IconifyIcon
  labelReactive?: string
  iconReactive?: string | IconifyIcon
  dropReactive?: string
  handleClick?: (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => boolean | Promise<boolean>
  handleDrop?: (e: React.DragEvent<HTMLButtonElement>) => void
  children?: React.ReactNode

  // Handle rest of React.HTMLAttributes<HTMLElement>
  [rest: string]: any
}

export interface ButtonProps extends BaseButtonProps {
  outlined?: boolean
  reactive: boolean
  bold?: boolean
  color: string
  colorReactive?: string
  colorError?: string
  outlineColor?: string
  bgColor: string
  bgHover?: string
  bgClick: string
  bgClickError?: string
  layoutId?: string
  focusRing?: boolean
  rounded: 'rounded-full' | 'rounded-md' | 'rounded-none'
  className?: string
  rootClassName?: string
  buttonRef?: React.RefObject<HTMLButtonElement>
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function ButtonComponent(
  {
    label,
    icon,
    bgColor,
    color,
    outlined = false,
    bold = false,
    outlineColor,
    reactive,
    labelReactive,
    iconReactive,
    bgClick,
    bgClickError = 'focus:bg-brand-dark',
    bgHover = 'hover:bg-cyan-900',
    colorReactive,
    colorError = 'text-white',
    focusRing = true,
    layoutId,
    rounded,
    dropReactive,
    handleClick,
    handleDrop,
    rootClassName,
    className,
    children,
    ...rest
  },
  ref
) {
  const innerRef = useRef<HTMLButtonElement>(null)
  const [buttonClick, setButtonClick] = useState(false)
  const [buttonError, setButtonError] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (handleClick) {
        setButtonError(false)
        const res = handleClick(e)
        if (res) {
          reactive && setButtonClick(true)
        } else {
          reactive && setButtonError(true)
        }
      } else {
        reactive && setButtonClick(true)
      }
    },
    [handleClick, reactive]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      if (dropReactive) {
        e.preventDefault()
        setDragOver(true)
      }
    },
    [dropReactive]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      if (dropReactive) {
        setDragOver(false)
      }
    },
    [dropReactive]
  )

  const onBlur = useCallback((e: React.FocusEvent<HTMLButtonElement, Element>) => {
    setButtonClick(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      setDragOver(false)
      handleDrop?.(e)
      innerRef.current?.focus()
      setButtonClick(true)
    },
    [innerRef, handleDrop]
  )

  useEffect(() => {
    setButtonTimer(buttonClick, setButtonClick, innerRef)
  }, [buttonClick, innerRef])

  useEffect(() => {
    setButtonTimer(buttonError, setButtonError, innerRef)
  }, [buttonError, innerRef])

  return (
    <motion.button
      layout="position"
      layoutId={layoutId}
      ref={innerRef}
      initial="initial"
      whileHover="hover"
      whileFocus="focus"
      className={cx(
        'relative h-full w-full items-center justify-center overflow-hidden border-2 font-medium drop-shadow-xl transition-extended-colors duration-150 ease-out hover:drop-shadow-sm',
        bgColor,
        bgHover,
        focusRing && 'focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
        buttonError ? bgClickError : bgClick,
        rounded !== 'rounded-none' && (rounded === 'rounded-full' ? 'rounded-full px-6' : 'rounded-md px-4'),
        dropReactive && dragOver && `drop-shadow-lg ${dropReactive} ${colorReactive}`,
        outlined ? `border-2 ${outlineColor}` : 'border-transparent',
        rootClassName
      )}
      onClick={onClick}
      onBlur={onBlur}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
      {...rest}
    >
      {children}
      <div className={cx('py-2', className)}>
        <ButtonLabel
          label={label}
          icon={icon}
          color={color}
          bold={bold}
          buttonClick={buttonClick}
          buttonError={buttonError}
          reactive={reactive}
        />
        {reactive && (
          <ButtonLabelReactive
            show={buttonClick}
            colorReactive={colorReactive}
            labelReactive={labelReactive}
            iconReactive={iconReactive}
            bold={bold}
          />
        )}
        {reactive && buttonError && (
          <ButtonError
            show={buttonError}
            bgClick={bgClick}
            bgClickError={bgClickError}
            colorError={colorError}
            bold={bold}
          />
        )}
      </div>
    </motion.button>
  )
})

export default Button
