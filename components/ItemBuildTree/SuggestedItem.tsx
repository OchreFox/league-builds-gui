import Image from 'next/image'

import { setItemPickerDraggedItem, setItemPickerSelectedItem } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import React, { RefObject } from 'react'
import { ItemRefArrayType } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { CustomLoader } from 'utils/CustomLoader'

import { scrollIntoItem } from './BuildTreeComponents'

const SuggestedItem = ({
  item,
  index,
  triggerSelection,
  itemRefArray,
  itemGridRef,
}: {
  item: ItemsSchema
  index: number
  triggerSelection: number | null | undefined
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}) => {
  const dispatch = useAppDispatch()

  return (
    <div
      key={index}
      className={cx(
        'group -m-1 flex cursor-pointer flex-col items-center bg-gray-900 p-2 text-center',
        triggerSelection === item.id && 'border-2 border-dashed border-yellow-500/75'
      )}
      onClick={() => {
        dispatch(setItemPickerSelectedItem(item))
        scrollIntoItem(item, itemRefArray, itemGridRef)
      }}
      draggable={true}
      onDragStart={(e) => {
        dispatch(setItemPickerDraggedItem(item.id))
        e.dataTransfer.setData(
          'text/plain',
          JSON.stringify({
            item: item,
            isMythic: item.mythic,
          })
        )
        e.currentTarget.style.opacity = '0.4'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
      }}
      onDragEnd={(e) => {
        dispatch(setItemPickerDraggedItem(null))
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }}
    >
      <div className="h-10 w-10 border border-black object-cover ring-1 ring-yellow-700 duration-100 group-hover:z-30 group-hover:ring-2 group-hover:brightness-125 ">
        <Image
          loader={CustomLoader}
          key={'into-' + item.id + '-' + item.name}
          src={item.icon ?? ''}
          alt={item.name ?? ''}
          width={50}
          height={50}
        />
      </div>
      <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.gold?.total}</p>
    </div>
  )
}

export default SuggestedItem
