import { css, cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { VariantLabels, motion } from 'framer-motion'
import { useStateMachine } from 'little-state-machine'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { ChampionsSchema, DefaultChampion, Tag } from '../types/Champions'
import { easeInOutExpo } from '../utils/Transition'
import {
  ChampionPickerHover,
  ResponseType,
  championCardVariants,
  championNameVariants,
  championPickerVariants,
  championTitleVariants,
  descriptionHoverVariants,
  easeOutExpo,
  getChampionSplash,
  titleHoverVariants,
} from './BuildMakerComponents'
import { ChampionPicker } from './ChampionPicker'
import LinearProgress from './LinearProgress'
import { PotatoModeContext } from './hooks/PotatoModeStore'
import { useChampions } from './hooks/useChampions'

export const BuildMaker = () => {
  const { championsData } = useChampions()
  const { state: potatoMode } = useContext(PotatoModeContext)
  const [selectedChampion, setSelectedChampion] = useState<ChampionsSchema>(DefaultChampion)
  const [championSplash, setChampionSplash] = useState<ResponseType>()
  const [showChampionPicker, setShowChampionPicker] = useState(false)
  const [hoverChampionPicker, setHoverChampionPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Tag>(Tag.All)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value)
    },
    [searchQuery]
  )

  const { state } = useStateMachine()
  // const previousState = useRef({ state })

  const fetchChampionSplash = async (champion: ChampionsSchema) => {
    setIsLoading(true)
    const response = await getChampionSplash(champion.id)
    setChampionSplash(response)
    setHoverChampionPicker(false)
    setShowChampionPicker(false)
    setIsLoading(false)
  }

  const getChampionPickerAnimation = (): VariantLabels => {
    if (isLoading) {
      return 'loading'
    }
    if (showChampionPicker) {
      return 'click'
    }
    if (hoverChampionPicker) {
      return 'hover'
    }
    return 'default'
  }

  useEffect(() => {
    // Initialize champion splash art
    if (championsData) {
      console.log(selectedChampion)
      fetchChampionSplash(selectedChampion)
    }
  }, [selectedChampion])

  return (
    <div className="flex h-full w-full flex-col" id="build-maker">
      {selectedChampion && (
        // Champion Card
        <motion.div
          className={cx(
            'group relative z-10 flex cursor-pointer flex-col shadow-lg transition duration-150 hover:ring-2 hover:ring-orange-500',
            css`
              background-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%),
                url(${championSplash?.championSplash});
              background-size: cover;
              background-position: '0% 26%';
            `
          )}
          variants={championCardVariants}
          initial="initial"
          animate="animate"
          transition={easeOutExpo}
          onClick={() => setShowChampionPicker(!showChampionPicker)}
          onMouseEnter={() => setHoverChampionPicker(true)}
          onMouseLeave={() => setHoverChampionPicker(false)}
        >
          <motion.div className="relative flex flex-col overflow-hidden p-4" transition={easeInOutExpo}>
            <motion.div variants={titleHoverVariants} animate={getChampionPickerAnimation()} transition={easeInOutExpo}>
              <motion.h3
                className={cx(
                  'font-body text-2xl font-bold',
                  css`
                    color: ${championSplash?.colors?.[0]};
                  `
                )}
                variants={championNameVariants}
                initial="initial"
                animate="animate"
                transition={easeInOutExpo}
              >
                {selectedChampion.name}
              </motion.h3>
              <motion.p
                className="font-body text-sm capitalize text-gray-300"
                variants={championTitleVariants}
                initial="initial"
                animate="animate"
              >
                {selectedChampion.title}
              </motion.p>
              <div className="absolute bottom-0 -mb-2 flex w-full justify-end">
                <Icon className="text-white/50" icon="tabler:chevron-up" width="24" height="24" />
              </div>
            </motion.div>
            <ChampionPickerHover
              className={cx(
                'absolute bottom-0 -ml-4 flex h-full w-full select-none items-center justify-center overflow-hidden text-center',
                !potatoMode.enabled && '[@supports(backdrop-filter:blur(0))]:backdrop-blur'
              )}
              variants={descriptionHoverVariants}
              initial="default"
              animate={getChampionPickerAnimation()}
              transition={easeInOutExpo}
            >
              <span
                className={cx(
                  showChampionPicker ? 'bg-brand-dark' : 'border-2 border-brand-light',
                  'inline-flex items-center rounded-full px-2 py-0.5 font-bold text-white transition duration-200'
                )}
              >
                <Icon
                  icon={showChampionPicker ? 'tabler:circle-x' : 'tabler:apps'}
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
                <div className="absolute inset-0 z-10 px-6 py-4">
                  <div className="flex" onClick={(e) => e.stopPropagation()}>
                    <select
                      className="z-10 rounded-l-lg border border-gray-600 bg-gray-700 py-2.5 px-4 font-sans text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-light"
                      onChange={(e) => {
                        setSelectedCategory(e.target.value as Tag)
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
                        {/* Heroicon name: solid/search */}
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
                <div className="absolute bottom-0 right-0 mb-1 mr-1 flex w-full items-center justify-center font-sans text-xs font-normal text-white/50 transition duration-100 group-hover:text-white">
                  <Icon className="" icon="tabler:x" width="16" height="16" /> CLOSE
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      <div className="relative h-full w-full">
        {/* Loading Progress Bar */}
        <LinearProgress show={isLoading} />
        {/* Champion Picker */}
        <ChampionPicker
          show={showChampionPicker}
          selectedChampion={selectedChampion}
          setSelectedChampion={setSelectedChampion}
          categoryFilter={selectedCategory}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}
