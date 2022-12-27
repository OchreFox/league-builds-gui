import Image from 'next/image'

import {
  addChampionPickerLoadedChampionId,
  addSelectedChampion,
  removeSelectedChampion,
  selectChampionPicker,
} from '@/store/appSlice'
import { addAssociatedChampion, removeAssociatedChampion, selectAssociatedChampions } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { batch, useSelector } from 'react-redux'
import { ChampionsSchema } from 'types/Champions'

import { blurhashDecode } from 'utils/BlurhashDecode'
import { CustomLoader } from 'utils/CustomLoader'
import { easeInOutExpo } from 'utils/Transition'

import styles from './ChampionPickerOverlay.module.scss'

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

const ChampionTile = ({ champion }: { champion: ChampionsSchema }) => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const associatedChampions = useSelector(selectAssociatedChampions)
  const { loadedChampionIds } = useSelector(selectChampionPicker)
  const [loadAnimation, setLoadAnimation] = useState(false)
  const isLoaded = useMemo(() => loadedChampionIds.includes(champion.id), [loadedChampionIds, champion.id])

  const loadChampion = useCallback(() => {
    if (!isLoaded) {
      dispatch(addChampionPickerLoadedChampionId(champion.id))
    }
  }, [champion.id])

  const isActive = useMemo(() => {
    return champion && associatedChampions.includes(champion.id)
  }, [associatedChampions, champion.id])

  const toggleChampion = (champion: ChampionsSchema) => {
    if (isActive) {
      batch(() => {
        dispatch(removeAssociatedChampion(champion.id))
        dispatch(removeSelectedChampion(champion))
      })
    } else {
      batch(() => {
        dispatch(addAssociatedChampion(champion.id))
        dispatch(addSelectedChampion(champion))
      })
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      setLoadAnimation(true)
    }
  }, [])

  return (
    <motion.li
      layout="position"
      id={'champion-container-' + champion.id}
      className={cx(
        'group flex cursor-pointer flex-col items-center justify-center list-none',
        !potatoMode && 'transition-colors duration-200 ease-in-out',
        isActive ? styles.animatedTileBg : 'hover:bg-white/20 bg-transparent'
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
          isActive && styles.animatedTileBgOverlay
        )}
      >
        <div
          className={cx(
            'border border-yellow-900 ring-brand-default group-hover:ring-2 group-hover:brightness-125 flex overflow-hidden',
            !potatoMode && 'transition-colors duration-100',
            isActive && 'border-2 border-yellow-500'
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
              blurDataURL={blurhashDecode(champion.placeholder)}
              onLoadingComplete={loadChampion}
              className={cx(
                !potatoMode && loadAnimation && 'blur-xl',
                !potatoMode &&
                  loadAnimation &&
                  css`
                    animation: unblur 0.5s cubic-bezier(0.87, 0, 0.13, 1) forwards;
                    @keyframes unblur {
                      0% {
                        filter: blur(24px);
                      }
                      100% {
                        filter: blur(0px);
                      }
                    }
                  `
              )}
            />
          ) : (
            <img width={60} height={60} src="/icons/champion-square.svg" alt={champion.name} />
          )}
        </div>
        <p
          className={cx(
            'text-center text-gray-200 group-hover:text-white',
            !potatoMode && 'transition-colors duration-100',
            champion.name.length < 10 ? 'text-sm' : 'text-xs',
            !champion && 'text-sm',
            isActive && 'text-yellow-300'
          )}
        >
          {champion.name}
        </p>
      </div>
    </motion.li>
  )
}

export default ChampionTile
