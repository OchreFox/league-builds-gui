import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import alertTriangle from '@iconify/icons-tabler/alert-triangle'
import infoCircle from '@iconify/icons-tabler/info-circle'
import trashX from '@iconify/icons-tabler/trash-x'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '../styles/index.module.scss'
import { useLongPress } from './hooks/useLongPress'
import { selectPotatoMode } from './store/potatoModeSlice'

export default function ResetAlert({
  open,
  setOpen,
  resetBuild,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  resetBuild: () => void
}) {
  const potatoMode = useSelector(selectPotatoMode)

  const [isLongPressing, setIsLongPressing] = useState(false)

  const gestures = useLongPress(
    () => {
      resetBuild()
      setOpen(false)
      setIsLongPressing(false)
    },
    () => {
      setIsLongPressing(true)
    },
    () => {
      setIsLongPressing(false)
    },
    3000
  )

  const x = useMotionValue(-100)
  const transform = useMotionTemplate`translateX(${x}%)`
  useEffect(() => {
    if (isLongPressing) {
      // Start the animation
      animate(x, 0, { duration: 3 })
    } else {
      // Reset the animation
      animate(x, -100, { duration: 0.2 })
    }
  }, [isLongPressing])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={setOpen}>
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={cx(
                'fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity',
                !potatoMode && 'backdrop-blur backdrop-grayscale'
              )}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={cx(
                'inline-block transform overflow-hidden border-2 border-yellow-700 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle',
                styles['container-background']
              )}
            >
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-slate-800 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                </button>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex pb-2 mb-2 border-b border-yellow-900 items-center">
                  <span className="rounded-full bg-brand-dark flex items-center justify-center mr-2 p-1">
                    <Icon icon={alertTriangle} className="h-5 w-5 text-white" inline={true} />
                  </span>
                  <Dialog.Title as="h3" className="font-body font-bold text-red-400 text-lg">
                    RESET BUILD
                  </Dialog.Title>
                </div>
                <div className="text-center sm:mt-0 sm:text-left">
                  <p className="text-base text-gray-200">
                    <span className="text-red-400 font-semibold">WARNING: </span>This will reset your build to the
                    default.
                  </p>
                  <br />
                  <fieldset className="text-gray-400 text-sm border border-cyan-400 rounded-md px-2 pb-2 pt-0.5">
                    <legend className="text-cyan-400 px-2 bg-slate-700 rounded-md inline-flex py-0.5 items-center justify-center">
                      <Icon icon={infoCircle} className="h-5 w-5 mr-1" inline={true} />
                      <b>TIP</b>
                    </legend>
                    To safely keep your progress, click on the <b>Export Build</b> button in the settings section of
                    this webpage.
                  </fieldset>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={cx(
                    'relative inline-flex w-full items-center justify-center rounded-md border border-transparent bg-brand-dark px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm overflow-hidden transition duration-300 ease-in-out',
                    isLongPressing && 'outline-none ring-2 ring-red-400 ring-offset-2'
                  )}
                  {...gestures}
                >
                  <span className="z-10 inline-flex">
                    <Icon icon={trashX} className="h-5 w-5 text-white mr-1" inline={true} />
                    Reset Build<p className="text-gray-300 font-light">&nbsp;(hold)</p>
                  </span>
                  {/* Background color change from left to right when holding the button. */}
                  <motion.div
                    className={cx(
                      'absolute inset-0 bg-red-900 -my-1',
                      css`
                        animation: blink-bg 0.5s linear infinite;
                        @keyframes blink-bg {
                          0% {
                            filter: brightness(100%);
                          }
                          50% {
                            filter: brightness(125%);
                          }
                          100% {
                            filter: brightness(100%);
                          }
                        }
                      `
                    )}
                    style={{ transform }}
                  />
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm transition duration-300 ease-in-out"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
