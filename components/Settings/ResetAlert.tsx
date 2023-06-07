import React, { Fragment, useEffect, useState } from 'react'

import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import trashX from '@iconify/icons-tabler/trash-x'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { NotificationType } from 'types/Toast'

import { useLongPress } from '@/hooks/useLongPress'
import { selectPotatoMode } from '@/store/potatoModeSlice'

import { easeOutExpo } from 'components/ItemBuild/BuildMakerComponents'

import styles from '/styles/index.module.scss'

import { Tip, Warning } from './ModalComponents'
import { ToastBody } from './NotificationToast'

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
    // On long press complete
    () => {
      resetBuild()
      setOpen(false)
      setIsLongPressing(false)
      toast(
        <ToastBody
          title="Build Reset"
          message="Your build has been reset."
          type={NotificationType.Success}
          icon={trashX}
        />
      )
    },
    // On press
    () => {
      setIsLongPressing(true)
    },
    // On release
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
            enter="ease-out-expo duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out-expo duration-200"
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
            enter="ease-out-expo duration-300"
            enterFrom="opacity-0 translate-x-16"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in-out-expo duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-16"
          >
            <div
              className={cx(
                'inline-block transform overflow-hidden border-2 border-yellow-700 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle',
                styles['container-background'],
                css`
                  &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(rgba(220, 38, 38, 0.75) 0%, rgba(0, 0, 0, 0) 50%);
                    background-size: 200% 200%;
                    background-position: 100% 100%;

                    animation: move-gradient 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;

                    @keyframes move-gradient {
                      0% {
                        background-position: 0 0;
                        opacity: 1;
                      }
                      100% {
                        background-position: 100% 100%;
                        opacity: 0.25;
                      }
                    }
                  }
                `
              )}
            >
              <div className="absolute top-0 right-0 z-10 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-slate-800 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only pointer-events-none">Close</span>
                  <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                </button>
              </div>

              <div className="flex w-full flex-col">
                <motion.div
                  className="flex items-center space-x-2 border-b border-yellow-900 pb-2 font-body text-xl font-semibold text-red-400"
                  initial={{ opacity: 0, x: '50%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '-50%' }}
                  transition={{ ...easeOutExpo, duration: 0.5, delay: 0.1 }}
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-red-600 p-1">
                    <Icon icon={trashX} className="h-5 w-5 text-white" inline={true} />
                  </span>
                  <Dialog.Title as="h3">RESET BUILD</Dialog.Title>
                </motion.div>
              </div>
              <motion.div
                className="flex flex-col justify-center space-y-4 py-4 text-center sm:mt-0 sm:text-left"
                initial={{ opacity: 0, y: '20%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-20%' }}
                transition={{ ...easeOutExpo, duration: 0.5, delay: 0.2 }}
              >
                <Warning>
                  <p>This action will delete your current build.</p>
                  <p className="text-yellow-400">
                    <b>All progress will be lost.</b>
                  </p>
                </Warning>
                <Tip>
                  To safely keep your progress, click on the <b>Export Build</b> button in the settings section of the
                  site.
                </Tip>
              </motion.div>
              <motion.div
                className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse"
                initial={{ opacity: 0, x: '50%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-50%' }}
                transition={{ ...easeOutExpo, duration: 1, delay: 0.2 }}
              >
                <button
                  type="button"
                  className={cx(
                    'relative inline-flex w-full items-center justify-center overflow-hidden rounded-md border border-transparent bg-brand-dark px-4 py-2 text-base font-medium text-white shadow-sm transition duration-300 ease-in-out sm:ml-3 sm:w-auto sm:text-sm',
                    isLongPressing && 'outline-none ring-2 ring-red-400 ring-offset-2'
                  )}
                  {...gestures}
                >
                  <span className="z-10 inline-flex">
                    <Icon icon={trashX} className="mr-1 h-5 w-5 text-white" inline={true} />
                    Reset Build<p className="font-light text-gray-300">&nbsp;(hold)</p>
                  </span>
                  {/* Background color change from left to right when holding the button. */}
                  <motion.div
                    className={cx(
                      'absolute inset-0 -my-1 bg-red-900',
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
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition duration-300 ease-in-out hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
