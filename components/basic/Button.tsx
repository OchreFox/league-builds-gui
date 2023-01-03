import { cx } from '@emotion/css'
import alertCircle from '@iconify/icons-tabler/alert-circle'
import { Icon, IconifyIcon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface BaseButtonProps {
  label?: string
  icon?: string | IconifyIcon
  labelReactive?: string
  iconReactive?: string | IconifyIcon
  dropReactive?: string
  handleClick?: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => boolean
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
        console.log(res)
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
    const setTimer = () => {
      return setTimeout(() => {
        if (buttonClick) {
          setButtonClick(false)
          buttonRef.current?.blur()
        }
      }, 1500)
    }
    if (buttonClick) {
      let timer = setTimer()
      return () => clearTimeout(timer)
    }
  }, [buttonClick])

  useEffect(() => {
    const setTimer = () => {
      return setTimeout(() => {
        if (buttonError) {
          setButtonError(false)
          buttonRef.current?.blur()
        }
      }, 1500)
    }
    if (buttonError) {
      let timer = setTimer()
      return () => clearTimeout(timer)
    }
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
        'relative overflow-hidden transition-extended-colors duration-150 ease-out py-2 w-full h-full justify-center font-medium focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 border-2 drop-shadow-xl hover:drop-shadow-sm',
        bgColor,
        bgHover,
        buttonError ? bgClickError : bgClick,
        rounded !== 'rounded-none' && (rounded === 'rounded-full' ? 'px-6 rounded-full' : 'px-4 rounded-md'),
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
      <motion.span
        className={cx(reactive && 'absolute', 'inset-0 flex items-center justify-center', color)}
        initial={{ y: 0 }}
        animate={{ y: reactive && (buttonClick || buttonError) ? '-200%' : 0 }}
      >
        {icon && <Icon icon={icon} className={cx('h-5 w-5', label && 'mr-1')} inline={true} />}
        {label && <span className={cx(bold && 'font-bold')}>{label}</span>}
      </motion.span>
      {reactive && (
        <motion.span
          className={cx('absolute inset-0 flex items-center justify-center', colorReactive)}
          initial={{ y: '200%' }}
          animate={{ y: buttonClick ? 0 : '200%' }}
          whileTap={{ scale: 0.9 }}
        >
          {iconReactive && <Icon icon={iconReactive} className="mr-1 h-5 w-5" inline={true} />}
          <span className={cx(bold && 'font-bold')}>{labelReactive}</span>
        </motion.span>
      )}
      {reactive && buttonError && (
        <motion.span
          className={cx(
            'absolute inset-0 flex items-center justify-center',
            buttonError ? bgClickError : bgClick,
            colorError
          )}
          initial={{ y: '200%' }}
          animate={{ y: buttonError ? 0 : '200%' }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon icon={alertCircle} className="mr-1 h-5 w-5" inline={true} />
          <span className={cx(bold && 'font-bold')}>Error!</span>
        </motion.span>
      )}
    </motion.button>
  )
}

export default Button
