import dynamic from 'next/dynamic'

import { css, cx } from '@emotion/css'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom-interactions'
import checkIcon from '@iconify/icons-tabler/check'
import clipboardText from '@iconify/icons-tabler/clipboard-text'
import downloadIcon from '@iconify/icons-tabler/download'
import trashIcon from '@iconify/icons-tabler/trash'
import uploadIcon from '@iconify/icons-tabler/upload'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { batch, useSelector } from 'react-redux'

import { ItemNameTooltipVariants, itemTooltipClass } from 'components/ItemGrid/ItemComponents'

import { Block, Item, ItemBuild } from '../../types/Build'
import { easeInOutExpo, easeInOutQuad } from '../../utils/Transition'
import Button from '../basic/Button'
import { resetApp } from '../store/appSlice'
import { resetItemBuild, selectItemBuild, setAssociatedMaps, setTitle } from '../store/itemBuildSlice'
import { selectPotatoMode } from '../store/potatoModeSlice'
import { useAppDispatch } from '../store/store'
import PotatoModeSwitch from './PotatoModeSwitch'
import styles from '/styles/index.module.scss'

const DynamicResetAlert = dynamic(() => import('./ResetAlert'), { ssr: false })
const DynamicImportModal = dynamic(() => import('./ImportModal'), { ssr: false })

type Inputs = {
  title: string
}

