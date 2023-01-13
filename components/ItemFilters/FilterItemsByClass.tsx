import { selectItemFilters, setItemFiltersClass } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import React from 'react'
import { useSelector } from 'react-redux'
import { ChampionClass } from 'types/Items'

import { ClassFilters } from './FilterComponents'

export default function FilterItemsByClass() {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)

  const handleClick = (itemClicked: ChampionClass) => {
    if (itemFilters.class !== itemClicked) {
      dispatch(setItemFiltersClass(itemClicked))
    } else {
      dispatch(setItemFiltersClass(ChampionClass.None))
    }
  }

  return (
    <div className="flex grow select-none flex-col">
      <div className="w-full xl:hidden">
        <select
          title="Filter items by class"
          id="filterItems"
          name="filterItems"
          className="block w-full rounded-md border-gray-300 py-1 px-2 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={itemFilters.class}
          onChange={(e) => {
            dispatch(setItemFiltersClass(e.target.value as ChampionClass))
          }}
        >
          {Object.entries(ClassFilters).map(([championClass, item]) => (
            <option key={item.name} value={championClass}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden flex-col xl:flex">
        <div className="border-b border-slate-800">
          <nav className="flex flex-row justify-around space-x-1" aria-label="Tabs">
            {Object.entries(ClassFilters).map(([championClass, item]) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.name}
                  // Framer Motion onClick animation
                  transition={{ duration: 0.1, type: 'tween' }}
                  type="button"
                  title={item.name}
                  className={cx(
                    'group relative inline-flex flex-col items-center justify-center py-2 px-1 text-sm font-medium',
                    itemFilters.class === championClass &&
                      css`
                        &::before {
                          content: '';
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          background: radial-gradient(circle, rgba(199, 169, 110, 0.5) 0%, rgba(0, 0, 0, 0) 50%);
                          background-size: 100% 200%;
                          background-position: 0 100%;
                          animation: scroll-down 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards;
                        }
                        @keyframes scroll-down {
                          0% {
                            background-position: 0 100%;
                            opacity: 0;
                          }
                          100% {
                            background-position: 0 0%;
                            opacity: 1;
                          }
                        }
                      `
                  )}
                  onClick={() => handleClick(championClass as ChampionClass)}
                >
                  {itemFilters.class === championClass ? (
                    <motion.div
                      layoutId="filter-class-underline"
                      className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-brand-default"
                    />
                  ) : null}
                  <Icon
                    className={cx(
                      itemFilters.class === championClass ? 'fill-league-gold' : 'fill-gray-600',
                      'flex-shrink-0 transition duration-100 ease-out group-hover:fill-gray-400 motion-reduce:transition-none',
                      championClass === 'All Classes' ? 'h-4 w-auto' : 'h-4 w-4'
                    )}
                  />
                </motion.button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
