import { Fragment, useCallback } from 'react'

import { cx } from '@emotion/css'
import Giscus from '@giscus/react'
import { Dialog, Transition } from '@headlessui/react'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'

import styles from '@/components/Layout/StyledContainer.module.scss'
import { selectMenu, setMenuShow } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

export default function SliderOverlay() {
  const dispatch = useAppDispatch()
  const menu = useSelector(selectMenu)
  const potatoMode = useSelector(selectPotatoMode)

  const hideMenu = useCallback(() => {
    dispatch(setMenuShow(false))
    return true
  }, [dispatch])

  return (
    <Transition.Root show={menu.show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-hidden" onClose={hideMenu}>
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
                    'flex h-full flex-col overflow-y-auto border-r-2 border-yellow-900 py-6 shadow-xl',
                    !potatoMode && 'backdrop-blur-md',
                    styles['smooth-shadow'],
                    styles['container-background']
                  )}
                >
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="pointer-events-none mb-4 select-none font-body text-2xl font-bold text-white">
                        Share your feedback!
                      </Dialog.Title>
                      <div className="ml-3 flex items-center">
                        <button
                          type="button"
                          className="rounded-md bg-slate-800 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
                          onClick={hideMenu}
                        >
                          <span className="sr-only pointer-events-none">Close</span>
                          <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="absolute inset-0 px-4 sm:px-6">
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
                        theme="transparent_dark"
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
