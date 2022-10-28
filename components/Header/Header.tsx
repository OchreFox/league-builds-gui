import { css, cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { motion, useAnimation } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { setMenuShow } from '../store/appSlice'
import { selectPotatoMode } from '../store/potatoModeSlice'
import { useAppDispatch } from '../store/store'
import styles from './Header.module.scss'

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

  const easeInOutExpo = {
    type: 'tween',
    ease: [0.87, 0, 0.13, 1],
    duration: 0.4,
  }

  const bgTitleVariants = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      marginLeft: ['2rem', '0rem'],
      transition: {
        staggerChildren: 1,
        delay: 0.7,
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
          delay: 1,
          ...easeInOutExpo,
        },
        paddingLeft: {
          delay: 1,
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
          delay: 1,
          ...easeInOutExpo,
        },
        backgroundColor: {
          delay: 1,
          ...easeInOutExpo,
        },
        x: {
          delay: 1,
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

  useEffect(() => {
    // Initial animations
    titleControls.start(titleVariants.animate)
    subtitleControls.start(subtitleVariants.animate)
  }, [])

  return (
    <div className="flex flex-row">
      <motion.div
        layout
        variants={bgTitleVariants}
        initial="hidden"
        animate="visible"
        whileHover="whileHover"
        className="pattern-diagonal-lines-sm group/header relative mt-2 mr-4 flex w-full flex-col overflow-visible text-pink-800/50"
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
        <button
          className={cx(
            'absolute z-10 -ml-4 px-2 py-1 inline-flex items-center group/menu text-gray-500 group-hover/header:font-bold group-hover/header:text-white hover:bg-brand-dark rounded',
            !potatoMode && 'transition duration-200'
          )}
          onClick={() => dispatch(setMenuShow(true))}
        >
          <Icon icon="tabler:menu-2" className={cx('', !potatoMode && 'transition duration-200')} width={30} />
          {isHovering && (
            <span className={cx('ml-2 bg-transparent', !potatoMode && 'transition duration-200')}>Open Menu</span>
          )}
        </button>
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
            <video src="/effects/vfx-vertical-magic-loop.webm" loop autoPlay muted className={styles.video} />
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
        </motion.h2>
      </motion.div>
    </div>
  )
}

export default Header
