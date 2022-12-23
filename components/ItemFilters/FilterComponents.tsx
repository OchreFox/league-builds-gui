import AllClasses from 'public/icons/champion-class/all-classes.svg'
import Assassin from 'public/icons/champion-class/assassin.svg'
import Fighter from 'public/icons/champion-class/fighter.svg'
import Mage from 'public/icons/champion-class/mage.svg'
import Marksman from 'public/icons/champion-class/marksman.svg'
import Support from 'public/icons/champion-class/support.svg'
import Tank from 'public/icons/champion-class/tank.svg'
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
    icon: 'clear-filters.svg',
    categories: [Category.All],
  },
  [ItemType.AttackDamage]: {
    name: 'Attack Damage',
    icon: 'attack-damage.svg',
    categories: [Category.AttackDamage],
  },
  [ItemType.CritStrike]: {
    name: 'Critical Strike',
    icon: 'critical-strike.svg',
    categories: [Category.CriticalStrike],
  },
  [ItemType.AttackSpeed]: {
    name: 'Attack Speed',
    icon: 'attack-speed.svg',
    categories: [Category.AttackSpeed],
  },
  [ItemType.OnHit]: {
    name: 'On-Hit Effects',
    icon: 'on-hit-effects.svg',
    categories: [Category.OnHit],
  },
  [ItemType.ArmorPenetration]: {
    name: 'Armor Penetration',
    icon: 'armor-penetration.svg',
    categories: [Category.ArmorPenetration],
  },
  [ItemType.AbilityPower]: {
    name: 'Ability Power',
    icon: 'ability-power.svg',
    categories: [Category.AbilityPower],
  },
  [ItemType.Mana]: {
    name: 'Mana & Regeneration',
    icon: 'mana.svg',
    categories: [Category.Mana, Category.ManaRegen],
  },
  [ItemType.MagicPenetration]: {
    name: 'Magic Penetration',
    icon: 'magic-penetration.svg',
    categories: [Category.MagicPenetration],
  },
  [ItemType.Health]: {
    name: 'Health & Regeneration',
    icon: 'health.svg',
    categories: [Category.Health, Category.HealthRegen],
  },
  [ItemType.Armor]: {
    name: 'Armor',
    icon: 'armor.svg',
    categories: [Category.Armor],
  },
  [ItemType.MagicResist]: {
    name: 'Magic Resistance',
    icon: 'magic-resist.svg',
    categories: [Category.MagicResistance],
  },
  [ItemType.AbilityHaste]: {
    name: 'Ability Haste',
    icon: 'ability-haste.svg',
    categories: [Category.AbilityHaste, Category.CooldownReduction],
  },
  [ItemType.Movement]: {
    name: 'Movement',
    icon: 'movement-speed.svg',
    categories: [Category.Boots, Category.NonbootsMovement],
  },
  [ItemType.Lifesteal]: {
    name: 'Life Steal & Vamp',
    icon: 'omni-vamp.svg',
    categories: [Category.SpellVamp, Category.LifeSteal],
  },
  [ItemType.Trinket]: {
    name: 'Trinket',
    icon: 'trinket.svg',
    categories: [Category.Trinket, Category.Vision],
  },
  [ItemType.Lane]: {
    name: 'Lane',
    icon: 'mid.svg',
    categories: [Category.Lane],
  },
  [ItemType.Jungle]: {
    name: 'Jungle',
    icon: 'jungle.svg',
    categories: [Category.Jungle],
  },
  [ItemType.Tenacity]: {
    name: 'Tenacity',
    icon: 'tenacity.svg',
    categories: [Category.Tenacity],
  },
  [ItemType.Consumable]: {
    name: 'Consumable',
    icon: 'consumable.svg',
    categories: [Category.Consumable],
  },
  [ItemType.CC]: {
    name: 'Crowd Control',
    icon: 'cc.svg',
    categories: [Category.Slow],
  },
}
