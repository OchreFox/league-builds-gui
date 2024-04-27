import { Rarity } from '@/types/FilterProps'
import { ItemsSchema, Rank } from '@/types/Items'

// Filters to determine the rarity of an item
export function isBasic(item: ItemsSchema) {
  const basicRanks = [
    Rank.Basic,
    Rank.Boots,
    Rank.Consumable,
    Rank.Distributed,
    Rank.Minion,
    Rank.Potion,
    Rank.Starter,
    Rank.Trinket,
    Rank.Turret,
  ]
  return item.inStore && item.rank && item.rank.some((rank) => basicRanks.includes(rank)) && item.requiredAlly === ''
}

export function isEpic(item: ItemsSchema) {
  return item.inStore && item.rank && item.rank.includes(Rank.Epic) && item.requiredAlly === ''
}

export function isLegendary(item: ItemsSchema) {
  return item.inStore && item.rank && item.rank.includes(Rank.Legendary) && item.requiredAlly === ''
}

export function getRarity(item: ItemsSchema): Rarity {
  if (isBasic(item)) {
    return Rarity.Basic
  }
  if (isEpic(item)) {
    return Rarity.Epic
  }
  if (isLegendary(item)) {
    return Rarity.Legendary
  }
  console.error('Item rarity not found')
  return Rarity.Basic
}
