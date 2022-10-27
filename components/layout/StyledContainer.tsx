import { cx } from '@emotion/css'
import React from 'react'

import styles from './StyledContainer.module.scss'

const StyledContainer = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        `${styles['smooth-shadow']} ${styles['container-background']}`,
        'text-white col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export default StyledContainer
