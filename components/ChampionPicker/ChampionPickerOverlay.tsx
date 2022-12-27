import { css, cx } from '@emotion/css'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import LoadingSpinner from 'components/basic/LoadingSpinner'

import { ChampionsSchema, Tag } from '../../types/Champions'
import { useChampions } from '../hooks/useChampions'
import { selectPotatoMode } from '../store/potatoModeSlice'
import ChampionTile from './ChampionTile'

const ChampionPickerOverlay = ({
  show,
  categoryFilter,
  searchQuery,
}: {
  show: boolean
  categoryFilter: Tag
  searchQuery: string
}) => {
  const { championsData } = useChampions()
  const potatoMode = useSelector(selectPotatoMode)
  const [filteredChampions, setFilteredChampions] = useState<ChampionsSchema[]>([])
  const [renderOverlay, setRenderOverlay] = useState(false)
  const [renderChampions, setRenderChampions] = useState(false)

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

  const filters = React.useMemo(() => {
    const filters = [
      (champion: ChampionsSchema) => includesCategory(champion, categoryFilter),
      (champion: ChampionsSchema) => matchesSearchQuery(champion, searchQuery),
    ]
    return filters
  }, [categoryFilter, searchQuery])

  // Filter data when categoryFilter or searchQuery changes
  useEffect(() => {
    if (championsData) {
      if (categoryFilter === Tag.All && !searchQuery) {
        setFilteredChampions(Object.values(championsData))
      } else {
        const filtered = Object.values(championsData).filter((champion) => {
          return filters.every((filter) => filter(champion))
        })
        setFilteredChampions(filtered)
      }
    }
  }, [championsData, filters])

  // Detect when show changes to true for the first time
  useEffect(() => {
    if (show && !renderOverlay) {
      setRenderOverlay(true)
    }
  }, [show])

  return (
    <AnimatePresence>
      {renderOverlay && (
        <motion.div
          key="champion-picker"
          className={cx(
            'absolute h-full w-full select-none',
            potatoMode ? 'bg-slate-900' : 'bg-black/50 backdrop-blur',
            !show && 'pointer-events-none'
          )}
          initial={{ y: '-100%' }}
          animate={show ? { y: 0 } : { y: '-100%' }}
          exit={{ y: '-100%' }}
          transition={{
            type: 'tween',
            ease: [0.87, 0, 0.13, 1],
            duration: 0.4,
          }}
          onAnimationComplete={() => {
            setRenderChampions(true)
          }}
        >
          {!renderChampions && <LoadingSpinner />}
          <SimpleBar
            className={cx(
              'h-full overflow-y-auto',
              css`
                box-shadow: inset 0px 0px 25px 0px #000000;
                position: relative;
              `
            )}
          >
            <ul className="m-4 grid grid-cols-6 h-full gap-2">
              <LayoutGroup>
                <AnimatePresence>
                  {renderChampions &&
                    filteredChampions.map((champion) => (
                      <ChampionTile key={'champion-container-key-' + champion.id} champion={champion} />
                    ))}
                </AnimatePresence>
              </LayoutGroup>
            </ul>
          </SimpleBar>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChampionPickerOverlay
