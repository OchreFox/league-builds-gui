import { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Icon } from '@iconify/react'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import Footer from '../components/Footer'
import FilterItemsByType from '../components/FilterItemsByType'
import FilterItemsByClass from '../components/FilterItemsByClass'
import FilterItemsByRarity from '../components/FilterItemsByRarity'
import SearchBar from '../components/SearchBar'
import ItemGrid from '../components/ItemGrid'
import { motion } from 'framer-motion'
import { Rarity, SortDirection } from '../types/FilterProps'
import { Category, ChampionClass, ItemsSchema } from '../types/Items'
import { ItemBuildTree } from '../components/ItemBuildTree'
import { cx, css } from '@emotion/css'
import PotatoModeSwitch from '../components/PotatoModeSwitch'
import { PotatoModeContext } from '../components/hooks/PotatoModeStore'

function Home() {
  const [classFilters, setClassFilters] = useState([
    {
      name: 'All Classes',
      isActive: true,
      icon: 'all-classes.svg',
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
  const [autocompleteResults, setAutocompleteResults] =
    useState<Fuzzysort.KeysResults<ItemsSchema>>()
  const [selectedItem, setSelectedItem] = useState<ItemsSchema | null>(null)
  const { state } = useContext(PotatoModeContext)

  const easeInOutExpo = {
    type: 'tween',
    ease: [0.87, 0, 0.13, 1],
    duration: 0.4,
  }

  const bgTitleVariants = {
    visible: {
      opacity: 1,
      x: 0,
      marginLeft: ['2rem', '0rem'],
      transition: {
        staggerChildren: 1,
        delay: 0.7,
        ...easeInOutExpo,
      },
    },
    hidden: {
      opacity: 1,
      x: 20,
      transition: easeInOutExpo,
    },
  }

  const titleVariants = {
    initial: {
      x: 0,
      backgroundColor: 'rgb(0 0 0 / 0)',
      transition: easeInOutExpo,
      paddingLeft: '6rem',
    },
    animate: {
      x: '1rem',
      y: '-1rem',
      paddingLeft: '1rem',
      backgroundColor: 'rgb(0 0 0 / 0.5)',
      transition: {
        ...easeInOutExpo,
        backgroundColor: {
          delay: 1,
          ...easeInOutExpo,
        },
        paddingLeft: {
          delay: 1,
          ...easeInOutExpo,
        },
      },
    },
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-slate-900 via-brand-dark to-gray-900">
      <Head>
        <title>League Tools</title>
      </Head>
      <div
        className={`absolute inset-0 brightness-100 contrast-150 filter ${styles.noise}`}
      />
      {/* Main container */}
      <div className="relative flex min-h-screen w-full flex-col items-stretch">
        {/* Navbar and toolbar */}
        <nav className="w-full flex-none flex-row px-4 pt-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <motion.div
              variants={bgTitleVariants}
              initial="hidden"
              animate="visible"
              className="pattern-diagonal-lines-sm mt-2 mr-4 flex flex-col overflow-visible text-pink-800/50"
            >
              <motion.h1
                variants={titleVariants}
                initial="initial"
                animate="animate"
                className={cx(
                  'p-2 font-wide text-5xl font-black text-brand-default',
                  !state.enabled && ' backdrop-blur-sm'
                )}
              >
                League Tools
              </motion.h1>
              <motion.h2
                initial={{
                  opacity: 0,
                  x: '-100%',
                  y: 0,
                  backgroundColor: 'rgb(0 0 0 / 0)',
                }}
                animate={{
                  opacity: 1,
                  x: ['13.5rem', '1rem'],
                  y: '-1rem',
                  paddingLeft: '1rem',
                  backgroundColor: 'rgb(0 0 0 / 0.75)',
                }}
                transition={{
                  ...easeInOutExpo,
                  paddingLeft: {
                    delay: 1,
                    ...easeInOutExpo,
                  },
                  backgroundColor: {
                    delay: 1,
                    ...easeInOutExpo,
                  },
                  x: {
                    delay: 1,
                    ...easeInOutExpo,
                  },
                }}
                className={cx(
                  'text-md font-sans tracking-widest text-gray-400',
                  !state.enabled && ' backdrop-blur-sm'
                )}
              >
                ITEM BUILDS
              </motion.h2>
            </motion.div>
            <div
              className={cx(
                'z-10 col-span-2 -mt-2 grid grid-flow-col grid-cols-2 grid-rows-2 gap-1 border-2 border-yellow-900 px-4 py-3 shadow-xl 2xl:grid-cols-3 2xl:grid-rows-3',
                styles['container-background']
              )}
            >
              <h3 className="font-body font-semibold text-gray-200 ">
                SETTINGS
              </h3>
              <PotatoModeSwitch />
            </div>
          </div>
        </nav>
        {/* Editor */}
        <main className="mx-4 mt-4 mb-8 flex-1">
          <div className="flex h-full flex-col space-y-4 2xl:grid 2xl:grid-cols-3 2xl:grid-rows-1 2xl:gap-4 2xl:space-y-0">
            {/* Item picker */}
            <div
              className={`${styles['smooth-shadow']} ${styles['container-background']} col-span-2 flex flex-col border-2 border-yellow-900 px-4 py-3 md:grid md:grid-cols-9 md:grid-rows-1 md:gap-2`}
            >
              <div className="col-span-2 mb-4 flex shrink-0 flex-col border-r border-yellow-900 pr-4 md:mb-0">
                {/* Filter items by class */}
                <h3 className="mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  CHAMPION CLASS
                </h3>
                <FilterItemsByClass
                  filterItems={classFilters}
                  setFilterItems={setClassFilters}
                />
                <h3 className="mt-6 mb-2 border-b border-yellow-900 font-body font-semibold text-gray-200">
                  ITEM RARITY
                </h3>
                <div className="flex flex-row justify-between">
                  {/* Filter by rarity button group */}
                  <FilterItemsByRarity
                    rarityFilter={rarityFilter}
                    setRarityFilter={setRarityFilter}
                  />
                  {/* Sort by gold button */}
                  <div
                    className={cx(
                      'border- ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-yellow-900 p-0 text-white transition-colors duration-200 ease-out hover:bg-cyan-900 motion-reduce:transition-none',
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
                  ITEM TYPE
                </h3>
                <FilterItemsByType
                  filterItems={typeFilters}
                  setFilterItems={setTypeFilters}
                />
              </div>
              {/* Item container */}
              <div
                className="col-span-5 flex grow flex-col border-r border-yellow-900 pr-4"
                id="item-container"
              >
                {/* Search bar */}
                <div className="flex flex-col space-y-2">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    autocompleteResults={autocompleteResults}
                  />
                </div>
                {/* Item grid */}
                <ItemGrid
                  goldOrderDirection={goldOrderDirection}
                  tierFilter={rarityFilter}
                  typeFilters={typeFilters}
                  classFilters={classFilters}
                  searchFilter={searchTerm}
                  setAutocompleteResults={setAutocompleteResults}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </div>
              {/* Item tree view */}
              <div className="col-span-2 flex flex-col text-white">
                <ItemBuildTree selectedItem={selectedItem} />
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
