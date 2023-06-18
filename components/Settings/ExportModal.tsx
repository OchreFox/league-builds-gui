import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import checkIcon from '@iconify/icons-tabler/check'
import clipboardText from '@iconify/icons-tabler/clipboard-text'
import downloadIcon from '@iconify/icons-tabler/download'
import folderIcon from '@iconify/icons-tabler/folder'
import linkIcon from '@iconify/icons-tabler/link'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import { makeJsonEncoder } from '@urlpack/json'
import Button from 'components/basic/Button'
import { AnimatePresence, motion } from 'framer-motion'
import { batch, useSelector } from 'react-redux'

import { setSelectedChampions } from '@/store/appSlice'
import { selectItemBuild, setRiotItemBuild } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

import { easeOutExpo } from 'utils/Transition'

// import { compressUrlSafe } from 'utils/lzma-url'
import styles from './ExportModal.module.scss'
import { Hint, Separator } from './ModalComponents'
import { ToastBody } from './NotificationToast'

const ExportModal = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const potatoMode = useSelector(selectPotatoMode)
  const itemBuild = useSelector(selectItemBuild)
  const [showLink, setShowLink] = useState(false)
  const [buildLink, setBuildLink] = useState('')

  const onCloseToast = useCallback(() => {
    setOpen(false)
  }, [])

  const onCopyLink = useCallback(async () => {
    const encoder = makeJsonEncoder()
    const compressedBuild = encoder.encode(itemBuild)
    const buildLink = `${window.location.origin}/build/${compressedBuild}`
    await navigator.clipboard.writeText(buildLink)
    setBuildLink(buildLink)
    setShowLink(true)
    return true
  }, [])

  // Clear link copied state when modal is closed
  useEffect(() => {
    if (!open) {
      setShowLink(false)
      setBuildLink('')
    }
  }, [open])

  useEffect(() => {
    return () => {
      setShowLink(false)
      setBuildLink('')
    }
  }, [])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={onCloseToast}>
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
                'fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity',
                !potatoMode && 'backdrop-blur backdrop-grayscale'
              )}
            />
          </Transition.Child>
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
                'inline-block transform overflow-hidden border-2 border-yellow-700 px-4 pt-5 pb-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle',
                styles.modalContainer,
                css`
                  &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(rgba(221, 123, 57, 0.75) 0%, rgba(0, 0, 0, 0) 50%);
                    background-size: 200% 200%;
                    background-position: 100% 100%;

                    animation: move-gradient-export 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;

                    @keyframes move-gradient-export {
                      0% {
                        background-position: 100% 0%;
                        opacity: 1;
                      }
                      100% {
                        background-position: 0% 100%;
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
                  onClick={onCloseToast}
                >
                  <span className="sr-only pointer-events-none">Close</span>
                  <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                </button>
              </div>
              <div className="flex w-full flex-col">
                <motion.div
                  className="flex items-center space-x-2 border-b border-yellow-900 pb-2 font-body text-xl font-semibold text-gray-200"
                  initial={{ opacity: 0, x: '50%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '-50%' }}
                  transition={{ ...easeOutExpo, duration: 0.5, delay: 0.1 }}
                >
                  <span className="inline-flex items-center justify-center rounded-full bg-green-700 p-1">
                    <Icon icon={downloadIcon} className="h-5 w-5 text-white" inline={true} />
                  </span>
                  <h3>EXPORT BUILD</h3>
                </motion.div>
              </div>
              <motion.div
                className="flex flex-col justify-center space-y-4 py-4 text-center sm:mt-0 sm:text-left"
                initial={{ opacity: 0, y: '20%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-20%' }}
                transition={{ ...easeOutExpo, duration: 0.5, delay: 0.2, staggerChildren: 1 }}
              >
                <Hint>
                  <ul className="list-inside list-disc">
                    <li>
                      You can export your build as a <b>JSON file</b> to import it in the League of Legends client
                    </li>
                    {/* <li>
                      Alternatively, you can <b>generate a link</b> to share your build.
                    </li> */}
                  </ul>
                </Hint>
                <hr className="border-yellow-900" />
                <div className="flex w-full flex-col justify-between">
                  <button
                    type="button"
                    className="mx-auto inline-flex items-center rounded-md border border-green-600 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-extended-colors duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Icon className="mr-1 h-5 w-5" icon={folderIcon} inline={true} />
                    Export as JSON
                  </button>
                  {/* <Separator />
                  <button
                    type="button"
                    className="mx-auto inline-flex items-center rounded-md border border-green-600 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-extended-colors duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={onCopyLink}
                  >
                    <Icon className="mr-1 h-5 w-5" icon={linkIcon} inline={true} />
                    Generate link
                  </button> */}
                  {showLink && (
                    <motion.div
                      className="flex flex-col justify-center space-y-4 py-4 text-center sm:mt-0 sm:text-left"
                      initial={{ opacity: 0, x: '50%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '-50%' }}
                      transition={easeOutExpo}
                    >
                      <motion.input
                        type="text"
                        id="build-link"
                        className="font-mono rounded-md border border-gray-700 bg-slate-800 p-2 text-sm text-gray-200 placeholder-gray-500 transition-extended-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
                        value={buildLink}
                        readOnly={true}
                        initial={{ opacity: 0, x: '50%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-50%' }}
                        transition={easeOutExpo}
                      />
                      <motion.div
                        className="sm:flex sm:flex-row-reverse"
                        initial={{ opacity: 0, x: '50%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-50%' }}
                        transition={easeOutExpo}
                      >
                        <Button
                          className="inline-flex justify-center px-4 py-4 text-sm"
                          label="Copy link"
                          icon={clipboardText}
                          labelReactive="Copied!"
                          iconReactive={checkIcon}
                          reactive={true}
                          outlined={true}
                          color="text-white"
                          colorReactive="text-white"
                          bgColor="bg-transparent"
                          bgClick="focus:bg-brand-light"
                          bgHover="hover:bg-brand-default"
                          outlineColor="border-brand-default"
                          rounded="rounded-md"
                          handleClick={onCopyLink}
                          layoutId="copy-link"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ExportModal
