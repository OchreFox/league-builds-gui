import { css, cx } from '@emotion/css'
import styled from '@emotion/styled'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React, { SVGProps } from 'react'

import abilityPowerIcon from '../public/icons/ability-power.svg?url'
import attackDamageIcon from '../public/icons/attack-damage.svg?url'
import healthRegenIcon from '../public/icons/health-regeneration.svg?url'
import manaRegenIcon from '../public/icons/mana-regeneration.svg?url'
import trueDamageIcon from '../public/icons/true-damage.svg?url'
import { statProperties } from './StatProperties'

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
      <td>
        <StatIcon src={stat.imgSource} alt={stat.statName} />
      </td>
      <td>
        <span className="font-sans font-bold text-yellow-600">{children}</span>
      </td>
      <td className="pl-2">{stat.statName}</td>
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
