import useSWR from 'swr'

import { ItemsSchema } from '../../types/Items'
import JSONFetcher from '../../utils/JSONFetcher'

export const useItems = () => {
  const { data, error } = useSWR<Array<ItemsSchema>>(
    // 'https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/latest/items.json',
    'https://cdn.ochrefox.net/data/latest/items.json',
    JSONFetcher
  )

  return {
    items: data,
    itemsError: error,
  }
}
