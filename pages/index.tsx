import dynamic from 'next/dynamic'
import Head from 'next/head'

import { MutableRefObject, createRef, useRef, useState } from 'react'

import { ItemBuild } from '@/components/ItemBuild/ItemBuild'
import { BuildTreeContainer } from '@/components/ItemBuildTree/BuildTreeContainer'
import FilterItemsByClass from '@/components/ItemFilters/FilterItemsByClass'
import FilterItemsByRarity from '@/components/ItemFilters/FilterItemsByRarity'
import FilterItemsByType from '@/components/ItemFilters/FilterItemsByType'
import SearchBar from '@/components/ItemFilters/SearchBar'
import SortByGold from '@/components/ItemFilters/SortByGold'
import ItemGrid from '@/components/ItemGrid/ItemGrid'
import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header/Header'
import Settings from '@/components/Settings/Settings'
import { SortDirection } from '@/types/FilterProps'

import styles from 'styles/index.module.scss'

const DynamicSliderOverlay = dynamic(() => import('@/components/Layout/SliderOverlay'), {
  ssr: false,
})

function Home() {
  const [goldOrderDirection, setGoldOrderDirection] = useState(SortDirection.Asc)
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
      <div className="relative flex flex-col items-stretch w-full min-h-screen">
        {/* Navbar and toolbar */}
        <nav className="grid flex-row flex-none w-full grid-cols-1 gap-4 px-4 pt-8 xl:grid-cols-3">
          <Header />
          <Settings />
        </nav>
        {/* Editor */}
        <div className="flex flex-col w-full h-full min-h-full px-4 mt-4 mb-8 space-y-4 grow 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
          {/* Item picker */}
          <div
            className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-2 flex h-full min-h-full flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2`}
          >
            {/* Item Filters */}
            <section className="grid grid-cols-1 col-span-2 gap-6 mb-4 border-yellow-900 auto-rows-min sm:grid-cols-2 md:mb-0 md:grid-cols-1 md:border-r md:pr-4">
              <div className="flex flex-col col-span-1 sm:col-span-2 md:hidden">
                <SearchBar />
              </div>
              <div className="flex flex-row items-center w-full space-x-2 md:flex-col md:items-stretch md:space-x-0">
                <h3 className="pr-2 font-semibold text-gray-200 border-r border-yellow-900 font-body md:mb-2 md:border-b md:border-r-0 md:p-0">
                  CHAMPION CLASS
                </h3>
                <FilterItemsByClass />
              </div>
              <div className="flex flex-row items-center w-full h-full space-x-2 md:flex-col md:items-stretch md:space-x-0">
                <h3 className="pr-2 font-semibold text-gray-200 border-r border-yellow-900 font-body md:mb-2 md:border-b md:border-r-0 md:p-0">
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
              <div className="flex-col hidden w-full md:flex">
                <SearchBar />
              </div>
              <div className="flex items-center py-1 space-x-4 border-b border-yellow-900 md:mt-2 md:px-2">
                <h3 className="pr-2 font-semibold text-gray-200 border-r border-yellow-900 font-body xl:shrink-0">
                  ITEM RARITY
                </h3>
                <FilterItemsByRarity />
                <SortByGold direction={goldOrderDirection} setDirection={setGoldOrderDirection} />
              </div>
              <ItemGrid goldOrderDirection={goldOrderDirection} itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
            </section>
            {/* Item tree view */}
            <section className="flex flex-col h-full min-h-full col-span-2 text-white">
              <BuildTreeContainer itemRefArray={itemRefArray} itemGridRef={itemGridRef} />
            </section>
          </div>
          {/* Build maker */}
          <div
            className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-1 flex h-full w-full flex-col border-2 border-yellow-900 bg-slate-900/60 text-white`}
          >
            <ItemBuild />
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home
