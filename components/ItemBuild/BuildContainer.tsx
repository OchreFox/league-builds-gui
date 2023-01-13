import dynamic from 'next/dynamic'

import React from 'react'
import 'simplebar/dist/simplebar.min.css'
import { Tag } from 'types/Champions'

import BuildEditor from './BuildEditor'

const DynamicChampionPickerOverlay = dynamic(() => import('../ChampionPicker/ChampionPickerOverlay'), {
  ssr: false,
})

export const BuildContainer = ({
  show,
  categoryFilter,
  searchQuery,
}: {
  show: boolean
  categoryFilter: Tag
  searchQuery: string
}) => {
  return (
    <div className="relative flex h-72 w-full origin-top overflow-hidden 2xl:h-full">
      {/* Build Editor */}
      <BuildEditor />
      {/* Overlay for Champion Picker */}
      <DynamicChampionPickerOverlay show={show} categoryFilter={categoryFilter} searchQuery={searchQuery} />
    </div>
  )
}
