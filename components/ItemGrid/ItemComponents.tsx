import Image from 'next/image'

import React from 'react'

import { css, cx } from '@emotion/css'
import { Icon } from '@iconify/react'
import { Variants } from 'framer-motion'
import abilityPowerIcon from 'public/icons/ability-power.svg?url'
import attackDamageIcon from 'public/icons/attack-damage.svg?url'
import healthRegenIcon from 'public/icons/health-regeneration.svg?url'
import manaRegenIcon from 'public/icons/mana-regeneration.svg?url'
import trueDamageIcon from 'public/icons/true-damage.svg?url'

import { statProperties } from '@/components/ItemGrid/StatProperties'

// Item Name Tooltip
export const ItemNameTooltipVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

export const MainText = ({ children }: any) => {
  return <div className="mt-2 list-inside font-sans text-sm text-gray-300">{children}</div>
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
  return <Image className="mr-1 inline-flex h-3 w-3" src={src} alt={alt} width={12} height={12} unoptimized />
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