const Settings = () => {
  const dispatch = useAppDispatch()
  const itemBuild = useSelector(selectItemBuild)
  const potatoMode = useSelector(selectPotatoMode)

  const [showResetAlert, setShowResetAlert] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  // const [downloadContent, setDownloadContent] = useState('#')
  // const [downloadTitle, setDownloadTitle] = useState('My Build.json')

  // const downloadButtonRef = useRef<HTMLAnchorElement>(null)
  const arrowTooltipRef = useRef(null)

  const isSummonersRift = useMemo(() => itemBuild.associatedMaps.includes(11), [itemBuild.associatedMaps])
  const isHowlingAbyss = useMemo(() => itemBuild.associatedMaps.includes(12), [itemBuild.associatedMaps])

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: itemBuild.title,
    },
  })

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    placement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    open: true,
    // onOpenChange: setShowTooltip,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), shift({ padding: 5 }), flip(), arrow({ element: arrowTooltipRef })],
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(setTitle(data.title))
    // Reset form with new value to reset isDirty
    reset({ title: data.title })
  }

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
    let newBlocks: Block[] = []
    for (const blockState of state.blocks) {
      let { items, type } = blockState
      let newItems: Item[] = []
      for (const item of items) {
        const { uid, ...rest } = item
        newItems.push(rest)
      }
      newBlocks.push({ type, items: newItems })
    }
    return {
      itemBuild: {
        ...state,
        blocks: newBlocks,
      },
    }
  }

  const handleCopyButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!isDirty) {
        let cleanState = deleteIdFromBlocks(itemBuild)
        navigator.clipboard.writeText(JSON.stringify(cleanState.itemBuild))
        return true
      } else {
        setError('title', {
          type: 'manual',
          message: 'Cannot copy build with unsaved changes',
        })
        return false
      }
    },
    [itemBuild, isDirty, setError]
  )

  const handleImportBuild = useCallback(() => {
    setShowImportModal(true)
    return true
  }, [])

  const handleExportBuild = useCallback(() => {
    if (itemBuild && !isDirty) {
      let cleanState = deleteIdFromBlocks(itemBuild)
      const docTitle =
        itemBuild.title !== '' ? `${itemBuild.title.replace(/[/\\?%*:|"<>]/g, '').trim()}.json` : 'My Build.json'
      const downloadContent = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(cleanState.itemBuild, null, 2)
      )}`

      const downloadButtonRef = document.createElement('a')
      downloadButtonRef.href = downloadContent
      downloadButtonRef.download = docTitle
      downloadButtonRef.click()

      return true
    } else {
      setError('title', {
        type: 'manual',
        message: 'Cannot export build with unsaved changes',
      })
      return false
    }
  }, [itemBuild, isDirty, setError])

  const openResetAlert = useCallback(() => {
    setShowResetAlert(true)
    return true
  }, [])

  const resetBuild = useCallback(() => {
    batch(() => {
      dispatch(resetItemBuild())
      dispatch(resetApp())
    })
    // reset input value
  }, [dispatch])

  // On itemBuild.title change, reset the form with the new value
  useEffect(() => {
    if (watch('title') !== itemBuild.title) {
      reset({ title: itemBuild.title })
    }
  }, [itemBuild.title, reset, watch])

  return (
    <>
      <div
        className={cx(
          'z-10 col-span-2 -mt-2 grid grid-cols-1 gap-3 border-2 border-yellow-900 px-4 py-4 shadow-xl md:grid-flow-col md:grid-cols-2 md:grid-rows-2 md:gap-1 md:gap-x-6 md:pt-2',
          styles['container-background']
        )}
      >
        <h3 className="flex items-center border-b border-yellow-900 font-body font-semibold text-gray-200">SETTINGS</h3>
        {/* Item Build Page Name */}
        <form onSubmit={handleSubmit(onSubmit)} className="row-span-1 flex" ref={reference}>
          <label htmlFor="text" className="text-sm font-medium text-gray-200">
            Build Name
          </label>
          <input
            type="text"
            className={cx(
              'mt-1 flex w-full rounded-md bg-gray-700 py-1 px-2 text-white shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-gray-800',
              !potatoMode && 'transition duration-150',
              isDirty ? 'ring-2 ring-cyan-500 focus:ring-cyan-500 bg-gray-800' : 'focus:ring-brand-light'
            )}
            placeholder="Enter a name..."
            {...register('title', {
              required: {
                value: true,
                message: 'Please enter a name for your build',
              },
            })}
          />
          <button
            type="submit"
            disabled={!isDirty}
            className={cx(
              'ml-2 inline-flex items-center px-2 mt-1 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light',
              !potatoMode && 'transition duration-150',
              isDirty
                ? 'bg-brand-light hover:bg-brand-dark text-white'
                : 'bg-gray-700 cursor-not-allowed text-gray-400 opacity-50'
            )}
          >
            Save
          </button>
          <AnimatePresence>
            {errors.title && (
              <motion.div
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                }}
                className={cx(
                  'z-20 px-2 py-1 border border-yellow-700 shadow-lg text-white font-semibold text-center bg-yellow-700/50',
                  !potatoMode &&
                    css`
                      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                      backdrop-filter: blur(5px);
                    `
                )}
                variants={ItemNameTooltipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  ...easeInOutQuad,
                  duration: 0.1,
                }}
              >
                <span>{errors.title.message}</span>
                <div ref={arrowTooltipRef} className={itemTooltipClass(placement, arrowX, arrowY, potatoMode, true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        {/* Associated maps */}
        <div className="flex items-center space-x-4">
          <button type="button" onClick={() => toggleMap(11)} className="relative h-8 w-8 select-none">
            <motion.img
              src="icons/sr-selected.webp"
              alt="sr-selected"
              className="absolute h-8 w-8"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isSummonersRift ? 1 : 0,
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
                opacity: isSummonersRift ? 0 : 1,
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
                opacity: isHowlingAbyss ? 1 : 0,
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
                opacity: isHowlingAbyss ? 0 : 1,
              }}
              transition={easeInOutExpo}
            />
            <img src="icons/aram-hover.webp" alt="sr-hover" className="h-8 w-8" />
          </button>
          <p className="ml-3 text-sm font-medium text-gray-200">Associated Maps</p>
        </div>
        <PotatoModeSwitch />
        {/*  Build Import/Export */}
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 row-span-2">
          <Button
            className="text-sm"
            label="Import Build"
            icon={uploadIcon}
            labelReactive="Build Imported!"
            iconReactive={checkIcon}
            reactive={false}
            outlined={true}
            color="text-white"
            bgColor="bg-transparent"
            bgClick="focus:bg-cyan-700"
            bgHover="hover:bg-cyan-600"
            outlineColor="border-cyan-600"
            rounded="rounded-md"
            handleClick={handleImportBuild}
          />
          <Button
            className="text-sm"
            label="Export Build"
            icon={downloadIcon}
            labelReactive="Exported!"
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
            handleClick={handleExportBuild}
          />
          <Button
            className="text-sm"
            label="Copy Build"
            icon={clipboardText}
            labelReactive="Build Copied!"
            iconReactive={checkIcon}
            reactive={true}
            outlined={true}
            color="text-white"
            bgColor="bg-transparent"
            bgClick="focus:bg-green-400"
            bgHover="hover:bg-green-600"
            outlineColor="border-green-600"
            rounded="rounded-md"
            handleClick={handleCopyButton}
          />
          <Button
            className="text-sm"
            label="Reset Build"
            icon={trashIcon}
            reactive={false}
            outlined={true}
            color="text-white"
            bgColor="bg-transparent"
            bgClick="focus:bg-red-800"
            bgHover="hover:bg-brand-dark"
            outlineColor="border-brand-dark"
            rounded="rounded-md"
            handleClick={openResetAlert}
          />
        </div>
      </div>
      <DynamicResetAlert resetBuild={resetBuild} open={showResetAlert} setOpen={setShowResetAlert} />
      <DynamicImportModal open={showImportModal} setOpen={setShowImportModal} />
    </>
  )
}

export default Settings
