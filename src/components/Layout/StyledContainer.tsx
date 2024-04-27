import React from 'react'

import { cx } from '@emotion/css'

import styles from '@/components/Layout/StyledContainer.module.scss'

const StyledContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        `${styles['smooth-shadow']} ${styles['container-background']}`,
        'col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 text-white md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2'
      )}
    >
      {children}
    </div>
  )
}

export default StyledContainer
