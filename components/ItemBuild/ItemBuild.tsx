import React, { useEffect } from 'react'

import { batch, useSelector } from 'react-redux'
import { ChampionsSchema } from 'types/Champions'

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

import ChampionPickerCard from 'components/ChampionPicker/ChampionPickerCard'
import { BuildContainer } from 'components/ItemBuild/BuildContainer'
import LinearProgress from 'components/basic/LinearProgress'

import { getChampionSplash } from './BuildMakerComponents'

export const ItemBuild = () => {
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
          fetchChampionSplash(champion).catch((error) => {
            console.error(`Error fetching champion splash art for champion ${champion.name}: ${error}`)
          })
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
