import { css, cx } from '@emotion/css'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

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
  const [filteredChampions, setFilteredChampions] = React.useState<ChampionsSchema[]>([])

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
      const filtered = Object.values(championsData).filter((champion) => {
        return filters.every((filter) => filter(champion))
      })
      setFilteredChampions(filtered)
    }
  }, [championsData, filters])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="champion-picker"
          className={cx(
            'absolute h-full w-full bg-black/50 select-none',
            !potatoMode && '[@supports(backdrop-filter:blur(0))]:backdrop-blur'
          )}
          initial={{ y: '-100%' }}
          animate={show ? { y: 0 } : { y: '-100%' }}
          exit={{ y: '-100%' }}
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
            <ul className="m-4 grid grid-cols-6 h-full gap-2">
              <LayoutGroup>
                <AnimatePresence>
                  {championsData &&
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
