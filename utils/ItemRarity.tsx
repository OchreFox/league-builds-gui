import { Rarity } from '../types/FilterProps'
import { ItemsSchema, RequiredChampion } from '../types/Items'

// Filters to determine the rarity of an item
export function isBasic(item: ItemsSchema) {
  return item.tier === 1 && item.inStore
}
export function isEpic(item: ItemsSchema) {
  return item.tier === 2 && item.inStore
}
export function isLegendary(item: ItemsSchema) {
  return item.tier === 3 && item.mythic !== true && item.inStore
}
export function isMythic(item: ItemsSchema) {
  return item.mythic === true && item.requiredChampion === RequiredChampion.Empty && item.inStore
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
  if (isMythic(item)) {
    return Rarity.Mythic
  }
  return Rarity.Empty
}
