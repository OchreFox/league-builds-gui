export interface ItemsSchema {
  id: number
  name: string
  description: null | string
  maps: number[]
  gold: Gold
  into: number[]
  mythic: boolean
  categories: Category[]
  inStore: boolean
  maxStacks: number
  icon: string
  iconOverlay: boolean
  nicknames: string[]
  tier: number
  stats: Stats
  classes: ChampionClass[]
  from: number[]
  requiredChampion: RequiredChampion
  simpleDescription: null | string
  visible: boolean | null
  instance: number | null
  depth: number | null
  parent: number | null
}

export enum Category {
  All = 'All',
  AbilityHaste = 'AbilityHaste',
  Active = 'Active',
  Armor = 'Armor',
  ArmorPenetration = 'ArmorPenetration',
  AttackSpeed = 'AttackSpeed',
  Aura = 'Aura',
  Boots = 'Boots',
  Consumable = 'Consumable',
  CooldownReduction = 'CooldownReduction',
  CriticalStrike = 'CriticalStrike',
  AttackDamage = 'Damage',
  GoldPer = 'GoldPer',
  Health = 'Health',
  HealthRegen = 'HealthRegen',
  Jungle = 'Jungle',
  Lane = 'Lane',
  LifeSteal = 'LifeSteal',
  MagicPenetration = 'MagicPenetration',
  Mana = 'Mana',
  ManaRegen = 'ManaRegen',
  NonbootsMovement = 'NonbootsMovement',
  OnHit = 'OnHit',
  Slow = 'Slow',
  MagicResistance = 'SpellBlock',
  AbilityPower = 'SpellDamage',
  SpellVamp = 'SpellVamp',
  Stealth = 'Stealth',
  Tenacity = 'Tenacity',
  Trinket = 'Trinket',
  Vision = 'Vision',
}

export enum ChampionClass {
  Assassin = 'ASSASSIN',
  Fighter = 'FIGHTER',
  Mage = 'MAGE',
  Marksman = 'MARKSMAN',
  Support = 'SUPPORT',
  Tank = 'TANK',
  None = 'None',
}

export interface Gold {
  base: number
  purchasable: boolean
  total: number
  sell: number
}

export enum RequiredChampion {
  Empty = '',
  FiddleSticks = 'FiddleSticks',
  Gangplank = 'Gangplank',
  Kalista = 'Kalista',
}

export interface Stats {
  armor?: Flat
  health?: Flat
  lethality?: Flat
  lifesteal?: Percent
  mana?: Flat
  movespeed?: FlatPercent
  omnivamp?: Percent
  tenacity?: Flat
  abilityPower?: Flat
  armorPenetration?: Percent
  attackDamage?: Flat
  attackSpeed?: Flat
  cooldownReduction?: None
  criticalStrikeChance?: Percent
  goldPer10?: Flat
  healAndShieldPower?: Flat
  healthRegen?: FlatPercent
  magicPenetration?: FlatPercent
  magicResistance?: Flat
  manaRegen?: Percent
  abilityHaste?: Flat
}

export interface Flat {
  flat?: number
}

export interface Percent {
  percent?: number
}

export interface None {}

export interface FlatPercent {
  flat?: number
  percent?: number
}
