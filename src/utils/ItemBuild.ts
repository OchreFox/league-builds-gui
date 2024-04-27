import { nanoid } from 'nanoid'
import { BlockState, Item } from '@/types/Build'

export const generateItemId = (id?: number) => {
  if (id) {
    return `${id}-${nanoid(10)}`
  }
  return nanoid(10)
}

export const getNewItem = (id: number): Item => {
  return {
    id: generateItemId(id),
    itemId: id.toString(),
    count: 1,
  }
}

export const getNewBlock = (position: number, itemId?: number) => {
  let block: BlockState = {
    id: generateItemId(),
    position: position,
    type: `New Block ${position + 1}`,
    items: [],
  }
  if (itemId) {
    block.items.push(getNewItem(itemId))
  }
  return block
}
