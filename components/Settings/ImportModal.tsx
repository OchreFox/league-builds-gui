import { useChampions } from '@/hooks/useChampions'
import { setSelectedChampions } from '@/store/appSlice'
import { setRiotItemBuild } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import { css, cx } from '@emotion/css'
import { Dialog, Transition } from '@headlessui/react'
import circleCheck from '@iconify/icons-tabler/circle-check'
import circleX from '@iconify/icons-tabler/circle-x'
import folderIcon from '@iconify/icons-tabler/folder'
import infoCircle from '@iconify/icons-tabler/info-circle'
import uploadIcon from '@iconify/icons-tabler/upload'
import xIcon from '@iconify/icons-tabler/x'
import { Icon } from '@iconify/react'
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { motion } from 'framer-motion'
import React, { Fragment, useCallback, useMemo } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RiotItemBuild } from 'types/Build'
import { ChampionsSchema } from 'types/Champions'
import { NotificationType } from 'types/Toast'

import { easeOutExpo } from 'components/ItemBuild/BuildMakerComponents'

import styles from '../Layout/StyledContainer.module.scss'
import { ToastBody } from './NotificationToast'

const baseStyle =
  'border-2 border-dashed border-gray-400 text-gray-400 rounded-md p-4 flex flex-col items-center justify-center space-y-2 transition-colors duration-150 ease-in-out'

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
                uid: { type: 'string' },
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

const Separator = () => {
  return (
    <span
      className={cx(
        'italic text-gray-400 text-sm mx-auto py-2 inline-flex items-center justify-center',
        css`
          &::before {
            content: '';
            display: inline-block;
            width: 6rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-right: 0.5rem;
          }
          &::after {
            content: '';
            display: inline-block;
            width: 6rem;
            height: 1px;
            background-color: rgb(8, 145, 178);
            margin-left: 0.5rem;
          }
        `
      )}
    >
      or
    </span>
  )
}

// Only handle the textarea
type Inputs = {
  build: string
}

const ImportModal = ({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { championsData } = useChampions()
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)
  const { register, handleSubmit, resetField } = useForm<Inputs>()

  function setBuild(itemBuild: RiotItemBuild) {
    if (championsData) {
      const selectedChampions = itemBuild.associatedChampions.map((championId: number) => {
        return Object.values(championsData).find((champion) => champion.id === championId)
      }) as ChampionsSchema[]
      dispatch(setSelectedChampions(selectedChampions))
    }
    dispatch(setRiotItemBuild(itemBuild))
    toast(
      <ToastBody
        title="Build imported!"
        message="The build has been imported successfully."
        type={NotificationType.Success}
        icon={circleCheck}
      />
    )
    setOpen(false)
  }

  const validateBuild = (itemBuild: RiotItemBuild) => {
    const ajv = new Ajv()
    const validate = ajv.compile(itemBuildSchema)
    const valid = validate(itemBuild)
    if (valid) {
      setBuild(itemBuild)
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
  }

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
  }, [])

  const onFileDialogCancel = useCallback(() => {
    toast(<ToastBody title="Import cancelled" type={NotificationType.Info} icon={circleX} />)
  }, [])

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle json file
    if (acceptedFiles.length > 0) {
      const reader = new FileReader()
      reader.onload = () => {
        const json = JSON.parse(reader.result as string)
        validateBuild(json)
      }
      reader.readAsText(acceptedFiles[0])
    }
  }, [])

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
                'fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity',
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
              <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block z-10">
                <button
                  type="button"
                  className="rounded-md bg-slate-800 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2"
                  onClick={onCloseToast}
                >
                  <span className="sr-only pointer-events-none">Close</span>
                  <Icon icon={xIcon} className="h-6 w-6" inline={true} />
                </button>
              </div>
              <div className="flex flex-col w-full">
                <motion.div
                  className="flex items-center space-x-2 pb-2 font-body font-semibold text-gray-200 text-xl border-b border-yellow-900"
                  initial={{ opacity: 0, x: '50%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '-50%' }}
                  transition={{ ...easeOutExpo, duration: 0.5, delay: 0.1 }}
                >
                  <span className="rounded-full bg-cyan-600 inline-flex items-center justify-center p-1">
                    <Icon icon={uploadIcon} className="h-5 w-5 text-white" inline={true} />
                  </span>
                  <h3>IMPORT BUILD</h3>
                </motion.div>
              </div>
              <motion.div
                className="text-center sm:mt-0 sm:text-left flex flex-col justify-center py-4 space-y-4"
                initial={{ opacity: 0, y: '20%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-20%' }}
                transition={{ ...easeOutExpo, duration: 0.5, delay: 0.2, staggerChildren: 1 }}
              >
                <p className="text-base text-gray-200">
                  <span className="text-red-400 font-semibold">WARNING: </span> Importing a build will{' '}
                  <u className="decoration-red-400 text-red-400 decoration-2">overwrite</u> your current build.
                </p>
                <fieldset
                  className={cx(
                    'text-gray-400 text-sm border border-cyan-400 rounded-md px-2 pb-2 pt-0.5',
                    css`
                      filter: drop-shadow(0 0 2rem rgba(165, 243, 252, 0.25))
                        drop-shadow(0 0 0.25rem rgba(165, 243, 252, 0.3));
                    `
                  )}
                >
                  <legend className="text-cyan-400 px-2 bg-slate-700 rounded-md inline-flex py-0.5 items-center justify-center border border-cyan-400">
                    <Icon icon={infoCircle} className="h-5 w-5 mr-1" inline={true} />
                    <b>TIP</b>
                  </legend>
                  To safely keep your progress, click on the <b>Export Build</b> button in the settings section of the
                  site.
                </fieldset>
                <div {...getRootProps({ className: inputClassnames })}>
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className="inline-flex mx-auto items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm text-white bg-transparent border-cyan-600 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-extended-colors duration-150"
                  >
                    <Icon className="mr-1 w-5 h-5" icon={folderIcon} inline={true} />
                    Select a file
                  </button>
                  <Separator />
                  <Icon icon={uploadIcon} className="h-10 w-10" />
                  <p>Drop a file here</p>
                </div>
                <Separator />

                {/* Paste your build */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
                  <label htmlFor="build" className="text-gray-200 text-sm font-semibold text-center">
                    Paste your build
                  </label>
                  <textarea
                    id="build-textarea"
                    className="bg-slate-800 border border-gray-700 rounded-md text-gray-200 text-sm font-mono p-2"
                    placeholder="Paste your build here"
                    {...register('build', { required: false })}
                  />
                  <button
                    type="submit"
                    className="inline-flex mx-auto items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm text-white bg-transparent border-cyan-600 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-extended-colors duration-150"
                  >
                    <Icon className="mr-1 w-5 h-5" icon={uploadIcon} inline={true} />
                    Import from clipboard
                  </button>
                </form>
              </motion.div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ImportModal
