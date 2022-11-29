import { cx } from '@emotion/css'
import { Icon, IconifyIcon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

export interface BaseButtonProps {
  label?: string
  icon: string | IconifyIcon
  labelReactive?: string
  iconReactive?: string | IconifyIcon
  dropReactive?: boolean
  handleClick?: () => void
  handleDrop?: (e: React.DragEvent<HTMLButtonElement>) => void
}

export interface ButtonProps extends BaseButtonProps {
  background: string
  color: string
  reactive: boolean
  bgClick: string
  colorReactive?: string
  layoutId?: string
  rounded: 'rounded-full' | 'rounded-md' | 'rounded-none'
}

const Button = ({
  label,
  icon,
  background,
  color,
  reactive,
  labelReactive,
  iconReactive,
  bgClick,
  colorReactive,
  layoutId,
  rounded,
  dropReactive,
  handleClick,
  handleDrop,
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonClick, setButtonClick] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const buttonVariants: Variants = {
    initial: {
      boxShadow: '0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    hover: {
      boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    focus: {
      boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
  }

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

  return (
    <motion.button
      layout="position"
      layoutId={layoutId}
      ref={buttonRef}
      initial="initial"
      whileHover="hover"
      whileFocus="focus"
      variants={buttonVariants}
      className={cx(
        'inline-flex items-center transition-colors duration-200 ease-out hover:bg-cyan-900 py-2 justify-center my-4 font-normal relative grow overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
        background,
        bgClick && `focus:${bgClick}`,
        rounded === 'rounded-full' ? 'px-6 rounded-full' : 'px-4 rounded-md',
        dropReactive && dragOver && `drop-shadow-lg ${bgClick} ${colorReactive}`
      )}
      onClick={() => {
        reactive && setButtonClick(true)
        handleClick && handleClick()
      }}
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
    >
      <motion.span
        className={cx(reactive && 'absolute', 'inset-0 flex items-center justify-center', color)}
        initial={{ y: 0 }}
        animate={{ y: reactive && buttonClick ? '-200%' : 0 }}
      >
        <Icon icon={icon} className={cx('h-5 w-5', label && 'mr-1')} inline={true} />
        {label && <span className="font-bold">{label}</span>}
      </motion.span>
      {reactive && (
        <motion.span
          className={cx('flex items-center justify-center', colorReactive)}
          initial={{ y: '200%' }}
          animate={{ y: buttonClick ? 0 : '200%' }}
          whileTap={{ scale: 0.9 }}
        >
          {iconReactive && <Icon icon={iconReactive} className="mr-1 h-5 w-5" inline={true} />}
          <span className="font-bold">{labelReactive}</span>
        </motion.span>
      )}
    </motion.button>
  )
}

export default Button
