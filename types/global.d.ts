import 'little-state-machine'

declare module 'little-state-machine' {
  interface GlobalState {
    itemBuild: {
      title: string
      associatedMaps: number[] // SR -> 11, ARAM -> 12
      associatedChampions: number[]
      blocks: Block[]
    }
  }
}

export interface Block {
  items: Item[]
  type: string
}

export interface Item {
  id: string
  count: number
}
