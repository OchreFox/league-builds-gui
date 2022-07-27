import Image from 'next/image'

import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import { GlobalState, useStateMachine } from 'little-state-machine'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { ChampionsSchema, DefaultChampion, Tag } from '../types/Champions'
import { CustomLoader } from '../utils/ImageLoader'
import Build from './Build'
import { PotatoModeContext } from './hooks/PotatoModeStore'
import { useChampions } from './hooks/useChampions'

const updateAssociatedChampions = (state: GlobalState, payload: number) => {
  return {
    itemBuild: {
      ...state.itemBuild,
      associatedChampions: [payload],
    },
  }
}

const resetAssociatedChampions = (state: GlobalState) => {
  return {
    itemBuild: {
      ...state.itemBuild,
      associatedChampions: [],
    },
  }
}

export const ChampionPicker = ({
  show,
  selectedChampion,
  setSelectedChampion,
  categoryFilter,
  searchQuery,
}: {
  show: boolean
  selectedChampion: ChampionsSchema
  setSelectedChampion: React.Dispatch<React.SetStateAction<ChampionsSchema>>
  categoryFilter: Tag
  searchQuery: string
}) => {
  const { championsData } = useChampions()
  const [filteredChampions, setFilteredChampions] = useState<ChampionsSchema[]>()
  const { state: potatoMode } = useContext(PotatoModeContext)
  const { actions, state } = useStateMachine({
    updateAssociatedChampions,
    resetAssociatedChampions,
  })
  const previousState = useRef({
    categoryFilter,
    searchQuery,
  })

  const setChampion = (champion: ChampionsSchema) => {
    if (selectedChampion.id !== champion.id) {
      actions.updateAssociatedChampions(champion.id)
    } else {
      actions.resetAssociatedChampions()
    }
  }

  const includesCategory = (champion: ChampionsSchema, category: Tag) => {
    if (category === Tag.All) {
      return true
    }
    return champion.tags.includes(category)
  }

  const matchesSearchQuery = (champion: ChampionsSchema, query: string) => {
    if (query) {
      let result = fuzzysort.single(query, champion.name)
      if (result) {
        return result?.score > -800
      }
      return false
    }
    return true
  }

  const filterChampions = () => {
    if (!championsData) {
      console.log('No champion data')
      return
    }

    let filterMethods: Array<Function> = [
      (champion: ChampionsSchema) => includesCategory(champion, categoryFilter),
      (champion: ChampionsSchema) => matchesSearchQuery(champion, searchQuery),
    ]
    let filteredData = Object.values(championsData)?.filter((champion) => {
      return filterMethods.every((method) => method(champion))
    })
    setFilteredChampions(filteredData)
  }

  useEffect(() => {
    if (championsData) {
      setFilteredChampions(championsData)
    }
  }, [championsData])

  useEffect(() => {
    if (state && championsData) {
      const champion = Object.values(championsData).find((champ) => champ.id === state.itemBuild.associatedChampions[0])
      console.log(champion)
      if (champion && champion.id) {
        // Initialize champion on refresh
        setSelectedChampion(champion)
      } else {
        setSelectedChampion(DefaultChampion)
      }
    }
  }, [state.itemBuild.associatedChampions, championsData])

  useEffect(() => {
    if (categoryFilter !== previousState.current.categoryFilter || searchQuery !== previousState.current.searchQuery) {
      previousState.current.categoryFilter = categoryFilter
      previousState.current.searchQuery = searchQuery
      filterChampions()
    }
  }, [previousState.current, categoryFilter, searchQuery])

  return (
    <div className="relative flex h-full max-h-full w-full origin-top overflow-hidden">
      {/* Build Editor */}
      <Build />
      {/* Overlay for Champion Picker */}
      <motion.div
        className={cx(
          'absolute h-full w-full bg-black/50',
          !potatoMode.enabled && '[@supports(backdrop-filter:blur(0))]:backdrop-blur'
        )}
        initial={{ y: '-100%' }}
        animate={show ? { y: 0 } : { y: '-100%' }}
        transition={{
          type: 'tween',
          ease: [0.87, 0, 0.13, 1],
          duration: 0.4,
        }}
      >
        <SimpleBar
          className={cx(
            'h-full overflow-y-auto',
            css`
              box-shadow: inset 0px 0px 25px 0px #000000;
            `
          )}
        >
          <ul className="m-4 grid grid-cols-6">
            {championsData &&
              filteredChampions &&
              Object.values(filteredChampions).map((champion) => (
                <motion.li
                  layout
                  id={'champion-' + champion.id}
                  key={'champion-' + champion.id}
                  className={cx(
                    'group mx-2 flex cursor-pointer flex-col items-center justify-center list-none py-2 hover:bg-white/40',
                    !potatoMode.enabled && 'transition-colors duration-100',
                    selectedChampion.id === champion.id && 'bg-white/20'
                  )}
                  onClick={() => setChampion(champion)}
                >
                  <div
                    className={cx(
                      'border border-yellow-900 ring-brand-default group-hover:ring-2 group-hover:brightness-125 flex',
                      !potatoMode.enabled && 'transition duration-100',
                      selectedChampion.id === champion.id && 'border-2 border-yellow-500'
                    )}
                  >
                    <Image
                      loader={CustomLoader}
                      width={64}
                      height={64}
                      src={champion.icon}
                      placeholder="blur"
                      blurDataURL={champion.placeholder}
                    />
                  </div>
                  <p
                    className={cx(
                      'text-center text-gray-200 group-hover:text-white',
                      !potatoMode.enabled && 'transition duration-100',
                      champion.name.length < 10 ? 'text-sm' : 'text-xs'
                    )}
                  >
                    {champion.name}
                  </p>
                </motion.li>
              ))}
          </ul>
        </SimpleBar>
      </motion.div>
    </div>
  )
}
