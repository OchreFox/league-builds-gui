import Image from 'next/image'

import React, { Fragment, useCallback } from 'react'

import { css, cx } from '@emotion/css'
import { Menu, Transition } from '@headlessui/react'
import { InlineIcon } from '@iconify/react'
import { motion } from 'framer-motion'
import { batch, useSelector } from 'react-redux'

import { ItemType, TypeFilters } from '@/components/ItemFilters/FilterComponents'
import { resetItemFiltersTypes, selectItemFilters, setItemFilterType, toggleItemFiltersType } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

export default function FilterItemsByType() {
  const dispatch = useAppDispatch()
  const itemFilters = useSelector(selectItemFilters)
  const potatoMode = useSelector(selectPotatoMode)

  const isActive = useCallback(
    (itemType: ItemType) => {
      return itemFilters.types.includes(itemType)
    },
    [itemFilters.types]
  )

  const getItemClassnames = (itemType: ItemType) => {
    let itemClassnames: string
    // Pressed button
    if (isActive(itemType)) {
      if (itemType === ItemType.All) {
        itemClassnames = 'bg-brand-default font-bold text-white'
      } else {
        itemClassnames = 'bg-league-goldDarker text-white'
      }
    } else {
      // Unpressed button
      itemClassnames = cx(
        'bg-transparent text-gray-600 hover:text-gray-300 group',
        potatoMode
          ? 'hover:bg-slate-700'
          : 'after:absolute after:w-0 after:h-full after:left-0 after:top-0 after:transition-all after:duration-300 after:hover:bg-slate-700 after:hover:w-full after:rounded-md'
      )
    }
    // Base button
    return cx(
      itemClassnames,
      'group flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium md:justify-start duration-100 ease-out relative',
      potatoMode ? 'transition-none' : 'transition-all'
    )
  }

  const getImageClassnames = (itemType: ItemType) => {
    let imageClassnames: string
    if (isActive(itemType)) {
      imageClassnames = cx(
        'text-gray-500',
        css`
          filter: drop-shadow(0px 0px 3px rgba(165, 243, 252, 0.25)) drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.3));
        `
      )
    } else {
      imageClassnames = 'text-gray-400 brightness-50 group-hover:text-gray-200 group-hover:brightness-100'
    }
    return cx(
      imageClassnames,
      'flex-shrink-0 my-2 md:my-0 md:-ml-1 md:mr-3 z-10',
      potatoMode ? 'transition-none' : 'transition duration-100',
      itemType === ItemType.All ? 'h-4 w-auto' : 'h-4 w-4'
    )
  }

  const handleClick = (itemType: ItemType) => {
    if (itemType === ItemType.All || (itemFilters.types.length === 1 && isActive(itemType))) {
      dispatch(resetItemFiltersTypes())
    } else {
      batch(() => {
        dispatch(toggleItemFiltersType(itemType))
        dispatch(
          setItemFilterType({
            type: ItemType.All,
            value: false,
          })
        )
      })
    }
  }

  return (
    <nav
      className="flex grow select-none flex-col space-y-3 md:flex-col md:space-y-1"
      aria-label="Filter items by type"
    >
      <Menu as="div" className="md:hidden">
        {({ open }) => (
          <Fragment>
            <div>
              <Menu.Button className="inline-flex w-full items-center justify-center rounded-md border border-yellow-900 bg-brand-dark px-4 py-1.5 text-sm font-bold text-white shadow-sm hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-yellow-500">
                Item Type
                <InlineIcon icon="bi:chevron-down" className="ml-1" />
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute z-10 mt-2 h-64 w-2/3 origin-top-right overflow-auto rounded-md border border-yellow-900 bg-yellow-900 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {Object.entries(TypeFilters).map(([key, item]) => {
                  const itemType = key as ItemType
                  return (
                    <Fragment key={item.name}>
                      {(item.name === 'Attack Damage' ||
                        item.name === 'Health & Regeneration' ||
                        item.name === 'Ability Haste' ||
                        item.name === 'Trinket') && <div className="border-t-2 border-yellow-900" />}
                      <Menu.Item>
                        <button
                          className={cx(
                            isActive(itemType) ? 'bg-slate-600 text-white' : 'bg-slate-800 text-gray-400',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                          onClick={() => handleClick(itemType)}
                        >
                          <Image
                            alt={item.name}
                            className={getImageClassnames(itemType)}
                            src={item.icon}
                            width={16}
                            height={16}
                            unoptimized
                          />
                          <span className="ml-2">{item.name}</span>
                        </button>
                      </Menu.Item>
                    </Fragment>
                  )
                })}
              </Menu.Items>
            </Transition>
          </Fragment>
        )}
      </Menu>
      <div className="hidden flex-col md:flex lg:space-y-0.5">
        {Object.entries(TypeFilters).map(([key, item]) => {
          const itemType = key as ItemType
          return (
            <React.Fragment key={item.name}>
              {/* Item classification separators */}
              {(item.name === 'Attack Damage' ||
                item.name === 'Health & Regeneration' ||
                item.name === 'Ability Haste' ||
                item.name === 'Trinket') && <div className="border-t border-yellow-900" />}
              <motion.button
                // Framer Motion onClick animation
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1, type: 'tween' }}
                // Button styling
                type="button"
                key={item.name}
                title={item.name}
                className={getItemClassnames(itemType)}
                // Toggle filterItem isActive status
                onClick={() => {
                  handleClick(itemType)
                }}
              >
                <Image
                  alt={item.name}
                  className={getImageClassnames(itemType)}
                  src={item.icon}
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="z-10 m-0 hidden md:ml-2 md:inline-block">{item.name}</span>
              </motion.button>
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
