import Image from 'next/image'

import {
  selectChampionPicker,
  selectSelectedChampions,
  setChampionPickerCategory,
  setChampionPickerHint,
  setChampionPickerHover,
  setChampionPickerQuery,
  setChampionPickerShow,
} from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { VariantLabels, Variants, motion, useAnimation } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { batch, useSelector } from 'react-redux'
import { Tag } from 'types/Champions'

import {
  ChampionPickerHover,
  championCardVariants,
  championNameVariants,
  championPickerVariants,
  championTitleVariants,
  descriptionHoverVariants,
  easeOutExpo,
  titleHoverVariants,
} from 'components/ItemBuild/BuildMakerComponents'

import { CustomLoader } from 'utils/CustomLoader'
import { easeInOutExpo } from 'utils/Transition'

import styles from './ChampionPickerCard.module.scss'
import ChampionPickerCardBackground from './ChampionPickerCardBackground'
import RiotMagicParticles from './RiotMagicParticles'

const ChampionPickerCard = () => {
  const dispatch = useAppDispatch()
  const championPicker = useSelector(selectChampionPicker)
  const potatoMode = useSelector(selectPotatoMode)
  const selectedChampions = useSelector(selectSelectedChampions)
  const previousValues = useRef({
    selectedChampions: selectedChampions,
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (cardRef.current) {
      setSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
    }
  }, [cardRef])

  const handleSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setChampionPickerQuery(event.target.value))
    },
    [championPicker.query]
  )
  const getChampionPickerAnimation = (): VariantLabels => {
    if (championPicker.isLoading) {
      return 'loading'
    }
    if (championPicker.show) {
      return 'click'
    }
    if (championPicker.hint) {
      return 'hover'
    }
    return 'default'
  }

  const title = (): string => {
    // Only show the first two champions in the title and the rest in the description
    if (selectedChampions.length > 0) {
      return (
        selectedChampions
          .slice(0, 2)
          .map((champion) => champion.name)
          .join(', ') + (selectedChampions.length > 2 ? ' , ...' : '')
      )
    }
    return 'Select Champions'
  }

  const description = (): JSX.Element => {
    // If only one champion is selected, show the champion's title
    if (selectedChampions.length === 1) {
      const champion = selectedChampions[0]
      return <>{champion.title}</>
    } else if (selectedChampions.length > 1) {
      // Otherwise show the number of champions selected
      return (
        <span className="flex flex-row items-center">
          {selectedChampions.length} champions selected
          {selectedChampions.map((champion) => (
            <Image
              loader={CustomLoader}
              key={champion.id}
              src={champion.icon}
              alt={champion.name}
              width={32}
              height={32}
              className="rounded-full ml-1 border-2 border-gray-800"
            />
          ))}
        </span>
      )
    }
    return <>Click to select champions</>
  }

  const titleColor = (): string => {
    if (selectedChampions.length === 1) {
      return selectedChampions[0].colors?.[0]
    }
    return '#fff'
  }

  return (
    <motion.div
      className={cx(
        'group relative z-10 flex cursor-pointer flex-col shadow-lg transition duration-150 hover:ring-2 hover:ring-orange-500',
        styles.container,
        !championPicker.show && styles['container-sweep']
      )}
      variants={championCardVariants}
      initial="initial"
      animate="animate"
      transition={easeOutExpo}
      onClick={() => dispatch(setChampionPickerShow(!championPicker.show))}
      onMouseEnter={() => {
        setHover(true)
        dispatch(setChampionPickerHover(true))
      }}
      onMouseLeave={() => {
        setHover(false)
        batch(() => {
          dispatch(setChampionPickerHover(false))
          dispatch(setChampionPickerHint(false))
        })
      }}
    >
      <motion.div className="relative flex flex-col overflow-hidden p-4" transition={easeInOutExpo} ref={cardRef}>
        <ChampionPickerCardBackground champions={selectedChampions} />
        {!potatoMode && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-cyan-700/30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={easeOutExpo}
          >
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="/effects/loop-magic-vertical.webm"
            />
            {size.width > 0 && size.height > 0 && <RiotMagicParticles width={size.width} height={size.height} />}
          </motion.div>
        )}
        <motion.div
          variants={titleHoverVariants}
          animate={getChampionPickerAnimation()}
          transition={easeInOutExpo}
          className="relative pointer-events-none"
        >
          <motion.h3
            className={cx(
              'font-body text-2xl font-bold select-none pointer-events-none',
              css`
                color: ${titleColor()};
              `
            )}
            variants={championNameVariants}
            initial="initial"
            animate="animate"
            transition={easeInOutExpo}
          >
            {title()}
          </motion.h3>
          <motion.p
            className="h-8 font-body text-sm capitalize text-gray-300 select-none pointer-events-none"
            variants={championTitleVariants}
            initial="initial"
            animate="animate"
          >
            {description()}
          </motion.p>
          <Icon
            className="text-gray-700 bg-white/50 p-1 rounded-full absolute bottom-0 right-0 pointer-events-auto"
            icon="tabler:chevron-up"
            width="24"
            height="24"
            onMouseEnter={() => dispatch(setChampionPickerHint(true))}
          />
        </motion.div>
        <ChampionPickerHover
          className={cx(
            'absolute bottom-0 -ml-4 flex h-full w-full select-none items-center justify-center overflow-hidden text-center',
            !potatoMode && '[@supports(backdrop-filter:blur(0))]:backdrop-blur'
          )}
          variants={descriptionHoverVariants}
          initial="default"
          animate={getChampionPickerAnimation()}
          transition={easeInOutExpo}
        >
          <span
            className={cx(
              championPicker.show ? 'bg-brand-dark' : 'border-2 border-brand-light',
              'inline-flex items-center rounded-full px-2 py-0.5 font-bold text-white transition duration-200'
            )}
          >
            <Icon
              icon={championPicker.show ? 'tabler:circle-x' : 'tabler:apps'}
              inline={true}
              className="mr-1"
              width="20"
              height="20"
            />
            Open champion picker
          </span>
        </ChampionPickerHover>
        <motion.div
          className={cx(
            'absolute bottom-0 -ml-4 flex h-full w-full select-none items-center justify-center overflow-hidden font-body text-xl font-bold text-gray-200',
            css`
              background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 1) 100%),
                url('/background-default.webp');
              background-size: cover;
            `
          )}
          variants={championPickerVariants}
          initial="default"
          animate={getChampionPickerAnimation()}
          transition={easeInOutExpo}
        >
          <div className="relative flex h-full w-full items-center justify-center text-center">
            <div className="z-10 px-6 py-2">
              <div className="flex" onClick={(e) => e.stopPropagation()}>
                <select
                  className="z-10 rounded-l-lg border border-gray-600 bg-gray-700 py-2.5 px-4 font-sans text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-light"
                  onChange={(e) => {
                    dispatch(setChampionPickerCategory(e.target.value as Tag))
                  }}
                >
                  {Object.values(Tag).map((championClass) => (
                    <option
                      key={'champion-class-' + championClass}
                      value={championClass}
                      className="inline-flex w-full py-2 px-4 hover:bg-gray-600 hover:text-white"
                    >
                      {championClass}
                    </option>
                  ))}
                </select>
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6  6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="z-20 block w-full rounded-r-lg border border-l-0 border-gray-600 bg-gray-900 p-2.5 pl-10 font-sans text-sm text-white placeholder-gray-400 focus:border-brand-light focus:ring-brand-light"
                    placeholder="Search champions"
                    onChange={handleSearchQuery}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center font-sans text-xs font-normal text-white/50 transition duration-100 group-hover:text-white">
              <Icon className="" icon="tabler:x" width="16" height="16" /> CLOSE
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ChampionPickerCard
