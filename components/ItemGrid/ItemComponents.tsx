import { css, cx } from '@emotion/css'
import styled from '@emotion/styled'
import { Placement } from '@floating-ui/react-dom-interactions'
import { Icon } from '@iconify/react'
import { Variants, motion } from 'framer-motion'
import abilityPowerIcon from 'public/icons/ability-power.svg?url'
import attackDamageIcon from 'public/icons/attack-damage.svg?url'
import healthRegenIcon from 'public/icons/health-regeneration.svg?url'
import manaRegenIcon from 'public/icons/mana-regeneration.svg?url'
import trueDamageIcon from 'public/icons/true-damage.svg?url'
import React from 'react'
import { CSSProperty, ItemsSchema } from 'types/Items'

import { statProperties } from './StatProperties'

function disableAnimations(propertyType: CSSProperty) {
  switch (propertyType) {
    case CSSProperty.OPACITY:
      return `1;`
    case CSSProperty.TRANSFORM:
    case CSSProperty.ANIMATION:
    case CSSProperty.TRANSITION_PROPERTY:
      return `none;`
  }
}

export const itemButtonClass = (
  item: ItemsSchema,
  hoveredItem: number | null,
  isSelected: boolean,
  potatoMode: boolean
) => {
  return cx(
    'group -m-1 flex flex-col items-center px-2 py-2 text-center relative transition-colors duration-200 ease-in-out bg-transparent hover:bg-white/25',
    item.id === hoveredItem &&
      cx(
        'z-10 hover:bg-gray-800 ring-2 ring-cyan-50',
        css`
          box-shadow: 0 0 25px 3px rgba(250, 204, 21, 0.5), 0 0 30px 5px rgba(207, 250, 254, 0.5),
            inset 0 0 0 1px rgba(161, 98, 7, 1);
        `
      ),
    css`
      border: 2px solid rgba(0, 0, 0, 0);
    `,
    isSelected &&
      css`
        &:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(204, 41, 54, 0.75) 50%, rgba(0, 0, 0, 0) 100%);
          background-size: 600% 600%;

          animation: ${potatoMode ? disableAnimations(CSSProperty.ANIMATION) : 'scroll 10s linear infinite;'} @keyframes
            scroll {
            0% {
              background-position: 50% 0%;
            }
            100% {
              background-position: 50% -600%;
            }
          }
        }

        border: 2px solid;
        box-sizing: content-box;
        @supports (background: paint(something)) {
          border-image: linear-gradient(var(--angle), #12c2e9, #b9f5ff, #c471ed, #14fff5, #f64f59) 1;
          animation: 6s rotate linear infinite forwards;
          @keyframes rotate {
            to {
              --angle: 360deg;
            }
          }
          @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
        }
        /* Rotate the gradient */
        --angle: 0deg;
        border-image: linear-gradient(var(--angle), #12c2e9, #b9f5ff, #c471ed, #14fff5, #f64f59) 1;
        animation: ${potatoMode ? disableAnimations(CSSProperty.ANIMATION) : '6s rotate linear infinite forwards;'}
          @keyframes rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }

        &:after {
          /* Create a pulsing border that scales out from the center */
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 10;
          border: 2px solid rgba(255, 255, 255, 1);
          opacity: 0;
          animation: ${potatoMode
            ? disableAnimations(CSSProperty.ANIMATION)
            : 'pulse-out 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;'};

          @keyframes pulse-out {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            33% {
              transform: scale(1.4);
              opacity: 0;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        }
      `
  )
}

export const mythicOverlayClass = (isMythic: boolean) => {
  return isMythic
    ? cx(
        'relative inline-flex shrink-0 items-center justify-center border border-yellow-700',
        css`
          background: linear-gradient(
            180deg,
            rgba(234, 179, 8, 1) 0%,
            rgba(161, 98, 7, 1) 50%,
            rgba(205, 46, 52, 1) 100%
          );
          background-size: 400% 400%;
          animation: Glow 3s ease infinite;
          padding: 2px;
          @keyframes Glow {
            0% {
              background-position: 50% 0%;
            }
            50% {
              background-position: 50% 100%;
            }
            100% {
              background-position: 50% 0%;
            }
          }
        `
      )
    : ''
}

