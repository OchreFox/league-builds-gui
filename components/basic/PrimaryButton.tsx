import { useEffect, useRef, useState } from 'react'

import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'

import Button, { BaseButtonProps } from '@/components/basic/Button'
import styles from '@/components/basic/PrimaryButton.module.scss'
import HorizontalButton from '@/components/ui/HorizontalButton'
import { useRect } from '@/hooks/useRect'

export const PrimaryButton = ({
  label,
  icon,
  labelReactive,
  iconReactive,
  handleClick,
  handleDrop,
}: BaseButtonProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const rect = useRect(ref)
  const [isHover, setIsHover] = useState(false)

  return (
    <motion.div
      ref={ref}
      layout
      className="relative flex h-full w-full items-center"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <HorizontalButton width={rect.width} className={cx(styles.button)} hover={isHover} />
      <Button
        label={label}
        icon={icon}
        color="text-white"
        colorReactive="text-white"
        // bgClick="focus:bg-green-400"
        // bgColor="bg-transparent"
        bgHover="hover:bg-transparent"
        bold={true}
        reactive={true}
        focusRing={false}
        labelReactive={labelReactive}
        iconReactive={iconReactive}
        rounded="rounded-none"
        dropReactive="bg-green-400"
        handleClick={handleClick}
        handleDrop={handleDrop}
        className="relative py-8 font-league text-lg uppercase tracking-wide"
        rootClassName={styles.chevron}
      />
    </motion.div>
  )
}
