import dynamic from 'next/dynamic'
import Head from 'next/head'

import { MutableRefObject, createRef, useRef, useState } from 'react'
import styles from 'styles/index.module.scss'
import { SortDirection } from 'types/FilterProps'
import { ItemsSchema } from 'types/Items'

import { ItemBuild } from 'components/ItemBuild/ItemBuild'
import { BuildTreeContainer } from 'components/ItemBuildTree/BuildTreeContainer'
import FilterItemsByClass from 'components/ItemFilters/FilterItemsByClass'
import FilterItemsByRarity from 'components/ItemFilters/FilterItemsByRarity'
import FilterItemsByType from 'components/ItemFilters/FilterItemsByType'
import SearchBar from 'components/ItemFilters/SearchBar'
import SortByGold from 'components/ItemFilters/SortByGold'
import ItemGrid from 'components/ItemGrid/ItemGrid'
import Footer from 'components/Layout/Footer'
import Header from 'components/Layout/Header/Header'
import Settings from 'components/Settings/Settings'

const DynamicSliderOverlay = dynamic(() => import('components/Layout/SliderOverlay'), {
  ssr: false,
})

function Home() {
  const [goldOrderDirection, setNumericSortOrder] = useState(SortDirection.Asc)
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
      <DynamicSliderOverlay />
      <div className={`absolute inset-0 brightness-100 contrast-150 filter ${styles.noise}`} />
      {/* Main container */}
      <div className="relative flex min-h-screen w-full flex-col items-stretch">
        {/* Navbar and toolbar */}
        <nav className="grid w-full flex-none grid-cols-1 flex-row gap-4 px-4 pt-8 xl:grid-cols-3">
          <Header />
          <Settings />
        </nav>
        {/* Editor */}
        <main className="mt-4 mb-8 flex h-full min-h-full w-full grow flex-col space-y-4 px-4 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
          {/* Item picker */}
          <div
            className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-2 flex h-full min-h-full flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2`}
          >
            {/* Item Filters */}
            <section className="col-span-2 mb-4 grid auto-rows-min grid-cols-1 gap-6 border-yellow-900 sm:grid-cols-2 md:mb-0 md:grid-cols-1 md:border-r md:pr-4">
              <div className="col-span-1 flex flex-col sm:col-span-2 md:hidden">
                <SearchBar />
              </div>
              <div className="flex w-full flex-row items-center space-x-2 md:flex-col md:items-stretch md:space-x-0">
                <h3 className="border-r border-yellow-900 pr-2 font-body font-semibold text-gray-200 md:mb-2 md:border-r-0 md:border-b md:p-0">
                  CHAMPION CLASS
                </h3>
                <FilterItemsByClass />
              </div>
              <div className="flex h-full w-full flex-row items-center space-x-2 md:flex-col md:items-stretch md:space-x-0">
                <h3 className="border-r border-yellow-900 pr-2 font-body font-semibold text-gray-200 md:mb-2 md:border-r-0 md:border-b md:p-0">
                  ITEM TYPE
                </h3>
                <FilterItemsByType />
              </div>
            </section>
            {/* Item container */}
            <section
              className="relative col-span-5 flex h-[70vh] min-h-full grow flex-col border-yellow-900 md:h-full md:border-r md:pr-4"
              id="item-container"
            >
              <div className="hidden w-full flex-col md:flex">
                <SearchBar />
              </div>
              <div className="flex items-center space-x-4 border-b border-yellow-900 py-1 md:mt-2 md:px-2">
                <h3 className="border-r border-yellow-900 pr-2 font-body font-semibold text-gray-200 xl:shrink-0">
                  ITEM RARITY
                </h3>
                <FilterItemsByRarity />
                <SortByGold direction={goldOrderDirection} setDirection={setNumericSortOrder} />
              </div>
              <ItemGrid goldOrderDirection={goldOrderDirection} itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
            </section>
            {/* Item tree view */}
            <section className="col-span-2 flex h-full min-h-full flex-col text-white">
              <BuildTreeContainer itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
            </section>
          </div>
          {/* Build maker */}
          <div
            className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-1 flex h-full w-full flex-col border-2 border-yellow-900 bg-slate-900/60 text-white`}
          >
            <ItemBuild />
          </div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home
