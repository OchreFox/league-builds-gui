import React, { useCallback } from 'react'

import { cx } from '@emotion/css'
import circleDashed from '@iconify/icons-tabler/circle-dashed'
import diamondIcon from '@iconify/icons-tabler/diamond'
import squareRotated from '@iconify/icons-tabler/square-rotated'
import triangleIcon from '@iconify/icons-tabler/triangle'
import { Icon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'
import AllClasses from 'public/icons/champion-class/all-classes.svg'
import { useSelector } from 'react-redux'
import { Rarity } from 'types/FilterProps'

import styles from '@/components/ItemFilters/FilterRarity.module.scss'
import { selectItemFilters, setItemFiltersRarity } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

const borderVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
  },
}

export const RarityIcon = ({ rarity }: { rarity: Rarity }) => {
  switch (rarity) {
    case Rarity.Basic:
      return <Icon icon={circleDashed} className="mr-1 h-4 w-4 fill-gray-500 stroke-gray-300" />
    case Rarity.Epic:
      return <Icon icon={triangleIcon} className="mr-1 h-4 w-4 fill-cyan-300 stroke-cyan-500" />
    case Rarity.Legendary:
      return <Icon icon={squareRotated} className="mr-1 h-4 w-4 fill-red-500 stroke-red-700" />
    case Rarity.Mythic:
      return <Icon icon={diamondIcon} className="mr-1 h-4 w-4 fill-purple-500 stroke-purple-700" />
    default:
      return <AllClasses className="mr-1 h-auto w-4" />
  }
}

export default function FilterItemsByRarity() {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)

  const setRarity = useCallback(
    (rarity: Rarity) => {
      console.log('setRarity', rarity)
      dispatch(setItemFiltersRarity(rarity))
    },
    [dispatch]
  )

  function toggleRarity(rarity: Rarity): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      if (itemFilters.rarity !== rarity) {
        dispatch(setItemFiltersRarity(rarity))
      } else {
        dispatch(setItemFiltersRarity(Rarity.Empty))
      }
    }
  }

  return (
    <div className={cx('relative z-0 flex grow flex-row', styles.rarityButtonContainer)}>
      <div className="w-full lg:hidden">
        <select
          title="Filter items by rarity"
          id="filterItemsByRarity"
          name="filterItemsByRarity"
          className="block w-full rounded-md border-gray-300 px-2 py-1 focus:border-indigo-500 focus:ring-indigo-500"
          onChange={(e) => setRarity(e.target.value as Rarity)}
          value={itemFilters.rarity}
        >
          {Object.values(Rarity).map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden flex-row lg:flex">
        {Object.values(Rarity).map((rarity) => (
          <motion.button
            key={rarity + '-rarity'}
            transition={{ duration: 0.1, type: 'tween' }}
            title={rarity}
            className={cx(
              'group relative inline-flex flex-row items-center justify-center bg-transparent px-2 py-1 text-sm font-medium text-gray-600 hover:bg-cyan-900',
              itemFilters.rarity === rarity ? styles.filterButtonActive : 'hover:text-white',
              rarity === Rarity.Empty && styles.all
            )}
            onClick={toggleRarity(rarity)}
          >
            {itemFilters.rarity === rarity ? (
              <motion.div
                layoutId="rarity-border"
                className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
              />
            ) : null}
            <RarityIcon rarity={rarity} />
            <span>{rarity.toString()}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
