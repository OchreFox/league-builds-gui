import { useChampions } from '@/hooks/useChampions'
import {
  selectChampionPicker,
  selectItemPicker,
  selectSelectedChampions,
  setChampionPickerHover,
  setChampionPickerIsLoading,
  setChampionPickerShow,
  updateSelectedChampion,
} from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import React, { useEffect } from 'react'
import { batch, useSelector } from 'react-redux'
import { ChampionsSchema } from 'types/Champions'

import ChampionPickerCard from 'components/ChampionPicker/ChampionPickerCard'
import { ChampionPickerContainer } from 'components/ChampionPicker/ChampionPickerContainer'
import LinearProgress from 'components/basic/LinearProgress'

import { getChampionSplash } from './BuildMakerComponents'

export const BuildMaker = () => {
  const dispatch = useAppDispatch()
  const { championsData } = useChampions()
  const selectedChampions = useSelector(selectSelectedChampions)
  const championPicker = useSelector(selectChampionPicker)
  const { draggedItem } = useSelector(selectItemPicker)

  const fetchChampionSplash = async (champion: ChampionsSchema) => {
    dispatch(setChampionPickerIsLoading(true))
    const response = await getChampionSplash(champion.id)
    batch(() => {
      dispatch(updateSelectedChampion({ ...champion, ...response }))
      dispatch(setChampionPickerHover(false))
      dispatch(setChampionPickerIsLoading(false))
    })
  }

  useEffect(() => {
    // Fetch champion splash art when the selected champion changes
    if (championsData && selectedChampions.length > 0) {
      selectedChampions.forEach((champion) => {
        if (!champion.splash) {
          fetchChampionSplash(champion)
        }
      })
    }
  }, [selectedChampions])

  useEffect(() => {
    if (draggedItem) {
      dispatch(setChampionPickerShow(false))
    }
  }, [draggedItem])

  return (
    <div className="flex h-full w-full flex-col" id="build-maker">
      <ChampionPickerCard />
      <div className="relative h-full w-full">
        {/* Loading Progress Bar */}
        <LinearProgress show={championPicker.isLoading} />
        {/* Champion Picker */}
        <ChampionPickerContainer
          show={championPicker.show}
          categoryFilter={championPicker.category}
          searchQuery={championPicker.query}
        />
      </div>
    </div>
  )
}
