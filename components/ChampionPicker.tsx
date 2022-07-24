import Image from 'next/image'

import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import { GlobalState, useStateMachine } from 'little-state-machine'
import React, { useContext, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { ChampionsSchema, DefaultChampion, Tag } from '../types/Champions'
import { StaticallyLoader } from '../utils/ImageLoader'
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
                  <div
                    className={cx(
                      'border border-yellow-900 ring-brand-default group-hover:ring-2 group-hover:brightness-125 flex',
                      !potatoMode.enabled && 'transition duration-100',
                      selectedChampion.id === champion.id && 'border-2 border-yellow-500'
                    )}
                  >
                    <Image
                      loader={StaticallyLoader}
                      width={64}
                      height={64}
                      src={champion.icon}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzNjAgMzYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzNjAgMzYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNMjA5LjQsMzMuNGMtMjQuMi04LjQtNDMuNy03LjQtNjguNywzLjNjLTIzLjgsMTAuNC00OCwzMi40LTU4LjMsNTMuNWMtOS45LDIwLjQtMTAuOSwyNy4zLTEyLjYsNzguNQ0KCQljLTAuNywyNS41LTIuMiw0OC44LTMsNTEuOGMtMi4zLDctOS4zLDE4LjktMTIuNiwyMS44Yy0zLjgsMy0zLjMsNi41LDIuNSwyMWM2LjYsMTcsMTguMiwzNS4zLDI5LDQ2YzEwLjQsMTAuNCwyOSwyMC4yLDQxLjcsMjEuNw0KCQlsOC44LDEuMmwtNS04LjFjLTE1LjItMjQuNy0xNy40LTYwLjMtNS44LTk3YzIuMy03LjEsMy44LTEzLjYsMy4zLTE0LjRjLTAuNS0wLjgtMy0yLTUuNS0yLjZjLTcuNC0xLjgtMTguNC05LjEtMjQuNS0xNi4yDQoJCWMtOS44LTExLjQtMTEuMy0yNC43LTQuOC00MC45bDIuOC03bDguOSwxYzE5LjIsMi4zLDM4LjQsMTMuMiw1MC4yLDI4LjVsNyw4LjhsLTAuMiwzOS42bC0wLjMsMzkuNmw0LjMsNS4zDQoJCWMyLjUsMi44LDYuNSw2LjYsOS4xLDguNGw0LjYsMy4zbDguNC03LjZsOC40LTcuNnYtNDAuOXYtNDEuMWw0LjYtNi41YzEyLjYtMTcuNCwzNi42LTMwLjUsNTUuOS0zMC41YzQuOCwwLDUuNiwwLjcsNy45LDcuOA0KCQljNCwxMS40LDMuNSwyNS0xLjIsMzMuOGMtNC41LDguMy0xNS45LDE3LjctMjYuMywyMS41Yy04LjQsMy4xLTguNCwzLjUtMi4yLDIzLjhjNC4xLDEzLjIsNC42LDE3LjQsNC44LDM4LjkNCgkJYzAuMiwyNi44LTEuMywzMy42LTExLjQsNTAuNWwtNS44LDkuNmw4LjYtMS4yYzEyLjctMS41LDMxLjUtMTEuMyw0MS43LTIxLjdjNC44LTQuOCwxMi4yLTE0LjIsMTYuNC0yMC45DQoJCWM3LjQtMTEuOSwxNy43LTM1LjYsMTcuNy00MC42YzAtMS4zLTMtNi4xLTYuNi0xMC44Yy0zLjUtNC41LTcuMy0xMS4xLTguNC0xNC40Yy0xLTMuNS0yLjUtMjYuNS0zLjEtNTMuM2MtMS0zNC4zLTIuMi00OS44LTQtNTcuMQ0KCQlDMjc2LjQsNzYuNSwyNDcuNCw0Ni41LDIwOS40LDMzLjR6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="
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
                </motion.div>
              ))}
          </div>
        </SimpleBar>
      </motion.div>
    </div>
  )
}
