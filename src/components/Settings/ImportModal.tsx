import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import circleCheck from '@iconify/icons-tabler/circle-check'
import circleX from '@iconify/icons-tabler/circle-x'
import clipboardText from '@iconify/icons-tabler/clipboard-text'
import dragDrop from '@iconify/icons-tabler/drag-drop'
import fileCode from '@iconify/icons-tabler/file-code'
import folderIcon from '@iconify/icons-tabler/folder'
import uploadIcon from '@iconify/icons-tabler/upload'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { easeOutExpo } from '@/components/ItemBuild/BuildMakerComponents'
import { motion } from 'framer-motion'
import { FileRejection, useDropzone } from 'react-dropzone'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RiotItemBuild } from '@/types/Build'
import { NotificationType } from '@/types/Toast'

import styles from '@/components/Settings/ImportModal.module.scss'
import { InlineSeparator, Separator, Warning } from '@/components/Settings/ModalComponents'
import { ToastBody } from '@/components/Settings/NotificationToast'
import { useChampions } from '@/hooks/useChampions'
import { setSelectedChampions } from '@/store/appSlice'
import { setRiotItemBuild } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

const baseStyle =
  'border-2 border-dashed border-gray-400 text-gray-400 rounded-md p-4 flex flex-col items-center justify-center space-y-2 transition-colors duration-150 ease-in-out bg-black/40'

const itemBuildSchema: JTDSchemaType<RiotItemBuild> = {
  properties: {
    title: {
      type: 'string',
    },
    associatedMaps: {
      elements: {
        type: 'int32',
      },
    },
    associatedChampions: {
      elements: {
        type: 'int32',
      },
    },
    blocks: {
      elements: {
        properties: {
          items: {
            elements: {
              properties: {
                id: { type: 'string' },
                count: { type: 'int32' },
              },
              optionalProperties: {
                itemId: { type: 'string' },
              },
            },
          },
          type: {
            type: 'string',
          },
        },
      },
    },
  },
}

// Only handle the textarea
type Inputs = {
  build: string
}

