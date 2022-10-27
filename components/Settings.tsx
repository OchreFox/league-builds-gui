import { cx } from '@emotion/css'
import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as yup from 'yup'

import styles from '../styles/index.module.scss'
import { ItemBuild, ItemBuildSettings } from '../types/Build'
import { easeInOutExpo } from '../utils/Transition'
import PotatoModeSwitch from './PotatoModeSwitch'
import ResetAlert from './ResetAlert'
import { resetItemBuild, selectItemBuild, setAssociatedMaps, setTitle } from './store/itemBuildSlice'
import { selectPotatoMode } from './store/potatoModeSlice'
import { useAppDispatch } from './store/store'

// const schema: yup.ObjectSchema<ItemBuildSettings> = yup.object({
//   title: yup.string().required(),
//   associatedMaps: yup.ar

// })

const Settings = () => {
  const dispatch = useAppDispatch()
  const itemBuild = useSelector(selectItemBuild)
  const potatoMode = useSelector(selectPotatoMode)

  const [showResetAlert, setShowResetAlert] = useState(false)
  const [showCopyMessage, setShowCopyMessage] = useState(false)
  const [mouseHover, setMouseHover] = useState(false)
  const [downloadContent, setDownloadContent] = useState('#')
  const [downloadTitle, setDownloadTitle] = useState('My Build.json')

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const downloadButtonRef = useRef<HTMLAnchorElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemBuildSettings>()

  const onSubmit: SubmitHandler<ItemBuildSettings> = (data) => console.log(data)

  const toggleMap = (payload: number) => {
    if (itemBuild.associatedMaps.includes(payload)) {
      // Remove map from array
      let result = itemBuild.associatedMaps.filter((map) => map !== payload)
      dispatch(setAssociatedMaps(result))
    } else {
      let result = [...itemBuild.associatedMaps]
      result.push(payload)
      dispatch(setAssociatedMaps(result))
    }
  }

  const deleteIdFromBlocks = (state: ItemBuild) => {
    // Delete the id property from the state.itemBuild.blocks
    // This is to prevent the id from being saved in the json file
    let newBlocks = []
    for (const block of state.blocks) {
      let newBlock = { ...block }
      delete newBlock.id
      newBlocks.push(newBlock)
    }
    return {
      itemBuild: {
        ...state,
        blocks: newBlocks,
      },
    }
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // actions.updateTitle(e.target.value)
    dispatch(setTitle(e.target.value))
  }

  const handleCopyButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    handleSubmit(onSubmit)
    setShowCopyMessage(true)
    let modifiedState = deleteIdFromBlocks(itemBuild)
    navigator.clipboard.writeText(JSON.stringify(modifiedState.itemBuild))
  }

  const resetBuild = () => {
    console.log('Resetting build...')
    // actions.deleteState()
    dispatch(resetItemBuild())
    reset()
  }

  useEffect(() => {
    if (mouseHover && showCopyMessage) {
      setTimeout(() => {
        setMouseHover(false)
        setShowCopyMessage(false)
        copyButtonRef.current?.blur()
      }, 3000)
    }
    if (itemBuild) {
      let modifiedState = deleteIdFromBlocks(itemBuild)
      setDownloadTitle(`${itemBuild.title.trim()}.json` || 'My Build.json')
      setDownloadContent(
        `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(modifiedState.itemBuild, null, 2))}`
      )
    }
  }, [mouseHover, showCopyMessage, itemBuild])

  useEffect(() => {
    if (errors) {
      console.log(errors)
    }
  }, [errors])

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cx(
          'z-10 col-span-2 -mt-2 grid grid-cols-1 gap-3 border-2 border-yellow-900 px-4 py-4 shadow-xl md:grid-flow-col md:grid-cols-2 md:grid-rows-2 md:gap-1 md:gap-x-6 md:pt-2',
          styles['container-background']
        )}
      >
        <h3 className="flex items-center border-b border-yellow-900 font-body font-semibold text-gray-200">SETTINGS</h3>
        {/* Item Build Page Name */}
        <div className="row-span-1 flex">
          <label htmlFor="text" className="text-sm font-medium text-gray-200">
            Build Name
          </label>
          <input
            {...register('title', { required: true })}
            type="text"
            name="title"
            className={cx(
              'mt-1 flex w-full rounded-md bg-gray-700 py-1 px-2 text-white shadow-sm focus:border-brand-default focus:ring-brand-default sm:text-sm',
              !potatoMode && 'transition duration-100'
            )}
            placeholder="Enter a name..."
            onChange={(e) => handleTitleChange(e)}
            defaultValue={itemBuild.title}
          />
        </div>
        {/* Associated maps */}
        <div className="row-span-2 grid grid-cols-2 grid-rows-2 gap-2 md:grid-flow-col">
          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => toggleMap(11)} className="relative h-8 w-8 select-none">
              <motion.img
                src="icons/sr-selected.webp"
                alt="sr-selected"
                className="absolute h-8 w-8"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: itemBuild?.associatedMaps?.includes(11) ? 1 : 0,
                }}
                transition={easeInOutExpo}
              />
              <motion.img
                src="icons/sr-inactive.webp"
                alt="sr-inactive"
                className="absolute h-8 w-8"
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
                animate={{
                  opacity: itemBuild?.associatedMaps?.includes(11) ? 0 : 1,
                }}
                transition={easeInOutExpo}
              />
              <img src="icons/sr-hover.webp" alt="sr-hover" className="h-8 w-8" />
            </button>
            <button type="button" onClick={() => toggleMap(12)} className="relative h-8 w-8 select-none">
              <motion.img
                src="icons/aram-selected.webp"
                alt="sr-selected"
                className="absolute h-8 w-8"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: itemBuild?.associatedMaps?.includes(12) ? 1 : 0,
                }}
                transition={easeInOutExpo}
              />
              <motion.img
                src="icons/aram-inactive.webp"
                alt="sr-inactive"
                className="absolute h-8 w-8"
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
                animate={{
                  opacity: itemBuild?.associatedMaps?.includes(12) ? 0 : 1,
                }}
                transition={easeInOutExpo}
              />
              <img src="icons/aram-hover.webp" alt="sr-hover" className="h-8 w-8" />
            </button>
            <p className="ml-3 text-sm font-medium text-gray-200">Associated Maps</p>
          </div>
          <PotatoModeSwitch />
          <div className="flex w-full space-x-2">
            <button
              type="submit"
              ref={copyButtonRef}
              className={cx(
                'relative grow overflow-hidden rounded-md border-2 border-brand-light px-2 text-sm font-medium text-white shadow-sm hover:bg-brand-light focus:bg-green-400 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
                !potatoMode && 'transition duration-100'
              )}
              onClick={(e) => handleCopyButton(e)}
              onBlur={() => setShowCopyMessage(false)}
              onMouseLeave={() => {
                setMouseHover(true)
              }}
            >
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: 0 }}
                animate={{ y: showCopyMessage ? '-200%' : 0 }}
              >
                <Icon icon="tabler:clipboard-text" className="mr-1 h-5 w-5" inline={true} />
                Copy Build
              </motion.span>
              <motion.span
                className="flex items-center justify-center"
                initial={{ y: '200%' }}
                animate={{ y: showCopyMessage ? 0 : '200%' }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon icon="tabler:check" className="mr-1 h-5 w-5" inline={true} />
                Copied!
              </motion.span>
            </button>
            <a
              ref={downloadButtonRef}
              href={downloadContent}
              download={downloadTitle}
              className={cx(
                'flex grow items-center justify-center rounded-md border-2 border-brand-light px-2 text-sm font-medium text-white shadow-sm hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
                !potatoMode && 'transition duration-100'
              )}
            >
              <Icon icon="tabler:file-export" className="mr-1 h-5 w-5" inline={true} />
              Export Build
            </a>
          </div>
          <button
            type="submit"
            className={cx(
              'flex items-center justify-center rounded-md border-2 border-transparent border-brand-dark px-6 text-base font-medium text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2',
              !potatoMode && 'transition duration-100'
            )}
            onClick={(e) => {
              e.preventDefault()
              setShowResetAlert(true)
            }}
          >
            <Icon icon="tabler:trash" className="mr-1 h-6 w-6" inline={true} />
            Reset Build
          </button>
        </div>
      </form>
      <ResetAlert resetBuild={() => resetBuild()} open={showResetAlert} setOpen={setShowResetAlert} />
    </>
  )
}

export default Settings
