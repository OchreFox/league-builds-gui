import { selectItemFilters, setItemFiltersRarity } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import circleDashed from '@iconify/icons-tabler/circle-dashed'
import diamondIcon from '@iconify/icons-tabler/diamond'
import squareRotated from '@iconify/icons-tabler/square-rotated'
import triangleIcon from '@iconify/icons-tabler/triangle'
import { Icon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'
import AllClasses from 'public/icons/champion-class/all-classes.svg'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Rarity } from 'types/FilterProps'

import { easeOutExpo } from '../ItemBuild/BuildMakerComponents'
import styles from './FilterRarity.module.scss'

const borderVariants: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
  },
}

const RarityIcon = ({ rarity }: { rarity: Rarity }) => {
  switch (rarity) {
    case Rarity.Basic:
      return <Icon icon={circleDashed} className="mr-1 w-4 h-4 fill-gray-500 stroke-gray-300" />
    case Rarity.Epic:
      return <Icon icon={triangleIcon} className="mr-1 w-4 h-4 fill-cyan-300 stroke-cyan-500" />
    case Rarity.Legendary:
      return <Icon icon={squareRotated} className="mr-1 w-4 h-4 fill-red-500 stroke-red-700" />
    case Rarity.Mythic:
      return <Icon icon={diamondIcon} className="mr-1 w-4 h-4 fill-purple-500 stroke-purple-700" />
    default:
      return <AllClasses className="mr-1 w-4 h-auto" />
  }
}

export default function FilterItemsByRarity() {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)

  const setRarity = useCallback(
    (rarity: Rarity) => {
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
    <div className={cx('relative z-0 flex flex-row w-full', styles.rarityButtonContainer)}>
      <div className="lg:hidden w-full">
        <select
          title="Filter items by rarity"
          id="filterItemsByRarity"
          name="filterItemsByRarity"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={itemFilters.rarity}
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
            type="button"
            title="Basic"
            className={cx(
              'group inline-flex flex-row items-center justify-center py-1 px-2 text-sm font-medium relative bg-transparent text-gray-600 hover:bg-cyan-900',
              itemFilters.rarity === rarity ? styles.filterButtonActive : 'hover:text-white',
              rarity === Rarity.Empty && styles.all
            )}
            onClick={toggleRarity(rarity)}
          >
            {itemFilters.rarity === rarity ? (
              <motion.div
                layoutId="rarity-border"
                className="bg-brand-default w-full h-0.5 inset-x-0 bottom-0 absolute"
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
