import dynamic from 'next/dynamic'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cx } from '@emotion/css'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom-interactions'
import checkIcon from '@iconify/icons-tabler/check'
import clipboardText from '@iconify/icons-tabler/clipboard-text'
import downloadIcon from '@iconify/icons-tabler/download'
import trashX from '@iconify/icons-tabler/trash-x'
import uploadIcon from '@iconify/icons-tabler/upload'
import { AnimatePresence, motion } from 'framer-motion'
import { SubmitHandler, useForm } from 'react-hook-form'
import { batch, useSelector } from 'react-redux'

import { ItemNameTooltipVariants } from '@/components/ItemGrid/ItemComponents'
import itemStyles from '@/components/ItemGrid/StandardItem.module.scss'
import PotatoModeSwitch from '@/components/Settings/PotatoModeSwitch'
import ButtonWrapper from '@/components/basic/Button'
import { resetApp } from '@/store/appSlice'
import { resetItemBuild, selectItemBuild, setAssociatedMaps, setTitle } from '@/store/itemBuildSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'
import styles from '@/styles/index.module.scss'
import { Block, Item, ItemBuild } from '@/types/Build'
import { easeInOutExpo, easeInOutQuad } from '@/utils/Transition'

const DynamicResetAlert = dynamic(() => import('./ResetAlert'), { ssr: false })
const DynamicImportModal = dynamic(() => import('./ImportModal'), { ssr: false })
const DynamicExportModal = dynamic(() => import('./ExportModal'), { ssr: false })

type Inputs = {
  title: string
}

const Settings = () => {
  const dispatch = useAppDispatch()
  const itemBuild = useSelector(selectItemBuild)
  const potatoMode = useSelector(selectPotatoMode)

  const [showResetAlert, setShowResetAlert] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
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

  // TODO: Fix this
  const deleteIdFromBlocks = (state: ItemBuild) => {
    // Delete the id property from the state.itemBuild.blocks
    let newBlocks: Block[] = []
    for (const blockState of state.blocks) {
      let { items, type } = blockState
      let newItems: Item[] = []
      for (const item of items) {
        newItems.push({
          id: item.itemId ?? '0',
          count: item.count,
        })
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
    async (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!isDirty) {
        let cleanState = deleteIdFromBlocks(itemBuild)
        await navigator.clipboard.writeText(JSON.stringify(cleanState.itemBuild))
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
    setShowExportModal(true)
    return true
  }, [])

  // const handleExportBuild = useCallback(() => {
  //   if (itemBuild && !isDirty) {
  //     let cleanState = deleteIdFromBlocks(itemBuild)
  //     const docTitle =
  //       itemBuild.title !== '' ? `${itemBuild.title.replace(/[/\\?%*:|"<>]/g, '').trim()}.json` : 'My Build.json'
  //     const downloadContent = `data:text/json;charset=utf-8,${encodeURIComponent(
  //       JSON.stringify(cleanState.itemBuild, null, 2)
  //     )}`

  //     const downloadButtonRef = document.createElement('a')
  //     downloadButtonRef.href = downloadContent
  //     downloadButtonRef.download = docTitle
  //     downloadButtonRef.click()

  //     return true
  //   } else {
  //     setError('title', {
  //       type: 'manual',
  //       message: 'Cannot export build with unsaved changes',
  //     })
  //     return false
  //   }
  // }, [itemBuild, isDirty, setError])

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
          'z-10 col-span-2 -mt-2 grid grid-cols-1 gap-3 border-2 border-yellow-900 px-4 py-4 shadow-xl @container sm:grid-cols-2 md:grid-flow-col md:grid-rows-2 md:gap-1 md:gap-x-6 md:pt-2',
          styles['container-background']
        )}
      >
        <h3 className="flex items-center border-b border-yellow-900 font-body font-semibold text-gray-200 sm:col-span-2 md:col-span-1">
          SETTINGS
        </h3>
        {/* Item Build Page Name */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row-span-1 flex flex-col xs:flex-row sm:col-span-2 md:col-span-1"
          ref={reference}
        >
          <label htmlFor="text" className="text-sm font-medium text-gray-200">
            Build Name
          </label>
          <input
            type="text"
            className={cx(
              'mt-1 flex w-full rounded-md bg-gray-700 px-2 py-1 text-white shadow-sm focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
              !potatoMode && 'transition duration-150',
              isDirty ? 'bg-gray-800 ring-2 ring-cyan-500 focus:ring-cyan-500' : 'focus:ring-brand-light'
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
              'mt-2 inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 xs:ml-2 xs:mt-1',
              !potatoMode && 'transition duration-150',
              isDirty
                ? 'bg-brand-light text-white hover:bg-brand-dark'
                : 'cursor-not-allowed bg-gray-700 text-gray-400 opacity-50'
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
                className={itemStyles.itemTooltip}
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
                <div
                  ref={arrowTooltipRef}
                  data-tooltip-placement={placement}
                  className={itemStyles.itemTooltipArrow}
                  style={{
                    top: arrowY,
                    left: arrowX,
                  }}
                />
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
        <div className="grid w-full grid-rows-4 gap-2 xs:grid-cols-2 xs:grid-rows-2 sm:col-span-2 sm:row-span-2 md:col-span-1">
          <ButtonWrapper
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
          <ButtonWrapper
            className="cursor-not-allowed text-sm opacity-50"
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
            disabled={true}
          />
          <ButtonWrapper
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
          <ButtonWrapper
            className="text-sm"
            label="Reset Build"
            icon={trashX}
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
      <DynamicExportModal open={showExportModal} setOpen={setShowExportModal} />
    </>
  )
}

export default Settings
