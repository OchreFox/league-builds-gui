import React from 'react'

import { css, cx } from '@emotion/css'
import searchIcon from '@iconify/icons-tabler/search'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import { VariantLabels, motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { championPickerVariants } from '@/components/ItemBuild/BuildMakerComponents'
import { selectChampionPicker, setChampionPickerCategory } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { Tag } from '@/types/Champions'
import { easeInOutExpo } from '@/utils/Transition'

export const ChampionSelectorSearch = ({
  championPickerAnimation,
  handleSearchQuery,
}: {
  championPickerAnimation: VariantLabels | undefined
  handleSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const dispatch = useAppDispatch()
  const championPicker = useSelector(selectChampionPicker)

  return (
    <motion.div
      className={cx(
        'absolute bottom-0 -ml-4 flex h-full w-full select-none items-center justify-center overflow-hidden text-center font-sans text-xl font-medium text-gray-200',
        css`
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 1) 100%),
            url('/background-default.webp');
          background-size: cover;
        `
      )}
      variants={championPickerVariants}
      initial="default"
      animate={championPickerAnimation}
      transition={easeInOutExpo}
    >
      <div
        className="z-10 flex px-6 py-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
          }
        }}
        tabIndex={0}
      >
        <select
          className="z-10 rounded-l-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-light"
          onChange={(e) => {
            dispatch(setChampionPickerCategory(e.target.value as Tag))
          }}
        >
          {Object.values(Tag).map((championClass) => (
            <option
              key={'champion-class-' + championClass}
              value={championClass}
              className={cx(
                'inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white',
                championClass === championPicker.category && 'bg-gray-500 text-white'
              )}
            >
              {championClass}
            </option>
          ))}
        </select>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" icon={searchIcon} />
          </div>
          <input
            type="search"
            className="z-20 block w-full rounded-r-lg border border-l-0 border-gray-600 bg-gray-900 p-2.5 pl-10 text-sm text-white placeholder-gray-400 focus:border-brand-light focus:ring-brand-light"
            placeholder="Search champions"
            onChange={handleSearchQuery}
          />
        </div>
      </div>
      <div className="flex items-center justify-center text-xs font-normal text-white/50 transition-colors duration-200 group-hover:text-white">
        <Icon className="" icon={xIcon} width="16" height="16" /> CLOSE
      </div>
    </motion.div>
  )
}
