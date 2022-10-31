import AllClasses from 'public/icons/champion-class/all-classes.svg'
import Assassin from 'public/icons/champion-class/assassin.svg'
import Fighter from 'public/icons/champion-class/fighter.svg'
import Mage from 'public/icons/champion-class/mage.svg'
import Marksman from 'public/icons/champion-class/marksman.svg'
import Support from 'public/icons/champion-class/support.svg'
import Tank from 'public/icons/champion-class/tank.svg'
import { ClassFilter } from 'types/FilterProps'
import { Category, ChampionClass } from 'types/Items'

export const defaultClassFilters: ClassFilter[] = [
  {
    name: 'All Classes',
    isActive: true,
    icon: AllClasses,
    class: ChampionClass.None,
  },
  {
    name: 'Fighter',
    isActive: false,
    icon: Fighter,
    class: ChampionClass.Fighter,
  },
  {
    name: 'Marksman',
    isActive: false,
    icon: Marksman,
    class: ChampionClass.Marksman,
  },
  {
    name: 'Mage',
    isActive: false,
    icon: Mage,
    class: ChampionClass.Mage,
  },
  {
    name: 'Assassin',
    isActive: false,
    icon: Assassin,
    class: ChampionClass.Assassin,
  },
  {
    name: 'Tank',
    isActive: false,
    icon: Tank,
    class: ChampionClass.Tank,
  },
  {
    name: 'Support',
    isActive: false,
    icon: Support,
    class: ChampionClass.Support,
  },
]

export const defaultTypeFilters = [
  {
    name: 'All Items',
    isActive: true,
    icon: 'clear-filters.svg',
    categories: [Category.All],
  },
  {
    name: 'Attack Damage',
    isActive: false,
    icon: 'attack-damage.svg',
    categories: [Category.AttackDamage],
  },
  {
    name: 'Critical Strike',
    isActive: false,
    icon: 'critical-strike.svg',
    categories: [Category.CriticalStrike],
  },
  {
    name: 'Attack Speed',
    isActive: false,
    icon: 'attack-speed.svg',
    categories: [Category.AttackSpeed],
  },
  {
    name: 'On-Hit Effects',
    isActive: false,
    icon: 'on-hit-effects.svg',
    categories: [Category.OnHit],
  },
  {
    name: 'Armor Penetration',
    isActive: false,
    icon: 'armor-penetration.svg',
    categories: [Category.ArmorPenetration],
  },
  {
    name: 'Ability Power',
    isActive: false,
    icon: 'ability-power.svg',
    categories: [Category.AbilityPower],
  },
  {
    name: 'Mana & Regeneration',
    isActive: false,
    icon: 'mana.svg',
    categories: [Category.Mana, Category.ManaRegen],
  },
  {
    name: 'Magic Penetration',
    isActive: false,
    icon: 'magic-penetration.svg',
    categories: [Category.MagicPenetration],
  },
  {
    name: 'Health & Regeneration',
    isActive: false,
    icon: 'health.svg',
    categories: [Category.Health, Category.HealthRegen],
  },
  {
    name: 'Armor',
    isActive: false,
    icon: 'armor.svg',
    categories: [Category.Armor],
  },
  {
    name: 'Magic Resistance',
    isActive: false,
    icon: 'magic-resist.svg',
    categories: [Category.MagicResistance],
  },
  {
    name: 'Ability Haste',
    isActive: false,
    icon: 'ability-haste.svg',
    categories: [Category.AbilityHaste, Category.CooldownReduction],
  },
  {
    name: 'Movement',
    isActive: false,
    icon: 'movement-speed.svg',
    categories: [Category.Boots, Category.NonbootsMovement],
  },
  {
    name: 'Life Steal & Vamp',
    isActive: false,
    icon: 'omni-vamp.svg',
    categories: [Category.SpellVamp, Category.LifeSteal],
  },
  {
    name: 'Trinket',
    isActive: false,
    icon: 'trinket.svg',
    categories: [Category.Trinket, Category.Vision],
  },
  {
    name: 'Lane',
    isActive: false,
    icon: 'mid.svg',
    categories: [Category.Lane],
  },
  {
    name: 'Jungle',
    isActive: false,
    icon: 'jungle.svg',
    categories: [Category.Jungle],
  },
  {
    name: 'Tenacity',
    isActive: false,
    icon: 'tenacity.svg',
    categories: [Category.Tenacity],
  },
  {
    name: 'Consumable',
    isActive: false,
    icon: 'consumable.svg',
    categories: [Category.Consumable],
  },
  {
    name: 'Crowd Control',
    isActive: false,
    icon: 'cc.svg',
    categories: [Category.Slow],
  },
]
