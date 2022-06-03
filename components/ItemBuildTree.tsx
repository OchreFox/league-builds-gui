import React, { useEffect } from 'react'
import { ItemsSchema } from '../types/Items'

export const ItemBuildTree = ({
  selectedItem,
}: {
  selectedItem: ItemsSchema | null
}) => {
  useEffect(() => {
    if (selectedItem) {
      console.log(selectedItem)
    }
  }, [selectedItem])

  if (!selectedItem) {
    return (
      <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center">
        <img
          src="icons/poro_sleeping.png"
          alt="Poro sleeping"
          className="mx-auto h-32 w-32 opacity-75"
        />
        <p className="italic text-gray-500">
          Select an item to see its build path tree
        </p>
      </div>
    )
  } else {
    return <div>Selected {selectedItem.name}</div>
  }
}
