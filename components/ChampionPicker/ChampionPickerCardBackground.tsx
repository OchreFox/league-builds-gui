import { selectChampionPicker, selectSelectedChampions } from '@/store/appSlice'
import { selectPotatoMode } from '@/store/potatoModeSlice'
import { css } from '@emotion/css'
import { AnimatePresence, Variants, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Champion } from 'types/Champions'

import { easeOutExpo } from 'components/ItemBuild/BuildMakerComponents'

import styles from './ChampionPickerCardBackground.module.scss'

const ChampionImage = ({
  image,
  index,
  length,
  mousePosition,
}: {
  image: string
  index: number
  length: number
  mousePosition: { x: number; y: number }
}) => {
  const maxLength = length >= 5 ? 3 : length - 1
  const championPicker = useSelector(selectChampionPicker)
  const [isHovered, setIsHovered] = useState(false)
  // Smoothly transition the drop shadow using framer motion's useMotionTemplate and useMotionValue
  const springConfig = {
    stiffness: 500,
    damping: 50,
  }
  const blur = useSpring(5, springConfig)
  const x = useMotionValue(0)
  const dropShadow = useMotionTemplate`drop-shadow(${x}px 0px ${blur}px rgba(0, 0, 0, 0.5))`

  // Update the x and y values based on the mouse position, and the blur value when hovering over the image
  useEffect(() => {
    if (isHovered) {
      blur.set(10)
      x.set(mousePosition.x * -20)
    } else {
      blur.set(5)
      x.set(0)
    }
  }, [isHovered, mousePosition.x, x])

  const getClipPath = () => {
    if (length === 1) {
      return 'none'
    } else {
      return `polygon(
        ${index === 0 ? '0 0' : '15% 0'},
        100% 0,
        ${index === maxLength ? '100% 100%' : '85% 100%'},
        0 100%
      )`
    }
  }

  const wrapperVariants: Variants = {
    initial: {
      marginLeft: `${index === 0 ? '0%' : '-4rem'}`,
      marginRight: `${index === maxLength ? '0%' : '-4rem'}`,
    },
    hover: {
      marginLeft: `${index === 0 ? '0%' : '-8rem'}`,
      marginRight: `${index === maxLength ? '0%' : '2rem'}`,
    },
  }

  const imageVariants = {
    // Increase the scale of the image when hovering
    initial: {
      backgroundSize: '100%',
      filter: 'grayscale(0.3)',
    },
    hover: {
      backgroundSize: length === 1 ? '100%' : '110%',
      filter: 'grayscale(0)',
    },
  }

  // Expand the clip-path on hover
  return (
    <motion.div
      key={image}
      className="w-full h-full"
      variants={wrapperVariants}
      initial="initial"
      whileHover="hover"
      transition={easeOutExpo}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: dropShadow,
      }}
    >
      <motion.div
        className={styles.image}
        style={{
          backgroundImage: `url(${image})`,
          clipPath: getClipPath(),
          transform: championPicker.hover ? `translateX(${mousePosition.x * 20 - 10}px)` : '',
          transition: championPicker.hover ? '' : 'transform 0.5s ease',
        }}
        variants={imageVariants}
        initial="initial"
        whileHover="hover"
        transition={easeOutExpo}
      />
    </motion.div>
  )
}

const ChampionPickerCardBackground = () => {
  const selectedChampions = useSelector(selectSelectedChampions)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const potatoMode = useSelector(selectPotatoMode)

  const handleMouseMove = (e: React.MouseEvent) => {
    // Do a horizontal parallax effect
    // Reset the position if the mouse leaves the element
    if (ref.current) {
      const { left, width } = ref.current.getBoundingClientRect()
      const x = (e.clientX - left) / width
      setMousePosition({ x, y: 0 })
    }
  }

  return (
    <div ref={ref} className={styles.container} onMouseMove={handleMouseMove}>
      {selectedChampions && selectedChampions.length > 0
        ? selectedChampions.map(
            (champion, index) =>
              index <= 3 && (
                <ChampionImage
                  key={index}
                  image={champion.splash ?? ''}
                  index={index}
                  length={selectedChampions.length}
                  mousePosition={mousePosition}
                />
              )
          )
        : !potatoMode && (
            <video src="/effects/vfx-vertical-magic-loop.webm" loop autoPlay muted className={styles.videobg} />
          )}
    </div>
  )
}

export default ChampionPickerCardBackground
