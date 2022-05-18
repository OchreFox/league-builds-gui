import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { FilterBySearchState } from '../types/FilterProps'

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: FilterBySearchState) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    },
    [setSearchTerm]
  )
  return (
    <div className="w-full ">
      <label htmlFor="search" className="sr-only">
        Search items
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {/* Heroicon name: solid/search */}
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <motion.input
          whileFocus={{ backgroundColor: '#ffffff' }}
          transition={{ duration: 0.1, type: 'tween' }}
          id="search"
          name="search"
          className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white  focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
          placeholder="Search items"
          type="search"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
