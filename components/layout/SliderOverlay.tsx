import { cx } from '@emotion/css'
import Giscus from '@giscus/react'
import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import Button from '../basic/Button'
import { selectMenu, setMenuShow } from '../store/appSlice'
import { selectPotatoMode } from '../store/potatoModeSlice'
import { useAppDispatch } from '../store/store'
import StyledContainer from './StyledContainer'
import styles from './StyledContainer.module.scss'

export default function SliderOverlay() {
  const dispatch = useAppDispatch()
  const menu = useSelector(selectMenu)
  const potatoMode = useSelector(selectPotatoMode)

  return (
    <Transition.Root show={menu.show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden z-10" onClose={() => dispatch(setMenuShow(false))}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-out-expo duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out-expo duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-black/50 transition-opacity" />
          </Transition.Child>
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out-expo duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out-expo duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div
                  className={cx(
                    'flex h-full flex-col overflow-y-auto py-6 shadow-xl border-r-2 border-yellow-900',
                    !potatoMode && 'backdrop-blur-md',
                    styles['smooth-shadow'],
                    styles['container-background']
                  )}
                >
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900"> Panel title </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <Button
                          icon="tabler:x"
                          background="bg-brand-default"
                          color="text-white"
                          reactive={false}
                          bgClick="bg-brand-dark"
                          rounded="rounded-md"
                          handleClick={() => dispatch(setMenuShow(false))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="absolute inset-0 px-4 sm:px-6">
                      <h1 className="font-body text-2xl font-bold select-none pointer-events-none text-white mb-4">
                        Share your feedback!
                      </h1>
                      <Giscus
                        id="Feedback"
                        repo="OchreFox/league-builds-gui"
                        repoId="R_kgDOHWrllg"
                        category="Feedback"
                        categoryId="DIC_kwDOHWrlls4CPVXt"
                        mapping="pathname"
                        reactionsEnabled="0"
                        emitMetadata="0"
                        inputPosition="top"
                        theme="dark"
                        lang="en"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}