import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import { GlobalState, useStateMachine } from 'little-state-machine'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { ChampionsSchema, DefaultChampion, Tag } from '../types/Champions'
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
        <SimpleBar className="h-full overflow-y-auto">
          <div className="m-4 grid grid-cols-6">
            {championsData &&
              filteredChampions &&
              Object.values(filteredChampions).map((champion) => (
                <motion.div
                  layout
                  key={'champion-' + champion.id}
                  className={cx(
                    'group mx-2 flex cursor-pointer flex-col items-center justify-center py-2 hover:bg-white/40',
                    !potatoMode.enabled && 'transition-colors duration-100',
                    selectedChampion.id === champion.id && 'bg-white/20'
                  )}
                  onClick={() => setChampion(champion)}
                >
                  <img
                    src={champion.icon}
                    className={cx(
                      'h-16 w-16 border border-yellow-900 ring-brand-default group-hover:ring-2 group-hover:brightness-125',
                      !potatoMode.enabled && 'transition duration-100',
                      selectedChampion.id === champion.id && 'border-2 border-yellow-500'
                    )}
                  />
                  <p
                    className={cx(
                      'text-center text-gray-200 group-hover:text-white',
                      !potatoMode.enabled && 'transition duration-100',
                      champion.name.length < 10 ? 'text-sm' : 'text-xs'
                    )}
                  >
                    {champion.name}
                  </p>
                </motion.div>
              ))}
          </div>
        </SimpleBar>
      </motion.div>
    </div>
  )
}
