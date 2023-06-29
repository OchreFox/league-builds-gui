import React from 'react'

import { cx } from '@emotion/css'
import alertCircle from '@iconify/icons-tabler/alert-circle'
import { Icon, IconifyIcon } from '@iconify/react'
import { motion } from 'framer-motion'

export const setButtonTimer = (
  buttonState: boolean,
  setButtonState: React.Dispatch<React.SetStateAction<boolean>>,
  ref: React.RefObject<HTMLButtonElement>
) => {
  const setTimer = () => {
    return setTimeout(() => {
      if (buttonState) {
        setButtonState(false)
        ref.current?.blur()
      }
    }, 1500)
  }
  if (buttonState) {
    let timer = setTimer()
    return () => clearTimeout(timer)
  }
}

export const ButtonLabel = ({
  label,
  icon,
  color,
  buttonClick,
  buttonError,
  bold = false,
  reactive,
}: {
  label?: string
  icon?: string | IconifyIcon
  color?: string
  buttonClick?: boolean
  buttonError?: boolean
  bold?: boolean
  reactive?: boolean
}) => {
  return (
    <motion.span
      className={cx(reactive && 'absolute', 'inset-0 flex items-center justify-center', color)}
      initial={{ y: 0 }}
      animate={{ y: reactive && (buttonClick || buttonError) ? '-200%' : 0 }}
    >
      {icon && <Icon icon={icon} className={cx('h-5 w-5', label && 'mr-1')} inline={true} />}
      {label && <span className={cx(bold && 'font-bold')}>{label}</span>}
    </motion.span>
  )
}

export const ButtonLabelReactive = ({
  show,
  labelReactive,
  iconReactive,
  colorReactive,
  bold = false,
}: {
  show: boolean
  labelReactive?: string
  iconReactive?: string | IconifyIcon
  colorReactive?: string
  bold?: boolean
}) => {
  return (
    <motion.span
      className={cx('absolute inset-0 flex items-center justify-center', colorReactive)}
      initial={{ y: '200%' }}
      animate={{ y: show ? 0 : '200%' }}
      whileTap={{ scale: 0.9 }}
    >
      {iconReactive && <Icon icon={iconReactive} className="mr-1 h-5 w-5" inline={true} />}
      <span className={cx(bold && 'font-bold')}>{labelReactive}</span>
    </motion.span>
  )
}

export const ButtonError = ({
  show,
  message = 'Error!',
  bgClick,
  bgClickError,
  colorError,
  bold = false,
}: {
  show: boolean
  message?: string
  bgClick: string
  bgClickError: string
  colorError: string
  bold?: boolean
}) => {
  return (
    <motion.span
      className={cx('absolute inset-0 flex items-center justify-center', show ? bgClickError : bgClick, colorError)}
      initial={{ y: '200%' }}
      animate={{ y: show ? 0 : '200%' }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon icon={alertCircle} className="mr-1 h-5 w-5" inline={true} />
      <span className={cx(bold && 'font-bold')}>{message}</span>
    </motion.span>
  )
}
