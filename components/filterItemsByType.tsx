import React, { Fragment, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cx, css } from '@emotion/css'
import { FilterByTypeState, FilterByTypeProps } from '../types/FilterProps'
import { Menu, Transition } from '@headlessui/react'
import { InlineIcon } from '@iconify/react'

export default function FilterItemsByType({
  filterItems,
  setFilterItems,
}: FilterByTypeState) {
  const getItemClassnames = (item: FilterByTypeProps) => {
    let itemClassnames: string
    // Pressed button
    if (item.isActive) {
      if (item.name === 'All Items') {
        itemClassnames = 'bg-brand-default font-bold text-white'
      } else {
        itemClassnames = 'bg-slate-600 text-white'
      }
    } else {
      // Unpressed button
      itemClassnames =
        'bg-transparent text-gray-600 hover:bg-cyan-900 hover:text-black'
    }
    // Base button
    return cx(
      itemClassnames,
      'group flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium md:justify-start transition-all duration-100 ease-out'
    )
  }

  const getImageClassnames = (item: FilterByTypeProps) => {
    let imageClassnames: string
    if (item.isActive) {
      imageClassnames = 'text-gray-500'
    } else {
      imageClassnames = 'text-gray-400 brightness-50 group-hover:text-gray-500'
    }
    return cx(
      imageClassnames,
      'flex-shrink-0 transition-colors duration-200 my-2 md:my-0 md:-ml-1 md:mr-3',
      item.name === 'All Items' ? 'h-4 w-auto' : 'h-4 w-4'
    )
  }

  const handleClick = (item: FilterByTypeProps) => {
    // Create a temporary array of filterItems
    const tempNavItems = filterItems.map((filterItem) => {
      // If the filterItem is the one being clicked, toggle isActive
      if (filterItem.name === item.name) {
        filterItem.isActive = !filterItem.isActive
      }
      return filterItem
    })
    // If the button is All Items button, set all filterItems to inactive except the All Items button
    if (item.name === 'All Items') {
      tempNavItems.forEach((filterItem) => {
        filterItem.isActive = filterItem.name === 'All Items'
      })
    }
    // If there are no items active, set All Items filterItem to active
    if (tempNavItems.filter((filterItem) => filterItem.isActive).length === 0) {
      tempNavItems[0].isActive = true
    } else if (item.name !== 'All Items') {
      tempNavItems[0].isActive = false
    }
    // Set the filterItems to the temporary array
    setFilterItems(tempNavItems)
  }

  return (
    <nav
      className="flex select-none flex-col space-y-3 md:flex-col md:space-y-1"
      aria-label="Filter items by type"
    >
      <Menu as="div" className="md:hidden">
        {({ open }) => (
          <Fragment>
            <div>
              <Menu.Button className="inline-flex w-full items-center justify-center rounded-md border border-yellow-900 bg-brand-dark px-4 py-2 text-sm  font-bold text-white shadow-sm hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 focus:ring-offset-yellow-500">
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
                {filterItems.map((item) => (
                  <Fragment key={item.name}>
                    {(item.name === 'Attack Damage' ||
                      item.name === 'Health & Regeneration' ||
                      item.name === 'Ability Haste' ||
                      item.name === 'Trinket') && (
                      <div className="border-t-2 border-yellow-900" />
                    )}
                    <Menu.Item>
                      <div
                        className={cx(
                          item.isActive
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-800 text-gray-400',
                          'group flex items-center  px-4 py-2 text-sm'
                        )}
                        onClick={() => handleClick(item)}
                      >
                        <img
                          alt={item.name}
                          className={getImageClassnames(item)}
                          src={'icons/' + item.icon}
                        />
                        <span className="ml-2">{item.name}</span>
                      </div>
                    </Menu.Item>
                  </Fragment>
                ))}
              </Menu.Items>
            </Transition>
          </Fragment>
        )}
      </Menu>
      <div className="hidden flex-col md:flex lg:space-y-1">
        {filterItems.map((item) => (
          <React.Fragment key={item.name}>
            {/* Item classification separators */}
            {(item.name === 'Attack Damage' ||
              item.name === 'Health & Regeneration' ||
              item.name === 'Ability Haste' ||
              item.name === 'Trinket') && (
              <div className="border-t border-yellow-900" />
            )}
            <motion.button
              // Framer Motion onClick animation
              // whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1, type: 'tween' }}
              // Button styling
              type="button"
              key={item.name}
              title={item.name}
              className={getItemClassnames(item)}
              // Toggle filterItem isActive status
              onClick={() => {
                handleClick(item)
              }}
            >
              <img
                alt={item.name}
                className={getImageClassnames(item)}
                src={'icons/' + item.icon}
              />
              <span className="z-10 m-0 hidden md:ml-2 md:inline-block">
                {item.name}
              </span>
            </motion.button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}
