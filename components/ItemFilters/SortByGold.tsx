import { css, cx } from '@emotion/css'
import arrowNarrowDown from '@iconify/icons-tabler/arrow-narrow-down'
import { Icon } from '@iconify/react'
import GoldIcon from 'public/icons/gold.svg'
import React from 'react'
import { SortDirection } from 'types/FilterProps'

const SortByGold = ({
  direction,
  setDirection,
}: {
  direction: SortDirection
  setDirection: React.Dispatch<React.SetStateAction<SortDirection>>
}) => {
  return (
    <div
      className={cx(
        'flex px-2 py-1 h-8 items-center justify-center rounded-md  bg-cyan-900 text-white transition-colors duration-200 ease-out motion-reduce:transition-none',
        direction === SortDirection.Asc ? 'hover:bg-brand-default' : 'hover:bg-brand-dark'
      )}
      onClick={() =>
        // Toggle sort order
        setDirection(direction === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc)
      }
      title={`Sort by ${direction === SortDirection.Asc ? 'highest' : 'lowest'} gold`}
    >
      <GoldIcon className="h-5 w-5" />
      <Icon
        icon={arrowNarrowDown}
        width="24px"
        className={cx(
          '-mr-1',

          direction === SortDirection.Asc
            ? css`
                animation: rotate 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                @keyframes rotate {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(180deg);
                  }
                }
              `
            : css`
                animation: rotate-back 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                @keyframes rotate-back {
                  0% {
                    transform: rotate(180deg);
                  }
                  100% {
                    transform: rotate(0deg);
                  }
                }
              `
        )}
      />
    </div>
  )
}

export default SortByGold
