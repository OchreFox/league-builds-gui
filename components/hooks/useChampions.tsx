import useSWR from 'swr'

import { ChampionsSchema } from '../../types/Champions'
import JSONFetcher from '../JSONFetcher'

export const useChampions = () => {
  const { data, error } = useSWR<Array<ChampionsSchema>>(
    // 'https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/latest/champions-summary.json',
    'https://cdn.ochrefox.net/data/latest/champions-summary.json',
    JSONFetcher
  )

  return {
    championsData: data,
    championsError: error,
  }
}
