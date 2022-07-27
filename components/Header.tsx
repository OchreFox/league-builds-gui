import { css, cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { motion, useAnimation } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'

import { PotatoModeContext } from './hooks/PotatoModeStore'

const Header = () => {
  const { state } = useContext(PotatoModeContext)

  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
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
        className="pattern-diagonal-lines-sm group relative mt-2 mr-4 flex w-full flex-col overflow-visible text-pink-800/50"
        onHoverStart={() => {
          if (!isAnimationPlaying && !state.enabled) {
            setAnimationPlaying(true)
            titleControls.start(titleVariants.whileHover)
            subtitleControls.start(subtitleVariants.whileHover)
          }
        }}
        onHoverEnd={() => {
          if (isAnimationPlaying && !state.enabled) {
            setAnimationPlaying(false)
            titleControls.start(titleVariants.default)
            subtitleControls.start(subtitleVariants.default)
          }
        }}
      >
        <button>
          <Icon
            icon="tabler:menu-2"
            className={cx(
              'absolute z-10 -ml-4 text-gray-500 group-hover:font-bold group-hover:text-white',
              !state.enabled && 'transition duration-200'
            )}
            width={30}
          />
        </button>
        <motion.h1
          variants={titleVariants}
          initial="initial"
          animate={titleControls}
          className={cx(
            'p-2 font-wide text-5xl font-black text-brand-default',
            !state.enabled && ' backdrop-blur-sm',
            !state.enabled &&
              css`
                overflow: hidden;
                background-image: linear-gradient(90deg, rgba(0, 189, 255, 0) 50%, rgba(0, 189, 255, 0.2) 100%);
                background-blend-mode: screen;

                &:before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 1536px; /* Image width (512px) times 3 */
                  height: 100%;
                  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%),
                    url('/effects/lcu_magic_3_horizontal.webp');
                  background-repeat: repeat;
                  background-position: center;
                  z-index: -1;
                  opacity: 0;
                  filter: hue-rotate(20deg);
                  mix-blend-mode: screen;

                  animation-name: slide-in-right, smoke-animation;
                  animation-duration: 0.5s, 8s;
                  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), linear;
                  animation-iteration-count: 1, infinite;
                  animation-delay: 1s, 1s;
                  animation-fill-mode: forwards, forwards;
                }

                &:after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 1536px; /* Image width (512px) times 3 */
                  height: 100%;
                  background-image: url('/effects/lcu_magic_5_horizontal.webp');
                  background-repeat: repeat;
                  background-position: center;
                  z-index: -2;
                  opacity: 0;
                  filter: hue-rotate(35deg) blur(2px);
                  mix-blend-mode: screen;

                  animation-name: slide-in-right, smoke-animation;
                  animation-duration: 0.5s, 5s;
                  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94), linear;
                  animation-iteration-count: 1, infinite;
                  animation-delay: 1s, 1s;
                  animation-fill-mode: forwards, forwards;
                }

                @keyframes slide-in-right {
                  0% {
                    -webkit-transform: translateX(1000px);
                    transform: translateX(1000px);
                    opacity: 0;
                  }
                  100% {
                    -webkit-transform: translateX(0);
                    transform: translateX(0);
                    opacity: 0.3;
                  }
                }

                @keyframes smoke-animation {
                  0% {
                    transform: translateX(0%);
                  }
                  100% {
                    transform: translateX(-512px);
                  }
                }
              `
          )}
        >
          {!state.enabled && (
            <video
              src="/effects/vfx-vertical-magic-loop.webm"
              loop
              autoPlay
              muted
              className={css`
                position: absolute;
                width: 100%;
                right: 0px;
                transform: rotate(90deg) translateX(-55%);
                filter: saturate(0);
                opacity: 0;
                z-index: -1;
                mix-blend-mode: screen;
                filter: hue-rotate(35deg);
                animation: slide-in-right 0.5 linear;
                animation-delay: 1s;
                animation-fill-mode: forwards;

                @keyframes slide-in-right {
                  0% {
                    opacity: 0;
                  }
                  100% {
                    opacity: 0.7;
                  }
                }
              `}
            />
          )}
          League Tools
        </motion.h1>
        <motion.h2
          variants={subtitleVariants}
          initial="initial"
          animate={subtitleControls}
          className={cx('text-md font-sans tracking-widest text-gray-400', !state.enabled && ' backdrop-blur-sm')}
        >
          ITEM BUILDS
        </motion.h2>
      </motion.div>
    </div>
  )
}

export default Header
