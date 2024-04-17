import Image from 'next/image'

import { RefObject } from 'react'

import { css, cx } from '@emotion/css'
import { ItemRefArrayType } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { BuildTreeItems } from '@/components/ItemBuildTree/BuidTreeItems'
import { getItemBuildTree } from '@/components/ItemBuildTree/BuildTreeComponents'
import { setItemPickerDraggedItem, setItemPickerSelectedItem } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import CustomLoader from 'utils/CustomLoader'

export const BuildTreeItem = ({
  item,
  items,
  index,
  depth,
  baseItem,
  setTriggerSelection,
  itemRefArray,
  itemGridRef,
}: {
  item: ItemsSchema
  items: ItemsSchema[]
  index: number
  depth: number
  baseItem: ItemsSchema
  setTriggerSelection: React.Dispatch<React.SetStateAction<number | null | undefined>>
  itemRefArray: ItemRefArrayType
  itemGridRef: RefObject<HTMLDivElement>
}) => {
  const dispatch = useAppDispatch()
  return (
    <div key={index} className="-m-1 flex items-center px-2 py-2 text-center">
      <div
        className={cx(
          'group mt-6 flex flex-col items-center justify-center',
          item.from && item.from.length > 0 && 'mr-10'
        )}
        onDragStart={(e) => {
          dispatch(setItemPickerDraggedItem(item.id))
          e.dataTransfer.setData('text/plain', JSON.stringify(item))
          e.currentTarget.style.opacity = '0.4'
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
        }}
        onDragEnd={(e) => {
          dispatch(setItemPickerDraggedItem(null))
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        }}
      >
        <button
          className={cx(
            'relative before:bg-transparent before:transition-colors before:duration-200 before:ease-in-out before:hover:bg-white/25',
            css`
              &:hover {
                &:before {
                  --bg-size: 0.75rem;
                  content: '';
                  position: absolute;
                  width: calc(100% + var(--bg-size));
                  height: calc(100% + var(--bg-size));
                  z-index: -1;
                  top: calc(-1 * var(--bg-size) / 2);
                  left: calc(-1 * var(--bg-size) / 2);
                }
              }
            `
          )}
          onClick={(e) => {
            setTriggerSelection(baseItem.id)
            dispatch(setItemPickerSelectedItem(item))
            e.stopPropagation()
          }}
        >
          <div className="h-10 w-10 border border-black object-cover ring-1 ring-yellow-700">
            <Image
              key={item.id + '-' + item.name + '-' + index}
              src={item.icon ?? ''}
              alt={item.name ?? ''}
              loader={CustomLoader}
              width={50}
              height={50}
            />
          </div>
          <p className="font-sans text-gray-200 group-hover:text-yellow-200">{item.priceTotal}</p>
        </button>
      </div>
      {item.from && item.from.length > 0 && (
        <BuildTreeItems
          items={items}
          buildTree={getItemBuildTree(item, items)}
          depth={depth + 1}
          baseItem={baseItem}
          setTriggerSelection={setTriggerSelection}
          itemRefArray={itemRefArray}
          itemGridRef={itemGridRef}
        />
      )}
    </div>
  )
}
