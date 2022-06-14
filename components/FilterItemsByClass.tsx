import React from 'react'
import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import { FilterByClassState, FilterByClassProps } from '../types/FilterProps'

export default function FilterItemsByClass({
  filterItems,
  setFilterItems,
}: FilterByClassState) {
  const handleClick = (itemClicked: FilterByClassProps) => {
    // Create a temporary array that is a clone of the filterItems array
    const tempArray = [...filterItems]
    // Set isActive to true for the clicked item, and false for all others
    tempArray.forEach((item) => {
      if (item.class === itemClicked.class) {
        item.isActive = !item.isActive
      } else {
        item.isActive = false
      }
    })
    // If no items are active, set the first item to active
    if (!tempArray.some((item) => item.isActive)) {
      tempArray[0].isActive = true
    }

    setFilterItems(tempArray)
  }
  return (
    <div className="flex select-none flex-col">
      <div className="xl:hidden">
        <select
          title="Filter items by class"
          id="filterItems"
          name="filterItems"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={filterItems.find((item) => item.isActive)?.name}
          onChange={(e) => {
            const newFilterItems = filterItems.map((item) => {
              if (item.name === e.target.value) {
                return { ...item, isActive: true }
              }
              return { ...item, isActive: false }
            })
            setFilterItems(newFilterItems)
          }}
        >
          {filterItems.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden flex-col xl:flex">
        <div className=" border-b border-slate-800">
          <nav
            className="flex flex-row justify-around space-x-1"
            aria-label="Tabs"
          >
            {filterItems.map((item) => (
              <motion.button
                key={item.name}
                // Framer Motion onClick animation
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1, type: 'tween' }}
                type="button"
                title={item.name}
                className={cx(
                  item.isActive
                    ? 'border-brand-default'
                    : 'border-transparent text-gray-500 transition-colors duration-100 ease-out hover:border-gray-500 motion-reduce:transition-none',
                  'group inline-flex flex-col items-center justify-center border-b-2 py-2 px-1 text-sm font-medium'
                )}
                onClick={() => handleClick(item)}
              >
                <img
                  alt={item.name}
                  className={cx(
                    item.isActive
                      ? 'text-gray-500'
                      : 'text-gray-400 brightness-50 group-hover:text-gray-500 group-hover:brightness-75',
                    ' flex-shrink-0 transition-all duration-100 ease-out motion-reduce:transition-none',
                    item.name === 'All Classes' ? 'h-4 w-auto' : 'h-4 w-4'
                  )}
                  src={'icons/' + item.icon}
                />
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
