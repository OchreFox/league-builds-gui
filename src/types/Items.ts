export interface ItemsSchema {
  id: number
  active: Passive[] | boolean
  categories: Category[]
  classes: ChampionClass[]
  depth: number | null
  description: null | string
  from: number[]
  gold: Gold
  icon: string
  iconOverlay: boolean
  iconPath?: string
  instance: number | null
  inStore: boolean
  isEnchantment?: boolean
  maps: number[]
  maxStacks: number
  name: string
  nicknames: string[]
  parent: number | null
  passives?: Passive[]
  placeholder: string
  price?: number
  priceTotal?: number
  rank?: Rank[]
  requiredAlly?: string
  requiredBuffCurrencyCost?: number
  requiredBuffCurrencyName?: string
  requiredChampion: RequiredChampion
  simpleDescription: null | string
  specialRecipe?: number
  stats: Stats
  to: number[]
  type: string[]
  visible: boolean | null
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
  Damage = 'Damage',
  GoldPer = 'GoldPer',
  Health = 'Health',
  HealthRegen = 'HealthRegen',
  Jungle = 'Jungle',
  Lane = 'Lane',
  LifeSteal = 'LifeSteal',
  MagicPenetration = 'MagicPenetration',
  MagicResist = 'MagicResist',
  Mana = 'Mana',
  ManaRegen = 'ManaRegen',
  NonbootsMovement = 'NonbootsMovement',
  OnHit = 'OnHit',
  Slow = 'Slow',
  SpellBlock = 'SpellBlock',
  SpellDamage = 'SpellDamage',
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

export enum Rank {
  Basic = 'BASIC',
  Boots = 'BOOTS',
  Consumable = 'CONSUMABLE',
  Distributed = 'DISTRIBUTED',
  Epic = 'EPIC',
  Legendary = 'LEGENDARY',
  Minion = 'MINION',
  Potion = 'POTION',
  Starter = 'STARTER',
  Trinket = 'TRINKET',
  Turret = 'TURRET',
}

export interface Passive {
  unique: boolean
  name: null | string
  effects: null | string
  cooldown: null | string
  range: number | null
  stats: Stats
}

export interface Stats {
  abilityHaste?: Flat
  abilityPower?: Flat
  armor?: Flat
  armorPenetration?: Percent
  attackDamage?: Flat
  attackSpeed?: Flat
  cooldownReduction?: None
  criticalStrikeChance?: Percent
  goldPer10?: Flat
  healAndShieldPower?: Flat
  health?: Flat
  healthRegen?: FlatPercent
  lethality?: Flat
  lifesteal?: Percent
  magicPenetration?: FlatPercent
  magicResistance?: Flat
  mana?: Flat
  manaRegen?: Percent
  movespeed?: FlatPercent
  omnivamp?: Percent
  tenacity?: Flat
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

export enum CSSProperty {
  TRANSFORM = 'transform',
  TRANSITION_PROPERTY = 'transition',
  OPACITY = 'opacity',
  ANIMATION = 'animation',
}

export interface DraggableItem extends ItemsSchema {
  /** When true, the item is selected using MultiDrag */
  selected?: boolean
  /** When true, the item is deemed "chosen", which basically just a mousedown event. */
  chosen?: boolean
  /** When true, it will not be possible to pick this item up in the list. */
  filtered?: boolean
}
