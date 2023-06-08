import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cx } from '@emotion/css'
import alertCircle from '@iconify/icons-tabler/alert-circle'
import { Icon, IconifyIcon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'

import { ButtonError, ButtonLabel, ButtonLabelReactive, setButtonTimer } from './ButtonComponents'

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
  rounded: 'rounded-full' | 'rounded-md' | 'rounded-none'
  className?: string
}

const Button = ({
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
  layoutId,
  rounded,
  dropReactive,
  handleClick,
  handleDrop,
  className,
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonClick, setButtonClick] = useState(false)
  const [buttonError, setButtonError] = useState(false)
  const [dragOver, setDragOver] = useState(false)

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

  useEffect(() => {
    setButtonTimer(buttonClick, setButtonClick, buttonRef)
  }, [buttonClick])

  useEffect(() => {
    setButtonTimer(buttonError, setButtonError, buttonRef)
  }, [buttonError])

  return (
    <motion.button
      layout="position"
      layoutId={layoutId}
      ref={buttonRef}
      initial="initial"
      whileHover="hover"
      whileFocus="focus"
      className={cx(
        'relative h-full w-full justify-center overflow-hidden border-2 py-2 font-medium drop-shadow-xl transition-extended-colors duration-150 ease-out hover:drop-shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
        bgColor,
        bgHover,
        buttonError ? bgClickError : bgClick,
        rounded !== 'rounded-none' && (rounded === 'rounded-full' ? 'rounded-full px-6' : 'rounded-md px-4'),
        dropReactive && dragOver && `drop-shadow-lg ${dropReactive} ${colorReactive}`,
        outlined ? `border-2 ${outlineColor}` : 'border-transparent',
        className
      )}
      onClick={onClick}
      onBlur={() => {
        setButtonClick(false)
      }}
      onDragOver={(e) => {
        if (dropReactive) {
          e.preventDefault()
          setDragOver(true)
        }
      }}
      onDragLeave={() => {
        if (dropReactive) {
          setDragOver(false)
        }
      }}
      onDrop={(e) => {
        setDragOver(false)
        handleDrop && handleDrop(e)
        buttonRef.current?.focus()
        setButtonClick(true)
      }}
      {...rest}
    >
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
    </motion.button>
  )
}

export default Button
