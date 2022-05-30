import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StandardItemState } from '../types/FilterProps'
import { usePopper } from 'react-popper'
import { css, cx } from '@emotion/css'
import JsxParser from 'react-jsx-parser'
import ReactDOM from 'react-dom'

const statProperties = [
  {
    pattern: 'Movespeed',
    statName: 'Movement Speed',
    imgSource: 'icons/movement-speed.svg',
  },
  {
    pattern: 'Health',
    statName: 'Health',
    imgSource: 'icons/health.svg',
  },
  {
    pattern: 'CriticalStrikeChance',
    statName: 'Critical Strike Chance',
    imgSource: 'icons/critical-strike.svg',
  },
  {
    pattern: 'AbilityPower',
    statName: 'Ability Power',
    imgSource: 'icons/ability-power.svg',
  },
  {
    pattern: 'AttackDamage',
    statName: 'Attack Damage',
    imgSource: 'icons/attack-damage.svg',
  },
  {
    pattern: 'Mana',
    statName: 'Mana',
    imgSource: 'icons/mana.svg',
  },
  {
    pattern: 'ManaRegen',
    statName: 'Mana Regen',
    imgSource: 'icons/mana-regeneration.webp',
  },
  {
    pattern: 'Armor',
    statName: 'Armor',
    imgSource: 'icons/armor.svg',
  },
  {
    pattern: 'ArmorPenetration',
    statName: 'Armor Penetration',
    imgSource: 'icons/armor-penetration.svg',
  },
  {
    pattern: 'MagicResistance',
    statName: 'Magic Resist',
    imgSource: 'icons/magic-resist.svg',
  },
  {
    pattern: 'AttackSpeed',
    statName: 'Attack Speed',
    imgSource: 'icons/attack-speed.svg',
  },
  {
    pattern: 'HealthRegen',
    statName: 'Health Regeneration',
    imgSource: 'icons/health-regeneration.svg',
  },
  {
    pattern: 'AbilityHaste',
    statName: 'Ability Haste',
    imgSource: 'icons/ability-haste.svg',
  },
  {
    pattern: 'Lifesteal',
    statName: 'Life Steal',
    imgSource: 'icons/life-steal.svg',
  },
  {
    pattern: 'Omnivamp',
    statName: 'Omnivamp',
    imgSource: 'icons/omni-vamp.svg',
  },
  {
    pattern: 'HealAndShieldPower',
    statName: 'Heal and Shield Power',
    imgSource: 'icons/heal-and-shield-power.svg',
  },
  {
    pattern: 'Lethality',
    statName: 'Lethality',
    imgSource: 'icons/armor-penetration.svg',
  },
  {
    pattern: 'Tenacity',
    statName: 'Tenacity',
    imgSource: 'icons/tenacity.svg',
  },
  {
    pattern: 'GoldPer10',
    statName: 'Gold Per 10 seconds',
    imgSource: 'icons/gold.svg',
  },
]

