import { css, cx } from '@emotion/css'
import { motion } from 'framer-motion'
import React from 'react'
import { ClassFilter, FilterByClassState } from 'types/FilterProps'

export default function FilterItemsByClass({ filterItems, setFilterItems }: FilterByClassState) {
  const handleClick = (itemClicked: ClassFilter) => {
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
          <nav className="flex flex-row justify-around space-x-1" aria-label="Tabs">
            {filterItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.name}
                  // Framer Motion onClick animation
                  transition={{ duration: 0.1, type: 'tween' }}
                  type="button"
                  title={item.name}
                  className={cx(
                    'group inline-flex flex-col items-center justify-center py-2 px-1 text-sm font-medium relative',
                    item.isActive &&
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
                          animation: scroll 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards;
                          @keyframes scroll {
                            0% {
                              background-position: 0 100%;
                              opacity: 0;
                            }
                            100% {
                              background-position: 0 0%;
                              opacity: 1;
                            }
                          }
                        }
                      `
                  )}
                  onClick={() => handleClick(item)}
                >
                  {item.isActive ? (
                    <motion.div
                      layoutId="filter-class-underline"
                      className="bg-brand-default w-full h-0.5 inset-x-0 bottom-0 absolute"
                    />
                  ) : null}
                  <Icon
                    className={cx(
                      item.isActive ? 'fill-league-gold' : 'fill-gray-600',
                      'flex-shrink-0 transition duration-100 ease-out motion-reduce:transition-none group-hover:fill-gray-400',
                      item.name === 'All Classes' ? 'h-4 w-auto' : 'h-4 w-4'
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