// Item Name Tooltip
export const ItemNameTooltipVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

export const itemTooltipClass = (
  placement: Placement,
  arrowX: number | undefined,
  arrowY: number | undefined,
  potatoMode: boolean,
  isSelected: boolean
) => {
  return cx(
    isSelected ? 'bg-yellow-700/50' : 'bg-slate-700/50',
    css`
      position: absolute;
      z-index: 1;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      left: ${arrowX !== undefined ? `${arrowX}px` : '0'};
      top: ${arrowY !== undefined ? `${arrowY}px` : ''};
    `,
    placement === 'top' &&
      css`
        --tw-border-opacity: 1;
        --border-color: rgb(161 98 7 / var(--tw-border-opacity));
        border-bottom: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        border-top: none;
        border-left: none;
        clip-path: polygon(100% 100%, 0 100%, 100% 0);
      `,
    placement === 'bottom' &&
      css`
        bottom: 28px;
        --tw-border-opacity: 1;
        --border-color: rgb(161 98 7 / var(--tw-border-opacity));
        border-top: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
        clip-path: polygon(0 0, 0 100%, 100% 0);
      `,
    !potatoMode && 'backdrop-blur-[5px]'
  )
}

// Description tooltip popper element
export const Tooltip = styled(motion.div)`
  border-radius: 0.25rem;
  width: 24rem;
  z-index: 20;
  --parent-padding: 10px;
  --tw-bg-opacity: 0.5;
  --border-color: rgb(221 122 57 / var(--tw-border-opacity));
  padding: var(--parent-padding);
  border: 1px solid var(--border-color);

  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      content: ' ';
      background-color: rgb(9 22 27 / var(--tw-bg-opacity));
      position: absolute;
      top: calc((5px + var(--parent-padding)) * -1);
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
      border-top: 1px solid var(--border-color);
      border-left: 1px solid var(--border-color);
      clip-path: polygon(0 0, 0% 100%, 100% 0);
    }
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: calc((10px + var(--parent-padding)) * -1);
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      border-top: none;
      border-left: none;
      clip-path: polygon(0 100%, 100% 100%, 100% 0);
    }
  }
  &[data-popper-placement^='left'] > #arrow {
    right: calc(5px + var(--parent-padding) * -1);
    :after {
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      border-top: none;
      border-left: none;
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      transform: rotate(-45deg);
    }
  }
`

export const setPopperBg = (enabled: boolean) => {
  if (enabled) {
    return css`
      background: rgb(9, 22, 27);
    `
  } else if (!CSS.supports('backdrop-filter', 'blur(2px)')) {
    return css`
      background: linear-gradient(180deg, rgba(221, 122, 57, 0.1) 0%, rgba(9, 22, 27, 0.9) 30%);
    `
  } else {
    return css`
      background: linear-gradient(180deg, rgba(221, 122, 57, 0.1) 0%, rgba(9, 22, 27, 0.5) 30%);
      filter: drop-shadow(0px 2.8px 2.2px rgba(0, 0, 0, 0.042)) drop-shadow(0px 6.7px 5.3px rgba(0, 0, 0, 0.061))
        drop-shadow(0px 12.5px 10px rgba(0, 0, 0, 0.075)) drop-shadow(0px 22.3px 17.9px rgba(0, 0, 0, 0.089))
        drop-shadow(0px 41.8px 33.4px rgba(0, 0, 0, 0.108)) drop-shadow(0px 100px 80px rgba(0, 0, 0, 0.15));
    `
  }
}

