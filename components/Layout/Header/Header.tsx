import React, { useEffect, useState } from 'react'

import { cx } from '@emotion/css'
import menu2 from '@iconify/icons-tabler/menu-2'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import packageJson from 'package.json'
import { useSelector } from 'react-redux'

import styles from '@/components/Layout/Header/Header.module.scss'
import { setMenuShow } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { useAppDispatch } from '@/store/store'

import { easeInOutExpo } from 'utils/Transition'

const bgTitleVariants = {
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    marginLeft: ['2rem', '0rem'],
    transition: {
      staggerChildren: 1,
      ...easeInOutExpo,
    },
  },
  hidden: {
    opacity: 1,
    x: 20,
    transition: easeInOutExpo,
  },
  whileHover: {
    x: '1rem',
  },
}

const titleVariants = {
  initial: {
    x: 0,
    backgroundColor: 'rgb(0 0 0 / 0)',
    transition: easeInOutExpo,
    paddingLeft: '6rem',
  },
  animate: {
    x: '1rem',
    y: '-1rem',
    paddingLeft: '1rem',
    backgroundColor: 'rgb(0 0 0 / 0.5)',
    transition: {
      ...easeInOutExpo,
      backgroundColor: {
        ...easeInOutExpo,
      },
      paddingLeft: {
        ...easeInOutExpo,
      },
    },
  },
  default: {
    x: '1rem',
    y: '-1rem',
    paddingLeft: '1rem',
    backgroundColor: 'rgb(0 0 0 / 0.5)',
    transition: easeInOutExpo,
    opacity: 1,
  },
  whileHover: {
    x: '0rem',
    y: '0rem',
    opacity: 0.5,
  },
}

const subtitleVariants = {
  initial: {
    opacity: 0,
    x: '-100%',
    y: 0,
    backgroundColor: 'rgb(0 0 0 / 0)',
  },
  animate: {
    opacity: 1,
    x: ['13.5rem', '1rem'],
    y: '-1rem',
    paddingLeft: '1rem',
    backgroundColor: 'rgb(0 0 0 / 0.75)',
    transition: {
      ...easeInOutExpo,
      paddingLeft: {
        ...easeInOutExpo,
      },
      backgroundColor: {
        ...easeInOutExpo,
      },
      x: {
        ...easeInOutExpo,
      },
    },
  },
  default: {
    x: '1rem',
    y: '-1rem',
    opacity: 1,
  },
  whileHover: {
    x: '0rem',
    y: '0rem',
    opacity: 0.5,
  },
}

const Header = () => {
  const dispatch = useAppDispatch()
  const potatoMode = useSelector(selectPotatoMode)

  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const titleControls = useAnimation()
  const subtitleControls = useAnimation()

  const setAnimationPlaying = (isPlaying: boolean) => {
    setIsAnimationPlaying(isPlaying)
  }

  useEffect(() => {
    // Initial animations
    titleControls.start(titleVariants.animate)
    subtitleControls.start(subtitleVariants.animate)
  }, [subtitleControls, titleControls])

  return (
    <div className="flex flex-row">
      <motion.div
        layout
        variants={bgTitleVariants}
        initial="hidden"
        animate="visible"
        whileHover="whileHover"
        className="pattern-diagonal-lines-sm group/header relative mr-4 mt-2 flex w-full flex-col overflow-visible text-pink-800/50"
        onHoverStart={() => {
          setIsHovering(true)
          if (!isAnimationPlaying && !potatoMode) {
            setAnimationPlaying(true)
            titleControls.start(titleVariants.whileHover)
            subtitleControls.start(subtitleVariants.whileHover)
          }
        }}
        onHoverEnd={() => {
          setIsHovering(false)
          if (isAnimationPlaying && !potatoMode) {
            setAnimationPlaying(false)
            titleControls.start(titleVariants.default)
            subtitleControls.start(subtitleVariants.default)
          }
        }}
      >
        <motion.h1
          variants={titleVariants}
          initial="initial"
          animate={titleControls}
          className={cx(
            'p-2 font-wide text-5xl font-black text-brand-default',
            !potatoMode && ' backdrop-blur-sm',
            !potatoMode && styles.header
          )}
        >
          {!potatoMode && (
            <video
              src="https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/effects/vfx-vertical-magic-loop.webm"
              loop
              autoPlay
              muted
              playsInline
              className={styles.video}
            />
          )}
          League Tools
        </motion.h1>
        <motion.h2
          variants={subtitleVariants}
          initial="initial"
          animate={subtitleControls}
          className={cx('text-md font-sans tracking-widest text-gray-400', !potatoMode && ' backdrop-blur-sm')}
        >
          ITEM BUILDS
          {packageJson.version.includes('beta') && (
            <span className="ml-2 rounded-full bg-yellow-900 px-2 py-0.5 text-xs font-bold text-white">BETA</span>
          )}
        </motion.h2>
        <button
          className={cx(
            isHovering && 'bg-gray-500/50',
            'group/menu absolute -bottom-2 z-10 -ml-2 inline-flex items-center rounded px-2 py-1 text-gray-500 hover:bg-brand-dark group-hover/header:font-bold group-hover/header:text-white',
            !potatoMode &&
              'backdrop-blur-md backdrop-opacity-0 transition duration-200 group-hover/header:backdrop-opacity-100'
          )}
          onClick={() => dispatch(setMenuShow(true))}
        >
          <Icon icon={menu2} className={cx('', !potatoMode && 'transition duration-200')} width={30} />
          <AnimatePresence>
            <span className="ml-2 bg-transparent">Open Menu</span>
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  )
}

export default Header
