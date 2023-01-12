import Image from 'next/image'

import { useItems } from '@/hooks/useItems'
import { setItemPickerSelectedItem } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'
import { cx } from '@emotion/css'
import { Combobox } from '@headlessui/react'
import moodSad from '@iconify/icons-tabler/mood-sad'
import searchIcon from '@iconify/icons-tabler/search'
import { Icon } from '@iconify/react'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { ItemsSchema } from 'types/Items'

import { isInStore } from 'components/ItemGrid/ItemGridComponents'

import { easeOutExpo } from 'utils/Transition'

import { CustomLoader } from '../../utils/CustomLoader'

const optionsVariants: Variants = {
  open: {
    paddingTop: '3.5rem',
    opacity: 1,
  },
  closed: {
    paddingTop: 0,
    opacity: 0,
  },
}

export default function SearchBar() {
  const { items } = useItems()
  const dispatch = useAppDispatch()

  const [filteredItems, setFilteredItems] = useState<ItemsSchema[]>([])
  const [fuzzyResults, setFuzzyResults] = useState<Fuzzysort.KeysResults<ItemsSchema>>()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const clearQuery = () => {
    setQuery('')
    setFuzzyResults(undefined)
  }

  const setSelectedItem = useCallback((item: ItemsSchema) => {
    dispatch(setItemPickerSelectedItem(item))
    setIsFocused(false)
    inputRef.current?.blur()
  }, [])

  const updateQuery = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      clearQuery()
    }
    setQuery(event.target.value.trim())
  }, [])

  useEffect(() => {
    if (items) {
      let filtered = Object.values(items).filter((item: ItemsSchema) => isInStore(item))
      setFilteredItems(filtered)
    }
  }, [items])

  useEffect(() => {
    if (items && query) {
      let fuzzySearchResults = fuzzysort.go(query, filteredItems, {
        limit: 12,
        keys: ['name', 'nicknames'],
      })
      setFuzzyResults(fuzzySearchResults)
    }
  }, [items, query])

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="search" className="sr-only">
        Search items
      </label>
      <Combobox
        as="div"
        onChange={setSelectedItem}
        className={cx('w-full z-10 transition-all ease-in-out-expo duration-200 relative', isFocused ? 'p-3' : 'p-0')}
      >
        <div className="relative">
          <Icon
            icon={searchIcon}
            className="pointer-events-none absolute inset-0 flex items-center ml-3 my-auto h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Combobox.Input
            id="search"
            name="search"
            type="search"
            ref={inputRef}
            className="block w-full transition-extended-colors rounded-md duration-150 bg-black/50 border border-yellow-900 focus:border-transparent focus:bg-gray-900 focus:text-white py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-brand-light focus:ring-2 focus:ring-offset-2 sm:text-sm"
            placeholder="Search items"
            onChange={updateQuery}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <Combobox.Options
          as={motion.ul}
          className="absolute -z-1 top-0 left-0 right-0 grid grid-cols-4 overflow-auto bg-black/50 p-1 backdrop-blur-md border border-league-gold text-base drop-shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          initial="closed"
          animate={isFocused ? 'open' : 'closed'}
          exit="closed"
          variants={optionsVariants}
          transition={easeOutExpo}
          style={{
            borderRadius: '0.375rem',
          }}
          onMouseDown={(e: any) => e.preventDefault()}
        >
          <AnimatePresence>
            {query === '' && isFocused && (
              <div className="flex flex-wrap items-center py-2.5 px-4 mr-2 text-sm text-gray-200">
                <p>Type to search...</p>
              </div>
            )}
            {fuzzyResults?.length === 0 && query !== '' ? (
              <span className="flex flex-row w-full items-center py-2.5 px-4 mr-2 text-sm text-gray-200">
                <Icon icon={moodSad} inline={true} className="mr-1" />
                <p>No results found</p>
              </span>
            ) : (
              fuzzyResults?.map((result) => (
                <Combobox.Option as={Fragment} key={'result-' + result.obj.id} value={result.obj}>
                  <button className="relative m-1 flex items-center rounded-md py-2 px-2 text-gray-200 border bg-gray-900 border-gray-700 hover:bg-gray-700 hover:border-gray-500">
                    <div className="mr-2 border border-black object-cover ring-1 ring-yellow-700 flex h-8 w-8 shrink-0">
                      <Image
                        loader={CustomLoader}
                        width={50}
                        height={50}
                        src={result.obj.icon ?? ''}
                        alt={result.obj.name ?? ''}
                      />
                    </div>
                    <p> {result.obj.name}</p>
                  </button>
                </Combobox.Option>
              ))
            )}
          </AnimatePresence>
        </Combobox.Options>
      </Combobox>
    </div>
  )
}
