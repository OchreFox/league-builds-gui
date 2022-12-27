import dynamic from 'next/dynamic'

import React from 'react'
import 'simplebar/dist/simplebar.min.css'

import { Tag } from '../../types/Champions'
import Build from '../ItemBuild/Build'

const DynamicChampionPickerOverlay = dynamic(() => import('./ChampionPickerOverlay'), {
  ssr: false,
})

export const ChampionPickerContainer = ({
  show,
  categoryFilter,
  searchQuery,
}: {
  show: boolean
  categoryFilter: Tag
  searchQuery: string
}) => {
  return (
    <div className="relative flex h-full max-h-full w-full origin-top overflow-hidden">
      {/* Build Editor */}
      <Build />
      {/* Overlay for Champion Picker */}
      <DynamicChampionPickerOverlay show={show} categoryFilter={categoryFilter} searchQuery={searchQuery} />
    </div>
  )
}
