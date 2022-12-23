import Head from 'next/head'

import { cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { MutableRefObject, createRef, useEffect, useRef, useState } from 'react'
import styles from 'styles/index.module.scss'
import { SortDirection } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import Footer from 'components/Footer'
import Header from 'components/Header/Header'
import { BuildMaker } from 'components/ItemBuild/BuildMaker'
import { BuildTreeContainer } from 'components/ItemBuildTree/BuildTreeContainer'
import { ClassFilters } from 'components/ItemFilters/FilterComponents'
import FilterItemsByClass from 'components/ItemFilters/FilterItemsByClass'
import FilterItemsByRarity from 'components/ItemFilters/FilterItemsByRarity'
import FilterItemsByType from 'components/ItemFilters/FilterItemsByType'
import SortByGold from 'components/ItemFilters/SortByGold'
import ItemGrid from 'components/ItemGrid/ItemGrid'
import SearchBar from 'components/SearchBar'
import Settings from 'components/Settings'
import SliderOverlay from 'components/layout/SliderOverlay'

function Home() {
  const [goldOrderDirection, setNumericSortOrder] = useState(SortDirection.Asc)
  const [searchTerm, setSearchTerm] = useState('')
  const [autocompleteResults, setAutocompleteResults] = useState<Fuzzysort.KeysResults<ItemsSchema>>()

  // Array of itemRefs
  const itemRefArray = useRef<
    Array<{
      itemId: number
      ref: MutableRefObject<HTMLElement | null>
    }>
  >([])
  // Ref to item grid
  const itemGridRef = createRef<HTMLDivElement>()

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-slate-900 via-brand-dark to-gray-900">
      <Head>
        <title>League Tools | Item Builds</title>
      </Head>
      <SliderOverlay />
      <div className={`absolute inset-0 brightness-100 contrast-150 filter ${styles.noise}`} />
      {/* Main container */}
      <div className="relative flex min-h-screen w-full flex-col items-stretch">
        {/* Navbar and toolbar */}
        <nav className="w-full flex-none flex-row px-4 pt-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Header />
            <Settings />
          </div>
        </nav>
        {/* Editor */}
        <main className="mx-4 mt-4 mb-8 grow h-full min-h-full">
          <div className="flex h-full min-h-full w-full flex-col space-y-4 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
            {/* Item picker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} h-full min-h-full col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2`}
            >
              {/* Item Filters */}
              <section className="h-full min-h-full col-span-2 mb-4 border-r border-yellow-900 pr-4 md:mb-0">
                {/* Filter items by class */}
                <h3 className="mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  CHAMPION CLASS
                </h3>
                <FilterItemsByClass />
                {/* Filter items by type */}
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  ITEM TYPE
                </h3>
                <FilterItemsByType />
              </section>
              {/* Item container */}
              <section
                className="relative h-full min-h-full col-span-5 flex grow flex-col border-r border-yellow-900 pr-4"
                id="item-container"
              >
                {/* Search bar */}
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  autocompleteResults={autocompleteResults}
                />
                <div className="flex px-2 py-1 mt-2 border-b border-yellow-900 items-center space-x-4">
                  <h3 className="font-body font-semibold text-gray-200 xl:shrink-0 border-r border-yellow-900 pr-2">
                    ITEM RARITY
                  </h3>
                  <FilterItemsByRarity />
                  <SortByGold direction={goldOrderDirection} setDirection={setNumericSortOrder} />
                </div>
                {/* Item grid */}
                <ItemGrid
                  goldOrderDirection={goldOrderDirection}
                  searchFilter={searchTerm}
                  setAutocompleteResults={setAutocompleteResults}
                  itemRefArray={itemRefArray}
                  itemGridRef={itemGridRef}
                />
              </section>
              {/* Item tree view */}
              <section className="h-full min-h-full col-span-2 flex flex-col text-white">
                <BuildTreeContainer itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
              </section>
            </div>
            {/* Build maker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} border-2 border-yellow-900 bg-slate-900/60 text-white h-full min-h-full col-span-1`}
            >
              <BuildMaker />
            </div>
          </div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home
