import abilityHasteIcon from 'public/icons/ability-haste.svg?url'
import abilityPowerIcon from 'public/icons/ability-power.svg?url'
import armorPenetrationIcon from 'public/icons/armor-penetration.svg?url'
import armorIcon from 'public/icons/armor.svg?url'
import attackDamageIcon from 'public/icons/attack-damage.svg?url'
import attackSpeedIcon from 'public/icons/attack-speed.svg?url'
import ccIcon from 'public/icons/cc.svg?url'
import AllClasses from 'public/icons/champion-class/all-classes.svg'
import Assassin from 'public/icons/champion-class/assassin.svg'
import Fighter from 'public/icons/champion-class/fighter.svg'
import Mage from 'public/icons/champion-class/mage.svg'
import Marksman from 'public/icons/champion-class/marksman.svg'
import Support from 'public/icons/champion-class/support.svg'
import Tank from 'public/icons/champion-class/tank.svg'
import clearFilters from 'public/icons/clear-filters.svg?url'
import consumableIcon from 'public/icons/consumable.svg?url'
import criticalStrikeChanceIcon from 'public/icons/critical-strike.svg?url'
import goldIcon from 'public/icons/gold.svg?url'
import healAndShieldPower from 'public/icons/heal-and-shield-power.svg?url'
import healthRegenerationIcon from 'public/icons/health-regeneration.svg?url'
import healthIcon from 'public/icons/health.svg?url'
import jungleIcon from 'public/icons/jungle.svg?url'
import lifeStealIcon from 'public/icons/life-steal.svg?url'
import magicPenetrationIcon from 'public/icons/magic-penetration.svg?url'
import magicResistIcon from 'public/icons/magic-resist.svg?url'
import manaRegenerationIcon from 'public/icons/mana-regeneration.svg?url'
import manaIcon from 'public/icons/mana.svg?url'
import midIcon from 'public/icons/mid.svg?url'
import movementSpeedIcon from 'public/icons/movement-speed.svg?url'
import omniVampIcon from 'public/icons/omni-vamp.svg?url'
import onHitIcon from 'public/icons/on-hit-effects.svg?url'
import tenacityIcon from 'public/icons/tenacity.svg?url'
import trinketIcon from 'public/icons/trinket.svg?url'
import { ClassFilter, TypeFilter } from 'types/FilterProps'
import { Category, ChampionClass } from 'types/Items'

export const ClassFilters: {
  [key in ChampionClass]: ClassFilter
} = {
  [ChampionClass.None]: {
    name: 'All Classes',
    icon: AllClasses,
  },
  [ChampionClass.Fighter]: {
    name: 'Fighter',
    icon: Fighter,
  },
  [ChampionClass.Marksman]: {
    name: 'Marksman',
    icon: Marksman,
  },
  [ChampionClass.Mage]: {
    name: 'Mage',
    icon: Mage,
  },
  [ChampionClass.Assassin]: {
    name: 'Assassin',
    icon: Assassin,
  },
  [ChampionClass.Tank]: {
    name: 'Tank',
    icon: Tank,
  },
  [ChampionClass.Support]: {
    name: 'Support',
    icon: Support,
  },
}

export enum ItemType {
  All = 'All',
  AttackDamage = 'AttackDamage',
  CritStrike = 'CritStrike',
  AttackSpeed = 'AttackSpeed',
  OnHit = 'OnHit',
  ArmorPenetration = 'ArmorPenetration',
  AbilityPower = 'AbilityPower',
  Mana = 'Mana',
  MagicPenetration = 'MagicPenetration',
  Health = 'Health',
  Armor = 'Armor',
  MagicResist = 'MagicResist',
  AbilityHaste = 'AbilityHaste',
  Movement = 'Movement',
  Lifesteal = 'Lifesteal',
  Trinket = 'Trinket',
  Lane = 'Lane',
  Jungle = 'Jungle',
  Tenacity = 'Tenacity',
  Consumable = 'Consumable',
  CC = 'CC',
}

export const TypeFilters: {
  [key in ItemType]: TypeFilter
} = {
  [ItemType.All]: {
    name: 'All Items',
    icon: clearFilters,
    categories: [Category.All],
  },
  [ItemType.AttackDamage]: {
    name: 'Attack Damage',
    icon: attackDamageIcon,
    categories: [Category.AttackDamage],
  },
  [ItemType.CritStrike]: {
    name: 'Critical Strike',
    icon: criticalStrikeChanceIcon,
    categories: [Category.CriticalStrike],
  },
  [ItemType.AttackSpeed]: {
    name: 'Attack Speed',
    icon: attackSpeedIcon,
    categories: [Category.AttackSpeed],
  },
  [ItemType.OnHit]: {
    name: 'On-Hit Effects',
    icon: onHitIcon,
    categories: [Category.OnHit],
  },
  [ItemType.ArmorPenetration]: {
    name: 'Armor Penetration',
    icon: armorPenetrationIcon,
    categories: [Category.ArmorPenetration],
  },
  [ItemType.AbilityPower]: {
    name: 'Ability Power',
    icon: abilityPowerIcon,
    categories: [Category.AbilityPower],
  },
  [ItemType.Mana]: {
    name: 'Mana & Regeneration',
    icon: manaIcon,
    categories: [Category.Mana, Category.ManaRegen],
  },
  [ItemType.MagicPenetration]: {
    name: 'Magic Penetration',
    icon: magicPenetrationIcon,
    categories: [Category.MagicPenetration],
  },
  [ItemType.Health]: {
    name: 'Health & Regeneration',
    icon: healthIcon,
    categories: [Category.Health, Category.HealthRegen],
  },
  [ItemType.Armor]: {
    name: 'Armor',
    icon: armorIcon,
    categories: [Category.Armor],
  },
  [ItemType.MagicResist]: {
    name: 'Magic Resistance',
    icon: magicResistIcon,
    categories: [Category.MagicResistance],
  },
  [ItemType.AbilityHaste]: {
    name: 'Ability Haste',
    icon: abilityHasteIcon,
    categories: [Category.AbilityHaste, Category.CooldownReduction],
  },
  [ItemType.Movement]: {
    name: 'Movement',
    icon: movementSpeedIcon,
    categories: [Category.Boots, Category.NonbootsMovement],
  },
  [ItemType.Lifesteal]: {
    name: 'Life Steal & Vamp',
    icon: omniVampIcon,
    categories: [Category.SpellVamp, Category.LifeSteal],
  },
  [ItemType.Trinket]: {
    name: 'Trinket',
    icon: trinketIcon,
    categories: [Category.Trinket, Category.Vision],
  },
  [ItemType.Lane]: {
    name: 'Lane',
    icon: midIcon,
    categories: [Category.Lane],
  },
  [ItemType.Jungle]: {
    name: 'Jungle',
    icon: jungleIcon,
    categories: [Category.Jungle],
  },
  [ItemType.Tenacity]: {
    name: 'Tenacity',
    icon: tenacityIcon,
    categories: [Category.Tenacity],
  },
  [ItemType.Consumable]: {
    name: 'Consumable',
    icon: consumableIcon,
    categories: [Category.Consumable],
  },
  [ItemType.CC]: {
    name: 'Crowd Control',
    icon: ccIcon,
    categories: [Category.Slow],
  },
}
