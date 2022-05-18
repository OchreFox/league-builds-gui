export interface ItemBuildExample {
  title: string
  associatedMaps: number[]
  associatedChampions: number[]
  blocks: Block[]
}

export interface Block {
  items: Item[]
  type: string
}

export interface Item {
  id: string
  count: number
}
