export interface ItemBuildSettings {
  title: string
  associatedMaps: number[]
}
export interface ItemBuild extends ItemBuildSettings {
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

export interface CategoryDropdownProps {
  styles: {
    [key: string]: React.CSSProperties
  }
  attributes: {
    [key: string]:
      | {
          [key: string]: string
        }
      | undefined
  }
}