export const StandardItem = ({
  item,
  transition,
  hoveredItem,
  setHoveredItem,
  isMythic,
}: StandardItemState) => {
  if (!item.icon) {
    console.warn('No src for item:', item.name)
    return null
  }
  if (!item.visible) {
    return null
  }
  const [showPopper, setShowPopper] = useState(false)
  const buttonRef = useRef(null)
  const popperRef = useRef(null)
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      placement: 'bottom',
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowRef,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  )
  useEffect(() => {
    if (showPopper) {
      const timer = setTimeout(() => {
        setHoveredItem(item.id)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setHoveredItem(null)
    }
  }, [showPopper])

  return (
    <>
      <div className="relative">
        <motion.div
          layout
          transition={transition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={item.id}
          className="mb-2 flex cursor-pointer flex-col text-center"
          ref={buttonRef}
          onMouseEnter={() => {
            setShowPopper(true)
          }}
          onMouseLeave={() => {
            setShowPopper(false)
          }}
        >
          <div
            className={
              isMythic
                ? cx(
                    'relative flex items-center justify-center border border-yellow-700',
                    css`
                      background: radial-gradient(#eab308, #a16207);
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
                    `,
                    hoveredItem !== null &&
                      item.id !== hoveredItem &&
                      css`
                        opacity: 0.5;
                        filter: grayscale(50%);
                      `,
                    'transition duration-100'
                  )
                : ''
            }
          >
            {/* Display the item icon */}
            <img
              src={item.icon ?? ''}
              alt={item.name ?? ''}
              className={cx(
                'border border-black object-cover ring-1 ring-yellow-700 transition duration-100 hover:z-30 hover:ring-2 hover:brightness-125',
                !isMythic &&
                  hoveredItem !== null &&
                  item.id !== hoveredItem &&
                  css`
                    opacity: 0.5;
                    filter: grayscale(50%);
                  `
              )}
              width={50}
              height={50}
            />
          </div>
          <p
            className={cx(
              'font-sans text-gray-200',
              hoveredItem !== null &&
                item.id !== hoveredItem &&
                css`
                  opacity: 0.5;
                `
            )}
          >
            {item.gold?.total}
          </p>
        </motion.div>
        {showPopper
          ? ReactDOM.createPortal(
              <motion.div
                ref={popperRef}
                style={styles.popper}
                {...attributes.popper}
                transition={{ duration: 0.2, delay: 0.5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={'popper-' + item.id}
                className={cx(
                  'z-20 w-96 rounded backdrop-blur-md',
                  css`
                    filter: drop-shadow(0px 2.8px 2.2px rgba(0, 0, 0, 0.042))
                      drop-shadow(0px 6.7px 5.3px rgba(0, 0, 0, 0.061))
                      drop-shadow(0px 12.5px 10px rgba(0, 0, 0, 0.075))
                      drop-shadow(0px 22.3px 17.9px rgba(0, 0, 0, 0.089))
                      drop-shadow(0px 41.8px 33.4px rgba(0, 0, 0, 0.108))
                      drop-shadow(0px 100px 80px rgba(0, 0, 0, 0.15));

                    --parent-padding: 10px;
                    --tw-bg-opacity: 0.5;
                    --border-color: rgb(221 122 57 / var(--tw-border-opacity));
                    padding: var(--parent-padding);
                    background: linear-gradient(
                      180deg,
                      rgba(221, 122, 57, 0.2) 0%,
                      rgba(9, 22, 27, 0.5) 30%
                    );
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
                )}
              >
                <div
                  ref={setArrowRef}
                  style={styles.arrow}
                  id="arrow"
                  key={'arrow-' + item.id}
                />
                {/* Item information */}
                <div
                  className="flex flex-col"
                  key={'popper-content-' + item.id}
                >
                  <div className="flex justify-between border-b border-yellow-900 pb-1">
                    <h3 className="font-body font-semibold text-gray-200">
                      {item.name}
                    </h3>
                    <p className="inline-flex items-center font-sans text-yellow-600">
                      <img
                        src="icons/gold.svg"
                        alt="gold"
                        className="mr-1 h-5 w-5"
                      />
                      {item.gold?.total}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {item.description && (
                      <JsxParser
                        // autoCloseVoidElements
                        bindings={{
                          item: item,
                        }}
                        components={{
                          Active,
                          Attention,
                          FlavorText,
                          Healing,
                          KeywordStealth,
                          MagicDamage,
                          MainText,
                          Passive,
                          PhysicalDamage,
                          RarityGeneric,
                          RarityLegendary,
                          RarityMythic,
                          Rules,
                          ScaleLevel,
                          ScaleMana,
                          Status,
                          TrueDamage,
                          Stats,
                          Stat,
                        }}
                        jsx={item.description}
                        showWarnings={true}
                      />
                    )}
                  </div>
                </div>
              </motion.div>,
              document.querySelector('#item-container') as HTMLElement
            )
          : null}
      </div>
    </>
  )
}

const MainText = ({ children }: any) => {
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
const Stats = ({ children }: any) => {
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

const Stat = ({ children = [], name }: any) => {
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
        <img
          className="mr-1 h-3 w-3"
          src={stat.imgSource}
          alt={stat.statName}
        />
      </td>
      <td>
        <span className="font-sans font-bold text-yellow-600">{children}</span>
      </td>
      <td className="pl-2">{stat.statName}</td>
    </tr>
  )
}

const Attention = ({ children }: any) => {
  return (
    <span className="mr-1 font-sans font-bold text-yellow-600">{children}</span>
  )
}

const Active = ({ children }: any) => {
  return <span className="font-sans font-bold text-yellow-200">{children}</span>
}

const Passive = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-200">{children}</span>
}

const RarityGeneric = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-200">{children}</span>
}

const RarityLegendary = ({ children }: any) => {
  return <span className="font-sans font-bold text-red-400">{children}</span>
}

const RarityMythic = ({ children }: any) => {
  return (
    <>
      <br />
      <span className="font-sans font-bold text-orange-600">{children}</span>
    </>
  )
}

const ScaleLevel = ({ children }: any) => {
  return (
    <span className="font-sans font-semibold text-cyan-400">{children}</span>
  )
}

const KeywordStealth = ({ children }: any) => {
  return (
    <span className="inline-flex flex-row items-baseline font-sans font-bold text-gray-300">
      <img src="icons/blind.png" alt="stealth" className="mr-1 h-3 w-3" />
      {children}{' '}
    </span>
  )
}

const Rules = ({ children }: any) => {
  return <div className="font-sans italic text-gray-500">{children} </div>
}

// Health regeneration
const Healing = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-green-400">
      <img
        src="icons/health-regeneration.webp"
        alt="health-regeneration"
        className="mx-1 h-3 w-3"
      />
      {children}{' '}
    </div>
  )
}

// Mana Regeneration
const ScaleMana = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-blue-400">
      <img
        src="icons/mana-regeneration.webp"
        alt="mana-regeneration"
        className="mx-1 h-3 w-3"
      />
      {children}{' '}
    </div>
  )
}

// Magic damage
const MagicDamage = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre-wrap font-sans font-bold text-blue-400">
      <img
        src="icons/ability-power.svg"
        alt="magic-damage"
        className="mx-1 h-3 w-3"
      />
      {children}{' '}
    </div>
  )
}

// Physical damage
const PhysicalDamage = ({ children }: any) => {
  return (
    <span className="inline-flex items-baseline whitespace-pre-wrap font-sans font-bold text-red-400">
      <img
        src="icons/attack-damage.svg"
        alt="attack-damage"
        className="mx-1 h-3 w-3"
      />
      {children}{' '}
    </span>
  )
}

// True damage
const TrueDamage = ({ children }: any) => {
  return (
    <div className="inline-flex flex-row items-baseline whitespace-pre font-sans font-bold text-orange-200">
      <img
        src="icons/true-damage.webp"
        alt="true-damage"
        className="mr-1 h-3 w-3"
      />
      {children}{' '}
    </div>
  )
}

const FlavorText = ({ children }: any) => {
  return <div className="font-sans italic text-gray-500">{children} </div>
}

// Status effects
const Status = ({ children }: any) => {
  return <span className="font-sans font-bold text-gray-500"> {children} </span>
}
