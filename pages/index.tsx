import Head from 'next/head'

import { cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { MutableRefObject, createRef, useCallback, useRef, useState } from 'react'
import styles from 'styles/index.module.scss'
import { Rarity, SortDirection } from 'types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from 'types/Items'

import { defaultClassFilters, defaultTypeFilters } from 'components/FilterComponents'
import FilterItemsByClass from 'components/FilterItemsByClass'
import FilterItemsByRarity from 'components/FilterItemsByRarity'
import FilterItemsByType from 'components/FilterItemsByType'
import Footer from 'components/Footer'
import Header from 'components/Header/Header'
import { BuildMaker } from 'components/ItemBuild/BuildMaker'
import { ItemBuildTree } from 'components/ItemBuildTree/ItemBuildTree'
import ItemGrid from 'components/ItemGrid/ItemGrid'
import SearchBar from 'components/SearchBar'
import Settings from 'components/Settings'
import SliderOverlay from 'components/layout/SliderOverlay'
import { resetItemBuild } from 'components/store/itemBuildSlice'

function Home() {
  const [classFilters, setClassFilters] = useState(defaultClassFilters)
  const [typeFilters, setTypeFilters] = useState(defaultTypeFilters)
  const [goldOrderDirection, setNumericSortOrder] = useState(SortDirection.Asc)
  const [rarityFilter, setRarityFilter] = useState(Rarity.Empty)
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
        <main className="mx-4 mt-4 mb-8 flex-1">
          <div className="flex h-full flex-col space-y-4 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
            {/* Item picker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2`}
            >
              <section className="col-span-2 mb-4 flex shrink-0 flex-col border-r border-yellow-900 pr-4 md:mb-0">
                {/* Filter items by class */}
                <h3 className="mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  CHAMPION CLASS
                </h3>
                <FilterItemsByClass filterItems={classFilters} setFilterItems={setClassFilters} />
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  ITEM RARITY
                </h3>
                <div className="flex flex-row justify-between">
                  {/* Filter by rarity button group */}
                  <FilterItemsByRarity rarityFilter={rarityFilter} setRarityFilter={setRarityFilter} />
                  {/* Sort by gold button */}
                  <div
                    className={cx(
                      'border- ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-yellow-900 p-0 text-white transition-colors duration-200 ease-out hover:bg-cyan-900 motion-reduce:transition-none',
                      goldOrderDirection === SortDirection.Asc ? 'bg-brand-default' : 'bg-brand-dark'
                    )}
                    onClick={() =>
                      // Toggle sort order
                      setNumericSortOrder(
                        goldOrderDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
                      )
                    }
                    title={`Sort by ${goldOrderDirection === SortDirection.Asc ? 'highest' : 'lowest'} gold`}
                  >
                    <Icon
                      icon={
                        goldOrderDirection === SortDirection.Asc ? 'bi:sort-numeric-down' : 'bi:sort-numeric-down-alt'
                      }
                      width="24px"
                    />
                  </div>
                </div>
                {/* Filter items by type */}
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  ITEM TYPE
                </h3>
                <FilterItemsByType filterItems={typeFilters} setFilterItems={setTypeFilters} />
              </section>
              {/* Item container */}
              <section className="col-span-5 flex grow flex-col border-r border-yellow-900 pr-4" id="item-container">
                {/* Search bar */}
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  autocompleteResults={autocompleteResults}
                />
                {/* Item grid */}
                <ItemGrid
                  goldOrderDirection={goldOrderDirection}
                  rarityFilter={rarityFilter}
                  setRarityFilter={setRarityFilter}
                  typeFilters={typeFilters}
                  classFilters={classFilters}
                  searchFilter={searchTerm}
                  setAutocompleteResults={setAutocompleteResults}
                  itemRefArray={itemRefArray}
                  itemGridRef={itemGridRef}
                />
              </section>
              {/* Item tree view */}
              <section className="col-span-2 flex flex-col text-white">
                <ItemBuildTree
                  itemRefArray={itemRefArray}
                  itemGridRef={itemGridRef}
                  classFilters={classFilters}
                  setClassFilters={setClassFilters}
                />
              </section>
            </div>
            {/* Build maker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} border-2 border-yellow-900 bg-slate-900/60 text-white h-full col-span-1`}
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
