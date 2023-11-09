import Image from 'next/image'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { css, cx } from '@emotion/css'
import appsIcon from '@iconify/icons-tabler/apps'
import circleX from '@iconify/icons-tabler/circle-x'
import questionMark from '@iconify/icons-tabler/question-mark'
import { Icon } from '@iconify/react'
import { VariantLabels, motion } from 'framer-motion'
import { batch, useSelector } from 'react-redux'

import styles from '@/components/ChampionPicker/ChampionPickerCard.module.scss'
import ChampionPickerCardBackground from '@/components/ChampionPicker/ChampionPickerCardBackground'
import { ChampionSelectorSearch } from '@/components/ChampionPicker/ChampionSelectorSearch'
import RiotMagicParticles from '@/components/ChampionPicker/RiotMagicParticles'
import {
  ChampionPickerHover,
  championCardVariants,
  championNameVariants,
  championTitleVariants,
  descriptionHoverVariants,
  easeOutExpo,
  titleHoverVariants,
} from '@/components/ItemBuild/BuildMakerComponents'
import {
  selectChampionPicker,
  selectSelectedChampions,
  setChampionPickerHint,
  setChampionPickerHover,
  setChampionPickerQuery,
  setChampionPickerShow,
} from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { CustomLoader } from '@/utils/CustomLoader'
import { easeInOutExpo } from '@/utils/Transition'

const ChampionPickerCard = () => {
  const dispatch = useAppDispatch()
  const championPicker = useSelector(selectChampionPicker)
  const potatoMode = useSelector(selectPotatoMode)
  const selectedChampions = useSelector(selectSelectedChampions)

  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [hover, setHover] = useState(false)

  const selectedChampionsLength = useMemo(() => selectedChampions.length, [selectedChampions])

  const handleSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setChampionPickerQuery(event.target.value))
    },
    [dispatch]
  )

  const handleIconMouseEnter = useCallback(() => dispatch(setChampionPickerHint(true)), [dispatch])

  const championPickerAnimation = useMemo((): VariantLabels => {
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
  }, [championPicker.show, championPicker.hint, championPicker.isLoading])

  const title = useMemo((): string => {
    // Only show the first two champions in the title and the rest in the description
    if (selectedChampionsLength > 0) {
      return (
        selectedChampions
          .slice(0, 2)
          .map((champion) => champion.name)
          .join(', ') + (selectedChampionsLength > 2 ? ' , ...' : '')
      )
    }
    return 'Select Champions'
  }, [selectedChampions, selectedChampionsLength])

  const description = useMemo((): JSX.Element => {
    // If only one champion is selected, show the champion's title
    if (selectedChampionsLength === 1) {
      const champion = selectedChampions[0]
      return <>{champion.title}</>
    } else if (selectedChampionsLength > 1) {
      // Otherwise show the number of champions selected
      return (
        <span className="flex flex-row items-center">
          {selectedChampionsLength} champions selected
          {selectedChampions.map((champion) => (
            <Image
              loader={CustomLoader}
              key={champion.id}
              src={champion.icon}
              alt={champion.name}
              width={32}
              height={32}
              className="ml-1 rounded-full border-2 border-gray-800"
            />
          ))}
        </span>
      )
    }
    return <>Click to select champions</>
  }, [selectedChampions, selectedChampionsLength])

  const titleColor = useMemo((): string => {
    if (selectedChampions.length === 1) {
      return selectedChampions[0].colors?.[0]
    }
    return '#fff'
  }, [selectedChampions])

  useEffect(() => {
    if (cardRef.current) {
      setSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
    }
  }, [cardRef])

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
        <ChampionPickerCardBackground />
        {!potatoMode && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-cyan-700/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={easeOutExpo}
          >
            <video
              className="absolute left-0 top-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src="https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/effects/loop-magic-vertical.webm"
            />
            {size.width > 0 && size.height > 0 && <RiotMagicParticles width={size.width} height={size.height} />}
          </motion.div>
        )}
        <motion.div
          variants={titleHoverVariants}
          animate={championPickerAnimation}
          transition={easeInOutExpo}
          className="pointer-events-none relative"
        >
          <motion.h3
            className={cx(
              'pointer-events-none select-none font-league text-3xl font-bold drop-shadow-md',
              css`
                color: ${titleColor};
              `
            )}
            variants={championNameVariants}
            initial="initial"
            animate="animate"
            transition={easeInOutExpo}
          >
            {title}
          </motion.h3>
          <motion.p
            className="pointer-events-none h-8 select-none font-body text-sm capitalize text-gray-300"
            variants={championTitleVariants}
            initial="initial"
            animate="animate"
          >
            {description}
          </motion.p>
          <Icon
            className="pointer-events-auto absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white/50 p-0.5 text-gray-700"
            icon={questionMark}
            onMouseEnter={handleIconMouseEnter}
          />
        </motion.div>
        <ChampionPickerHover
          className={cx(
            'absolute bottom-0 -ml-4 flex h-full w-full select-none items-center justify-center overflow-hidden text-center',
            !potatoMode && '[@supports(backdrop-filter:blur(0))]:backdrop-blur'
          )}
          variants={descriptionHoverVariants}
          initial="default"
          animate={championPickerAnimation}
          transition={easeInOutExpo}
        >
          <span
            className={cx(
              championPicker.show ? 'bg-brand-dark' : 'border-2 border-brand-light',
              'inline-flex items-center rounded-full px-2 py-0.5 font-bold text-white transition duration-200'
            )}
          >
            <Icon
              icon={championPicker.show ? circleX : appsIcon}
              inline={true}
              className="mr-1"
              width="20"
              height="20"
            />
            Open champion picker
          </span>
        </ChampionPickerHover>
        {/* Champion Selector search */}
        <ChampionSelectorSearch
          championPickerAnimation={championPickerAnimation}
          handleSearchQuery={handleSearchQuery}
        />
      </motion.div>
    </motion.div>
  )
}

export default ChampionPickerCard
