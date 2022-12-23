import { selectItemFilters, setItemFiltersClass } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import _ from 'lodash'
import { RefObject } from 'react'
import { useSelector } from 'react-redux'
import { ItemRefArrayType } from 'types/FilterProps'
import { ChampionClass, ItemsSchema } from 'types/Items'

import { getPluralFromItems, isFromChampionClass } from 'components/ItemGrid/ItemGridComponents'

import SuggestedItem from './SuggestedItem'

export const BuildSuggestions = ({
  items,
  baseItem,
  triggerSelection,
  itemRefArray,
  itemGridRef,
}: {
  items: ItemsSchema[]
  baseItem: ItemsSchema
  triggerSelection: number | null | undefined
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}) => {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  if (!items || !baseItem || !baseItem.into) {
    return null
  }

  let itemBuilds: ItemsSchema[] = []
  baseItem.into.forEach((itemId) => {
    const item = Object.values(items).find((x) => x.id === itemId && x.inStore && x.tier > 0)
    if (item) {
      itemBuilds.push(item)
    }
  })
  if (itemBuilds.length === 0) {
    return null
  }
  let filteredItemBuilds = itemBuilds.filter((x) => {
    return isFromChampionClass(x, itemFilters.class)
  })
  const delta = itemBuilds.length - filteredItemBuilds.length
  // Sort the item builds by gold cost
  filteredItemBuilds = _.orderBy(filteredItemBuilds, ['gold.total'], ['asc'])

  // Return a list of items in the baseItem.ItemsSchema array
  return (
    <>
      <p className={cx('mt-4 text-sm text-gray-400', delta === 0 && 'mb-4')}>
        Builds into
        <b className="text-gray-200">
          {' '}
          {filteredItemBuilds.length} {getPluralFromItems(filteredItemBuilds)}
        </b>
      </p>
      {delta > 0 && (
        <p
          className="mb-4 cursor-pointer text-xs italic text-cyan-400 hover:underline"
          onClick={() => dispatch(setItemFiltersClass(ChampionClass.None))}
        >
          <b className="text-cyan-200"> {delta} </b>
          <span>more {getPluralFromItems(delta)} hidden by champion class filters</span>
        </p>
      )}
      <div className="grid grid-cols-5 gap-2">
        {filteredItemBuilds.map((item, index) => {
          if (!item) {
            return null
          }
          return (
            <SuggestedItem
              key={item.id + '-' + item.name + '-suggested-item'}
              item={item}
              index={index}
              triggerSelection={triggerSelection}
              itemRefArray={itemRefArray}
              itemGridRef={itemGridRef}
            />
          )
        })}
      </div>
    </>
  )
}
