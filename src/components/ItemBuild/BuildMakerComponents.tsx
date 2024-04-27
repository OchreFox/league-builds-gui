import styled from '@emotion/styled'
import { average, prominent } from 'color.js'
import { Variants, motion } from 'framer-motion'
import tinycolor from 'tinycolor2'
import { AdditionalChampionProps } from '@/types/Champions'

import { easeInOutExpo } from '@/utils/Transition'

export const getChampionSplash = async (championId: number): Promise<AdditionalChampionProps> => {
  if (championId <= 0) {
    return {
      splash: '',
      colors: [],
    }
  }
  const baseUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes'
  const championSplash = `${baseUrl}/${championId}/${championId}000.jpg`
  let response: AdditionalChampionProps = {
    splash: championSplash,
    colors: [],
  }

  await average(championSplash, { format: 'hex' })
    .then((color) => {
      let color2 = tinycolor(color as string)
      // If the color is dark, make it light
      if (color2.isDark()) {
        color2.lighten(50)
      }
      response.colors.push(color2.toHexString())
    })
    .catch((err) => {
      console.error(err)
    })

  await prominent(championSplash, { amount: 3, format: 'hex' })
    .then((colors) => {
      for (let color of colors) {
        let color2 = tinycolor(color as string)
        // If the color is dark, make it light
        if (color2.isDark()) {
          color2.lighten(50)
        }
        response.colors.push(color2.toHexString())
      }
    })
    .catch((err) => {
      console.error(err)
    })

  return response
}

export const ChampionPickerHover = styled(motion.div)`
  background: radial-gradient(circle, rgba(0, 0, 0, 0.5) 60%, rgba(128, 128, 255, 0.1) 100%);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1536px; /* Image width (512px) times 3 */
    height: 100%;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%),
      url('https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/effects/lcu_magic_3_horizontal.webp');
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
    animation-fill-mode: forwards, forwards;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1536px; /* Image width (512px) times 3 */
    height: 100%;
    background-image: url('https://cdn.jsdelivr.net/gh/OchreFox/league-custom-ddragon@main/data/league-builds/effects/lcu_magic_5_horizontal.webp');
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
export const easeOutExpo = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.8,
}

export const championCardVariants: Variants = {
  initial: {
    backgroundPosition: '0% 100%',
  },
  animate: {
    backgroundPosition: '0% 26%',
  },
}

export const titleHoverVariants: Variants = {
  default: {
    x: 0,
    y: 0,
  },
  hover: {
    y: '-150%',
  },
  click: {
    y: '-150%',
  },
  loading: {
    y: '-150%',
  },
}

export const descriptionHoverVariants: Variants = {
  default: {
    x: 0,
    y: '100%',
  },
  hover: {
    y: '0%',
  },
  click: {
    y: '-100%',
  },
  loading: {
    y: '-100%',
  },
}

export const championPickerVariants: Variants = {
  default: {
    y: '100%',
  },
  hover: {
    y: '100%',
  },
  click: {
    y: '0%',
  },
  loading: {
    y: '0%',
  },
}

export const championPickerBackgroundVariants: Variants = {
  default: {
    y: '50%',
    opacity: 0,
    scaleX: 1.2,
    scaleY: 1.2,
  },
  hover: {
    y: '50%',
    opacity: 0,
    scaleX: 1.2,
    scaleY: 1.2,
  },
  click: {
    y: 0,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
  },
  loading: {
    y: 0,
    opacity: 1,
    scaleX: 0.95,
    scaleY: 0.9,
  },
}

export const championNameVariants: Variants = {
  initial: {
    x: '-100%',
  },
  animate: {
    x: 0,
  },
}

export const championTitleVariants: Variants = {
  initial: {
    x: '-100%',
  },
  animate: {
    x: 0,
    transition: { ...easeInOutExpo, delay: 0.1 },
  },
}
