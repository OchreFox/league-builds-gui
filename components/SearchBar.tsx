import Image from 'next/image'

import { Combobox, Transition } from '@headlessui/react'
import React, { Fragment, useCallback } from 'react'

import { FilterBySearchState } from '../types/FilterProps'
import { CustomLoader } from '../utils/ImageLoader'

export default function SearchBar({ searchTerm, setSearchTerm, autocompleteResults }: FilterBySearchState) {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    },
    [setSearchTerm]
  )
  return (
    <div className="w-full flex flex-col space-y-2">
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
        <Combobox value={searchTerm} onChange={setSearchTerm}>
          <Combobox.Input
            id="search"
            name="search"
            className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-white sm:text-sm"
            placeholder="Search items"
            type="search"
            value={searchTerm}
            onChange={handleChange}
            autoComplete="off"
          />
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Combobox.Options className="absolute z-10 mt-1 grid max-h-60 w-full grid-cols-4 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {autocompleteResults?.length === 0 && searchTerm !== '' ? (
                <div className="px-4 py-2">
                  <div className="text-sm text-gray-600">No results</div>
                </div>
              ) : (
                autocompleteResults?.map((result) => (
                  <Combobox.Option
                    key={'result-' + result.obj.id}
                    value={result.obj.name}
                    className="relative m-1 flex cursor-default select-none items-center rounded-md border border-gray-300 py-2 px-2 text-gray-900 hover:bg-gray-200"
                  >
                    <div className="mr-2 border border-black object-cover ring-1 ring-yellow-700 flex h-8 w-8 shrink-0">
                      <Image
                        loader={CustomLoader}
                        width={50}
                        height={50}
                        src={result.obj.icon ?? ''}
                        alt={result.obj.name ?? ''}
                      />
                    </div>
                    {result.obj.name}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
    </div>
  )
}