const ImportModal = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const dispatch = useAppDispatch()
  const { championsData } = useChampions()
  const potatoMode = useSelector(selectPotatoMode)
  const [itemBuild, setItemBuild] = useState<RiotItemBuild | null>(null)
  // const itemBuildState = useSelector(selectItemBuild)
  const { register, watch, handleSubmit, resetField } = useForm<Inputs>()

  const watchBuild = watch('build')

  const setBuild = useCallback(
    (itemBuild: RiotItemBuild) => {
      if (championsData) {
        const selectedChampions = Object.values(championsData).filter((champion) =>
          itemBuild.associatedChampions.includes(champion.id)
        )
        dispatch(setSelectedChampions(selectedChampions))
        dispatch(setRiotItemBuild(itemBuild))

        toast(
          <ToastBody
            title="Build imported!"
            message="The build has been imported successfully."
            type={NotificationType.Success}
            icon={circleCheck}
          />
        )
      } else {
        console.warn('Champions data not loaded yet.')
        toast(
          <ToastBody
            title="Champions data not loaded yet"
            message="The champions data is not loaded yet. Please try again later."
            type={NotificationType.Error}
            icon={circleX}
          />
        )
      }

      setOpen(false)
    },
    [championsData, dispatch, setOpen]
  )

  const validateBuild = useCallback(
    (itemBuild: RiotItemBuild) => {
      const ajv = new Ajv()
      const validate = ajv.compile(itemBuildSchema)
      const valid = validate(itemBuild)
      if (valid) {
        setItemBuild(itemBuild)
        resetField('build')
      } else {
        console.warn('Invalid json file.')
        toast(
          <ToastBody
            title="Invalid JSON file"
            message="The file you are trying to import is not valid or is not a build."
            type={NotificationType.Error}
            icon={circleX}
          />
        )
      }
    },
    [resetField]
  )

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    try {
      const json = JSON.parse(data.build)
      validateBuild(json)
    } catch (e) {
      console.warn('Invalid json')
      toast(
        <ToastBody
          title="Invalid JSON"
          message="The file you are trying to import is not valid or is not a build."
          type={NotificationType.Error}
          icon={circleX}
        />
      )
    }
  }

  const onCloseToast = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onFileDialogCancel = useCallback(() => {
    toast(<ToastBody title="Import cancelled" type={NotificationType.Info} icon={circleX} />)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Handle json file
      if (acceptedFiles.length > 0) {
        const reader = new FileReader()
        reader.onload = () => {
          const json = JSON.parse(reader.result as string)
          validateBuild(json)
        }
        reader.readAsText(acceptedFiles[0])
      }
    },
    [validateBuild]
  )

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({
    onFileDialogCancel,
    onDrop,
    maxFiles: 1,
    accept: {
      'application/json': ['.json'],
    },
  })

  const inputClassnames = useMemo(() => {
    return cx(
      baseStyle,
      isDragActive && 'border-green-500 text-green-500',
      isDragAccept && 'border-green-500 text-green-500',
      isDragReject && 'border-red-500 text-red-500',
      isFocused && 'border-cyan-500 text-cyan-500'
    )
  }, [isDragActive, isDragAccept, isDragReject, isFocused])

  useEffect(() => {
    if (itemBuild && championsData) {
      setBuild(itemBuild)
    }
  }, [itemBuild, championsData, setBuild])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={onCloseToast}>
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
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
          {/* <NotificationToast {...toast} show={openToast} setShow={setOpenToast} /> */}
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
                'inline-block transform border-2 border-yellow-700 text-left align-bottom transition-all sm:w-full sm:max-w-lg sm:align-middle',
                styles.modalContainer,
                css`
                  &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(rgba(8, 145, 178, 0.75) 0%, rgba(0, 0, 0, 0) 50%);
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
              <div className={cx(styles.modalContent, 'px-6 py-6')}>
                <div className="absolute right-0 top-0 z-10 hidden pr-4 pt-4 sm:block">
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
                    <span className="inline-flex items-center justify-center rounded-full bg-cyan-600 p-1">
                      <Icon icon={uploadIcon} className="h-5 w-5 text-white" inline={true} />
                    </span>
                    <h2>IMPORT BUILD</h2>
                  </motion.div>
                </div>
                <motion.div
                  className="flex flex-col justify-center space-y-4 py-4 text-center sm:mt-0 sm:text-left"
                  initial={{ opacity: 0, y: '20%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '-20%' }}
                  transition={{ ...easeOutExpo, duration: 0.5, delay: 0.2, staggerChildren: 1 }}
                >
                  <Warning>
                    Importing a build will{' '}
                    <u className="text-yellow-400 decoration-yellow-400 decoration-2">
                      <b>overwrite</b>
                    </u>{' '}
                    your current build.
                    <br />
                    <span className="font-light text-gray-300 ">
                      To safely keep your progress, click on the <b>Export Build</b> button in the settings section of
                      the site.
                    </span>
                  </Warning>
                  {/* <Tip>
                  To safely keep your progress, click on the <b>Export Build</b> button in the settings section of the
                  site.
                </Tip>
                <Hint>
                  You can import a build exported from the <b>League of Legends</b> client, or from this site.{' '}
                  <span className="text-gray-400">
                    <i>Just make sure it's a JSON file.</i>
                  </span>
                </Hint> */}
                  {/* <hr className="border-yellow-900" /> */}
                  <div className="flex w-full flex-col justify-between">
                    <div className="space-y-2 rounded-md bg-cyan-700/25 px-4 pb-4 pt-2">
                      <h3 className="flex items-center text-lg font-semibold text-cyan-200 underline decoration-gray-500 decoration-2 underline-offset-4">
                        <Icon icon={fileCode} className="mr-1 h-5 w-5" inline={true} />
                        Load from JSON file
                      </h3>
                      <div {...getRootProps({ className: inputClassnames })}>
                        <input {...getInputProps()} />
                        <div className="flex items-center">
                          <Icon icon={dragDrop} className="mr-1 h-6 w-6" inline={true} />
                          <p>Drag and drop here</p>
                        </div>
                        <InlineSeparator />

                        <button
                          type="button"
                          className="mx-auto inline-flex items-center rounded-md border border-cyan-600 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-extended-colors duration-150 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                        >
                          <Icon className="mr-1 h-5 w-5" icon={folderIcon} inline={true} />
                          Browse...
                        </button>
                      </div>
                    </div>
                    <Separator />
                    {/* Paste your build */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col space-y-2 rounded-md bg-teal-700/25 px-4 pb-4 pt-2"
                    >
                      <h3 className="flex items-center text-lg font-semibold text-teal-200 underline decoration-gray-500 decoration-2 underline-offset-4">
                        <Icon icon={clipboardText} className="mr-1 h-5 w-5" inline={true} />
                        Paste a build
                      </h3>
                      <textarea
                        id="build-textarea"
                        className="font-mono rounded-md border border-gray-700 bg-slate-800 p-2 text-sm text-gray-200 placeholder-gray-500"
                        placeholder="Paste your build here"
                        {...register('build', { required: false })}
                      />
                      <button
                        type="submit"
                        disabled={watchBuild ? watchBuild === '' : true}
                        className="mx-auto inline-flex items-center rounded-md border border-cyan-600 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-extended-colors duration-150 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <Icon className="mr-1 h-5 w-5" icon={uploadIcon} inline={true} />
                        Import from clipboard
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ImportModal
