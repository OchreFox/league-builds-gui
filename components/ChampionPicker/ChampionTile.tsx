import Image from 'next/image'

import { cx } from '@emotion/css'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import React from 'react'
import { useSelector } from 'react-redux'

import { ChampionsSchema } from '../../types/Champions'
import { CustomLoader } from '../../utils/CustomLoader'
import { easeInOutExpo } from '../../utils/Transition'
import { easeOutExpo } from '../BuildMakerComponents'
import { addSelectedChampion, removeSelectedChampion } from '../store/appSlice'
import { addAssociatedChampion, removeAssociatedChampion, selectAssociatedChampions } from '../store/itemBuildSlice'
import { selectPotatoMode } from '../store/potatoModeSlice'
import { useAppDispatch } from '../store/store'
import styles from './ChampionPickerOverlay.module.scss'

const ChampionTile = ({ champion }: { champion: ChampionsSchema }) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const associatedChampions = useSelector(selectAssociatedChampions)

  const toggleChampion = (champion: ChampionsSchema) => {
    if (associatedChampions.includes(champion.id)) {
      dispatch(removeAssociatedChampion(champion.id))
      dispatch(removeSelectedChampion(champion))
    } else {
      dispatch(addAssociatedChampion(champion.id))
      dispatch(addSelectedChampion(champion))
    }
  }

  const championTileVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.1,
      },
    },
  }

  return (
    <motion.li
      layout
      id={'champion-container-' + champion.id}
      className={cx(
        'group flex cursor-pointer flex-col items-center justify-center list-none',
        !potatoMode && 'transition-colors duration-200 ease-in-out',
        associatedChampions.includes(champion.id) ? styles.animatedTileBg : 'hover:bg-white/20 bg-transparent'
      )}
      variants={championTileVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={easeInOutExpo}
      onClick={() => toggleChampion(champion)}
    >
      <div
        className={cx(
          'flex flex-col items-center justify-center w-full h-full py-2',
          associatedChampions.includes(champion.id) && styles.animatedTileBgOverlay
        )}
      >
        <div
          className={cx(
            'border border-yellow-900 ring-brand-default group-hover:ring-2 group-hover:brightness-125 flex',
            !potatoMode && 'transition duration-100',
            associatedChampions.includes(champion.id) && 'border-2 border-yellow-500'
          )}
        >
          {champion.icon && champion.placeholder ? (
            <Image
              loader={CustomLoader}
              width={60}
              height={60}
              src={champion.icon}
              alt={champion.name}
              placeholder="blur"
              blurDataURL={champion.placeholder}
            />
          ) : (
            <img
              width={60}
              height={60}
              src="/icons/champion-square.svg"
              alt={champion.name}
              // placeholder="blur"
              // blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO0rgcAAPsAvCZ+DFUAAAAASUVORK5CYII="
            />
          )}
        </div>
        <p
          className={cx(
            'text-center text-gray-200 group-hover:text-white',
            !potatoMode && 'transition duration-100',
            champion.name.length < 10 ? 'text-sm' : 'text-xs',
            associatedChampions.includes(champion.id) && 'text-yellow-300'
          )}
        >
          {champion.name}
        </p>
      </div>
    </motion.li>
  )
}

export default ChampionTile
