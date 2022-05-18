import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Icon } from '@iconify/react'
import Head from 'next/head'
import JSONFetcher from './JSONFetcher'
import styles from './index.module.css'
import Footer from '../components/Footer'
import FilterItemsByType from '../components/filterItemsByType'
import FilterItemsByClass from '../components/filterItemsByClass'
import FilterItemsByRarity from '../components/filterItemsByRarity'
import SearchBar from '../components/SearchBar'
import ItemGrid from '../components/ItemGrid'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Rarity, SortDirection } from '../types/FilterProps'
import { Category, ChampionClass } from '../types/Items'

function Home() {
  const [classFilters, setClassFilters] = useState([
    {
      name: 'All Classes',
      isActive: true,
      icon: 'all.svg',
      class: ChampionClass.None,
    },
    {
      name: 'Fighter',
      isActive: false,
      icon: 'fighter.svg',
      class: ChampionClass.Fighter,
    },
    {
      name: 'Marksman',
      isActive: false,
      icon: 'marksman.svg',
      class: ChampionClass.Marksman,
    },
    {
      name: 'Mage',
      isActive: false,
      icon: 'mage.svg',
      class: ChampionClass.Mage,
    },
    {
      name: 'Assassin',
      isActive: false,
      icon: 'assassin.svg',
      class: ChampionClass.Assassin,
    },
    {
      name: 'Tank',
      isActive: false,
      icon: 'tank.svg',
      class: ChampionClass.Tank,
    },
    {
      name: 'Support',
      isActive: false,
      icon: 'support.svg',
      class: ChampionClass.Support,
    },
  ])

  const [typeFilters, setTypeFilters] = useState([
    {
      name: 'All Items',
      isActive: true,
      icon: 'clear-filters.svg',
      categories: [Category.All],
    },
    {
      name: 'Attack Damage',
      isActive: false,
      icon: 'attack-damage.svg',
      categories: [Category.AttackDamage],
    },
    {
      name: 'Critical Strike',
      isActive: false,
      icon: 'critical-strike.svg',
      categories: [Category.CriticalStrike],
    },
    {
      name: 'Attack Speed',
      isActive: false,
      icon: 'attack-speed.svg',
      categories: [Category.AttackSpeed],
    },
    {
      name: 'On-Hit Effects',
      isActive: false,
      icon: 'on-hit-effects.svg',
      categories: [Category.OnHit],
    },
    {
      name: 'Armor Penetration',
      isActive: false,
      icon: 'armor-penetration.svg',
      categories: [Category.ArmorPenetration],
    },
    {
      name: 'Ability Power',
      isActive: false,
      icon: 'ability-power.svg',
      categories: [Category.AbilityPower],
    },
    {
      name: 'Mana & Regeneration',
      isActive: false,
      icon: 'mana.svg',
      categories: [Category.Mana, Category.ManaRegen],
    },
    {
      name: 'Magic Penetration',
      isActive: false,
      icon: 'magic-penetration.svg',
      categories: [Category.MagicPenetration],
    },
    {
      name: 'Health & Regeneration',
      isActive: false,
      icon: 'health.svg',
      categories: [Category.Health, Category.HealthRegen],
    },
    {
      name: 'Armor',
      isActive: false,
      icon: 'armor.svg',
      categories: [Category.Armor],
    },
    {
      name: 'Magic Resistance',
      isActive: false,
      icon: 'magic-resist.svg',
      categories: [Category.MagicResistance],
    },
    {
      name: 'Ability Haste',
      isActive: false,
      icon: 'ability-haste.svg',
      categories: [Category.AbilityHaste, Category.CooldownReduction],
    },
    {
      name: 'Movement',
      isActive: false,
      icon: 'movement-speed.svg',
      categories: [Category.Boots, Category.NonbootsMovement],
    },
    {
      name: 'Life Steal & Vamp',
      isActive: false,
      icon: 'omni-vamp.svg',
      categories: [Category.SpellVamp, Category.LifeSteal],
    },
    {
      name: 'Trinket',
      isActive: false,
      icon: 'trinket.svg',
      categories: [Category.Trinket, Category.Vision],
    },
    {
      name: 'Lane',
      isActive: false,
      icon: 'mid.svg',
      categories: [Category.Lane],
    },
    {
      name: 'Jungle',
      isActive: false,
      icon: 'jungle.svg',
      categories: [Category.Jungle],
    },
    {
      name: 'Tenacity',
      isActive: false,
      icon: 'tenacity.svg',
      categories: [Category.Tenacity],
    },
    {
      name: 'Consumable',
      isActive: false,
      icon: 'consumable.svg',
      categories: [Category.Consumable],
    },
    {
      name: 'Crowd Control',
      isActive: false,
      icon: 'cc.svg',
      categories: [Category.Slow],
    },
  ])
  const [goldOrderDirection, setNumericSortOrder] = useState(SortDirection.Asc)
  const [rarityFilter, setRarityFilter] = useState(Rarity.Empty)
  const [searchTerm, setSearchTerm] = useState('')

  // fetch the latest version of API
  // const { data: latestVersion, error: latestVersionError } = useSWR<
  //   Array<String>
  // >('https://ddragon.leagueoflegends.com/api/versions.json', JSONFetcher)

  // // fetch runes data from DDragon
  // const { data: runesData, error: runesDataError } = useSWR<Array<String>>(
  //   () =>
  //     latestVersion &&
  //     `https://ddragon.leagueoflegends.com/cdn/${latestVersion[0]}/data/en_US/runesReforged.json`,
  //   JSONFetcher
  // )

  // if (latestVersionError) {
  //   console.error(latestVersionError.message)
  // }
  // if (runesDataError) {
  //   console.error(runesDataError.message)
  // }

  // useEffect(() => {
  //   if (latestVersion) {
  //     // Log in console the latest version from the API
  //     console.log(latestVersion[0])
  //   }
  //   if (runesData) {
  //     console.log(runesData)
  //   }
  // }, [latestVersion, runesData])

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-slate-900 via-brand-dark to-gray-900">
      <Head>
        <title>League Tools</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`absolute inset-0 brightness-100 contrast-150 filter ${styles.noise}`}
      />
      {/* Main container */}
      <div className="relative flex min-h-screen w-full flex-col items-stretch">
        {/* Navbar and toolbar */}
        <nav className="w-full flex-none flex-row px-12 pt-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <motion.h1
                initial={{ opacity: 0, x: -1000 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'tween',
                  ease: [0.87, 0, 0.13, 1],
                  duration: 0.4,
                }}
                className="font-wide text-5xl font-black text-brand-default"
              >
                League Tools
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'tween',
                  ease: [0.87, 0, 0.13, 1],
                  duration: 0.4,
                }}
                className="text-md mt-1 font-sans tracking-widest text-gray-400"
              >
                ITEM BUILDS
              </motion.h2>
            </div>
            <div className="col-span-2">Toolbar</div>
          </div>
        </nav>
        {/* Editor */}
        <main className="mx-4 mt-4 mb-8 flex-1 md:mx-8 lg:mx-12">
          <div className="flex h-full flex-col space-y-4 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
            {/* Item picker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 md:flex-row md:space-x-4`}
            >
              <div className="mb-4 flex shrink-0 flex-col border-r border-yellow-900 pr-4 md:mb-0">
                {/* Filter items by class */}
                <h3 className="mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  CLASS
                </h3>
                <FilterItemsByClass
                  filterItems={classFilters}
                  setFilterItems={setClassFilters}
                />
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  RARITY
                </h3>
                <div className="flex flex-row justify-between">
                  {/* Filter by rarity button group */}
                  <FilterItemsByRarity
                    rarityFilter={rarityFilter}
                    setRarityFilter={setRarityFilter}
                  />
                  {/* Sort by gold button */}
                  <div
                    className={clsx(
                      'border- ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-yellow-900 p-0 text-white transition-colors duration-200 ease-out hover:bg-cyan-900',
                      goldOrderDirection === SortDirection.Asc
                        ? 'bg-brand-default'
                        : 'bg-brand-dark'
                    )}
                    onClick={() =>
                      // Toggle sort order
                      setNumericSortOrder(
                        goldOrderDirection === SortDirection.Asc
                          ? SortDirection.Desc
                          : SortDirection.Asc
                      )
                    }
                    title={`Sort by ${
                      goldOrderDirection === SortDirection.Asc
                        ? 'highest'
                        : 'lowest'
                    } gold`}
                  >
                    <Icon
                      icon={
                        goldOrderDirection === SortDirection.Asc
                          ? 'bi:sort-numeric-down'
                          : 'bi:sort-numeric-down-alt'
                      }
                      width="24px"
                    />
                  </div>
                </div>
                {/* Filter items by type */}
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  TYPE
                </h3>
                <FilterItemsByType
                  filterItems={typeFilters}
                  setFilterItems={setTypeFilters}
                />
              </div>
              {/* Item container */}
              <div className="flex grow flex-col border-r border-yellow-900 pr-4">
                {/* Search bar */}
                <div className="flex flex-col space-y-2">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
                {/* Item grid */}
                <ItemGrid
                  goldOrderDirection={goldOrderDirection}
                  tierFilter={rarityFilter}
                  typeFilters={typeFilters}
                  classFilters={classFilters}
                  searchFilter={searchTerm}
                />
              </div>
              {/* Item tree view */}
              <div className="flex flex-col text-white">
                Item tree goes here weeeeeeeeeeeeee
              </div>
            </div>
            {/* Build maker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} border-2 border-yellow-900 bg-slate-900/60 px-4 py-3 text-white`}
            >
              Build maker goes here
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
