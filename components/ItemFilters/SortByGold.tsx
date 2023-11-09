import React from 'react'

import { cx } from '@emotion/css'
import arrowNarrowDown from '@iconify/icons-tabler/arrow-narrow-down'
import arrowNarrowUp from '@iconify/icons-tabler/arrow-narrow-up'
import { Icon } from '@iconify/react'
import GoldIcon from 'public/icons/gold.svg'
import { SortDirection } from 'types/FilterProps'

const SortByGold = ({
  direction,
  setDirection,
}: {
  direction: SortDirection
  setDirection: React.Dispatch<React.SetStateAction<SortDirection>>
}) => {
  return (
    <button
      type="button"
      className={cx(
        'flex h-8 items-center justify-center rounded-md bg-cyan-900 px-2  py-1 text-white transition-colors duration-200 ease-out motion-reduce:transition-none',
        direction === SortDirection.Asc ? 'hover:bg-brand-default' : 'hover:bg-brand-dark'
      )}
      onClick={() =>
        // Toggle sort order
        setDirection(direction === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc)
      }
      title={`Sort by ${direction === SortDirection.Asc ? 'highest' : 'lowest'} gold`}
    >
      <GoldIcon className="h-5 w-5" />
      {direction === SortDirection.Asc ? (
        <Icon icon={arrowNarrowUp} width="24px" className="-mr-1" />
      ) : (
        <Icon icon={arrowNarrowDown} width="24px" className="-mr-1" />
      )}
    </button>
  )
}

export default SortByGold
