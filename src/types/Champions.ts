// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface ChampionsSchema {
  id: number
  name: string
  title: string
  fullName: string
  icon: string
  resource: string
  attackType: AttackType | null
  adaptiveType: AdaptiveType | null
  roles: Role[]
  attributeRatings: AttributeRatings | null
  releaseDate: string
  releasePatch: string
  patchLastChanged: string
  price: Price | null
  lore: string
  split: number | null
  damageType: number | null
  gankDenial: boolean | null
  poke: number | null
  postToughness: number | null
  toughness: number
  control: number | null
  divePotential: boolean | null
  preDamage: number | null
  kite: number | null
  preControl: number | null
  gankReliability: boolean | null
  pick: number | null
  riotSlug: string
  antiDive: boolean | null
  damage: number | null
  utility: number | null
  waveclear: number | null
  mobility: number | null
  tags: Tag[]
  difficulty: Difficulty[]
  gankTurnAround: boolean | null
  preMobility: number | null
  postControl: number | null
  postDamage: number | null
  postMobility: number | null
  difficultyLevel: number
  engage: number | null
  skirmish: number | null
  sustained: number | null
  powerSpikes: PowerSpike[]
  burst: number | null
  preToughness: number | null
  placeholder: string
}
export interface AdditionalChampionProps {
  splash?: string | null
  colors?: string[] | any
}
export type Champion = ChampionsSchema & AdditionalChampionProps

export enum AdaptiveType {
  MagicDamage = 'MAGIC_DAMAGE',
  PhysicalDamage = 'PHYSICAL_DAMAGE',
}

export enum AttackType {
  Melee = 'MELEE',
  Ranged = 'RANGED',
}

export interface AttributeRatings {
  damage: number
  toughness: number
  control: number
  mobility: number
  utility: number
  abilityReliance: number
  attack: number
  defense: number
  magic: number
  difficulty: number
}

export interface Difficulty {
  flatData: FlatData
}

export interface FlatData {
  level: number
  slug: Slug
  name: Name
}

export enum Name {
  Average = 'Average',
  Easy = 'Easy',
  Hard = 'Hard',
  Severe = 'Severe',
}

export enum Slug {
  Average = 'average',
  Easy = 'easy',
  Hard = 'hard',
  Severe = 'severe',
}

export interface PowerSpike {
  early: number
  mid: number
  late: number
}

export interface Price {
  blueEssence: number
  rp: number
  saleRp: number
}

export enum Role {
  Artillery = 'ARTILLERY',
  Assassin = 'ASSASSIN',
  Battlemage = 'BATTLEMAGE',
  Burst = 'BURST',
  Catcher = 'CATCHER',
  Diver = 'DIVER',
  Enchanter = 'ENCHANTER',
  Fighter = 'FIGHTER',
  Juggernaut = 'JUGGERNAUT',
  Mage = 'MAGE',
  Marksman = 'MARKSMAN',
  Skirmisher = 'SKIRMISHER',
  Specialist = 'SPECIALIST',
  Support = 'SUPPORT',
  Tank = 'TANK',
  Vanguard = 'VANGUARD',
  Warden = 'WARDEN',
}

export enum Tag {
  All = 'All Categories',
  Assassin = 'Assassin',
  Fighter = 'Fighter',
  Mage = 'Mage',
  Marksman = 'Marksman',
  Support = 'Support',
  Tank = 'Tank',
}

export const DefaultChampionSchema: ChampionsSchema = {
  id: -1,
  name: 'Select a champion',
  title: 'Click to select',
  fullName: '',
  icon: '',
  resource: '',
  roles: [],
  releaseDate: '',
  releasePatch: '',
  patchLastChanged: '',
  lore: '',
  split: null,
  damageType: null,
  gankDenial: null,
  poke: null,
  postToughness: null,
  toughness: 0,
  control: null,
  divePotential: null,
  preDamage: null,
  kite: null,
  preControl: null,
  gankReliability: null,
  pick: null,
  riotSlug: '',
  antiDive: null,
  damage: null,
  utility: null,
  waveclear: null,
  mobility: null,
  tags: [],
  difficulty: [],
  gankTurnAround: null,
  preMobility: null,
  postControl: null,
  postDamage: null,
  postMobility: null,
  difficultyLevel: 0,
  engage: null,
  skirmish: null,
  sustained: null,
  powerSpikes: [],
  burst: null,
  preToughness: null,
  attackType: null,
  adaptiveType: null,
  attributeRatings: null,
  price: null,
  placeholder: '',
}

export const DefaultChampion: Champion = {
  ...DefaultChampionSchema,
  splash: '',
  colors: [],
}