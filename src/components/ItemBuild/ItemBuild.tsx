import React, { useCallback, useEffect } from 'react'

import { BuildContainer } from '@/components/ItemBuild/BuildContainer'
import LinearProgress from '@/components/basic/LinearProgress'
import { useSelector } from 'react-redux'
import { ChampionsSchema } from '@/types/Champions'

import ChampionPickerCard from '@/components/ChampionPicker/ChampionPickerCard'
import { getChampionSplash } from '@/components/ItemBuild/BuildMakerComponents'
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

export const ItemBuild = () => {
  const dispatch = useAppDispatch()
  const { championsData } = useChampions()
  const selectedChampions = useSelector(selectSelectedChampions)
  const championPicker = useSelector(selectChampionPicker)
  const { draggedItem } = useSelector(selectItemPicker)

  const fetchChampionSplash = useCallback(
    async (champion: ChampionsSchema) => {
      dispatch(setChampionPickerIsLoading(true))
      const response = await getChampionSplash(champion.id)
      dispatch(updateSelectedChampion({ ...champion, ...response }))
      dispatch(setChampionPickerHover(false))
      dispatch(setChampionPickerIsLoading(false))
    },
    [dispatch]
  )

  useEffect(() => {
    // Fetch champion splash art when the selected champion changes
    if (championsData && selectedChampions.length > 0) {
      selectedChampions.forEach((champion) => {
        if (!champion.splash) {
          fetchChampionSplash(champion).catch((error) => {
            console.error(`Error fetching champion splash art for champion ${champion.name}: ${error}`)
          })
        }
      })
    }
  }, [championsData, fetchChampionSplash, selectedChampions])

  useEffect(() => {
    if (draggedItem) {
      dispatch(setChampionPickerShow(false))
    }
  }, [dispatch, draggedItem])

  return (
    <>
      <ChampionPickerCard />
      <div className="h-full w-full md:relative">
        {/* Loading Progress Bar */}
        <LinearProgress show={championPicker.isLoading} />
        {/* Build editor / Champion Picker */}
        <BuildContainer
          show={championPicker.show}
          categoryFilter={championPicker.category}
          searchQuery={championPicker.query}
        />
      </div>
    </>
  )
}
