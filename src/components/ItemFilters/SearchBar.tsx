import Image from 'next/image'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cx } from '@emotion/css'
import { Combobox } from '@headlessui/react'
import moodSad from '@iconify/icons-tabler/mood-sad'
import searchIcon from '@iconify/icons-tabler/search'
import { Icon } from '@iconify/react'
import { isInStore } from '@/components/ItemGrid/ItemGridComponents'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import fuzzysort from 'fuzzysort'
import { ItemsSchema } from '@/types/Items'

import { useItems } from '@/hooks/useItems'
import { setItemPickerDraggedItem, setItemPickerSelectedItem } from '@/store/appSlice'
import { useAppDispatch } from '@/store/store'

import { CustomLoader } from '@/utils/CustomLoader'
import { easeOutExpo } from '@/utils/Transition'

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

  const setSelectedItem = useCallback(
    (item: ItemsSchema) => {
      dispatch(setItemPickerSelectedItem(item))
      setIsFocused(false)
      inputRef.current?.blur()
    },
    [dispatch]
  )

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
  }, [filteredItems, items, query])

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search items
      </label>
      <Combobox
        as="div"
        onChange={setSelectedItem}
        className={cx('ease-in-out-expo relative z-10 w-full transition-all duration-200', isFocused ? 'p-3' : 'p-0')}
      >
        <div className="relative">
          <Icon
            icon={searchIcon}
            className="pointer-events-none absolute inset-0 my-auto ml-3 flex h-5 w-5 items-center text-gray-400"
            aria-hidden="true"
          />
          <Combobox.Input
            id="search"
            name="search"
            type="search"
            ref={inputRef}
            className="block w-full rounded-md border border-yellow-900 bg-black/50 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 transition-extended-colors duration-150 focus:border-transparent focus:bg-gray-900 focus:text-white focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 sm:text-sm"
            placeholder="Search items"
            onChange={updateQuery}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <Combobox.Options
          as={motion.ul}
          className="absolute left-0 right-0 top-0 -z-1 grid grid-cols-2 overflow-auto border border-league-gold bg-black/50 p-1 text-base ring-1 ring-black ring-opacity-5 drop-shadow-2xl backdrop-blur-md focus:outline-none sm:text-sm md:grid-cols-3 lg:grid-cols-4"
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
              <div className="mr-2 flex flex-wrap items-center px-4 py-2.5 text-sm text-gray-200">
                <p>Type to search...</p>
              </div>
            )}
            {fuzzyResults?.length === 0 && query !== '' ? (
              <span className="mr-2 flex w-full flex-row items-center px-4 py-2.5 text-sm text-gray-200">
                <Icon icon={moodSad} inline={true} className="mr-1" />
                <p>No results found</p>
              </span>
            ) : (
              fuzzyResults?.map((result) => (
                <Combobox.Option
                  as="button"
                  key={'result-' + result.obj.id}
                  value={result.obj}
                  className="relative m-1 flex items-center rounded-md border border-gray-700 bg-gray-900 px-2 py-2 text-gray-200 hover:border-gray-500 hover:bg-gray-700"
                >
                  <div className="mr-2 flex h-8 w-8 shrink-0 border border-black object-cover ring-1 ring-yellow-700">
                    <Image
                      loader={CustomLoader}
                      width={50}
                      height={50}
                      src={result.obj.icon ?? ''}
                      alt={result.obj.name ?? ''}
                    />
                  </div>
                  <p>{result.obj.name}</p>
                </Combobox.Option>
              ))
            )}
          </AnimatePresence>
        </Combobox.Options>
      </Combobox>
    </>
  )
}