export const MainText = ({ children }: any) => {
  return (
    <div
      className={cx(
        'mt-2 font-sans text-sm text-gray-300',
        css`
          & > li {
            margin-right: 1rem;
          }
        `
      )}
    >
      {children}
    </div>
  )
}
export const Stats = ({ children }: any) => {
  return (
    <table
      className={cx(
        'flex table-auto font-sans text-gray-300',
        children !== undefined && 'mb-2 border-b border-yellow-900 pb-2',
        css`
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }
        `
      )}
    >
      <tbody>{children}</tbody>
    </table>
  )
}
export const StatIcon = ({ src, alt }: { src: any; alt: string }) => {
  return <img className="mr-1 inline-flex h-3 w-3" src={src} alt={alt} width={12} height={12} />
}
export const Stat = ({ children = [], name }: any) => {
  const stat =
    statProperties.find((statChildren) => {
      return new RegExp(`${statChildren.pattern}$`).test(name)
    }) ?? null

  if (!stat) {
    return null
  }
  return (
    <tr className="table-auto">
      <td className="align-baseline">
        <StatIcon src={stat.imgSource} alt={stat.statName} />
      </td>
      <td className="align-baseline">
        <span className="font-sans font-bold text-yellow-600">{children}</span>
      </td>
      <td className="pl-2 align-baseline">{stat.statName}</td>
    </tr>
  )
}
export const Attention = ({ children }: any) => {
  return <span className="mr-1 font-sans font-bold text-yellow-600">{children}</span>
}
export const Active = ({ children }: any) => {
  return <span className="font-sans font-bold text-yellow-200">{children}</span>
}
export const Passive = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-200">{children}</span>
}
export const RarityGeneric = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-200">{children}</span>
}
export const RarityLegendary = ({ children }: any) => {
  return <span className="font-sans font-bold text-red-400">{children}</span>
}
export const RarityMythic = ({ children }: any) => {
  return (
    <>
      <br />
      <span className="font-sans font-bold text-orange-600">{children}</span>
    </>
  )
}
export const ScaleLevel = ({ children }: any) => {
  return <span className="font-sans font-semibold text-cyan-400">{children}</span>
}
export const KeywordStealth = ({ children }: any) => {
  const invisibleKeywords = ['Invisible', 'Invisibility', 'Camouflage']
  const isInvisible = invisibleKeywords.some((keyword) => String(children.props.children).includes(keyword))
  return (
    <span className="mr-1 inline-flex flex-row items-baseline font-sans font-bold text-gray-300">
      {/* <StatIcon src={stealthIcon} alt="stealth" /> */}
      <Icon
        icon={`heroicons-solid:eye${isInvisible ? '-off' : ''}`}
        inline={true}
        className="mr-1"
        width={12}
        height={12}
      />
      {children}
    </span>
  )
}
export const Rules = ({ children }: any) => {
  return <div className="font-sans italic text-gray-500">{children} </div>
}
// Health regeneration
export const Healing = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-green-400">
      <StatIcon src={healthRegenIcon} alt="health-regeneration" />
      {children}{' '}
    </div>
  )
}
// Mana Regeneration
export const ScaleMana = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-blue-400">
      <StatIcon src={manaRegenIcon} alt="mana-regeneration" />
      {children}{' '}
    </div>
  )
}
// Magic damage
export const MagicDamage = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre-wrap font-sans font-bold text-blue-400">
      <StatIcon src={abilityPowerIcon} alt="magic-damage" />
      {children}{' '}
    </div>
  )
}
// Physical damage
export const PhysicalDamage = ({ children }: any) => {
  return (
    <span className="inline-flex items-baseline whitespace-pre-wrap font-sans font-bold text-red-400">
      <StatIcon src={attackDamageIcon} alt="attack-damage" />
      {children}{' '}
    </span>
  )
}
// True damage
export const TrueDamage = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-orange-200">
      <StatIcon src={trueDamageIcon} alt="true-damage" />
      {children}{' '}
    </div>
  )
}
export const FlavorText = ({ children }: any) => {
  return <div className="font-sans italic text-gray-500">{children} </div>
}
// Status effects
export const Status = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-500"> {children} </span>
}
