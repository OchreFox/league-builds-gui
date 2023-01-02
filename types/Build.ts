import { ChampionsSchema } from './Champions'

// For the Settings component
export interface ItemBuildSettings {
  title: string
  associatedMaps: number[]
}
export interface ItemBuild extends ItemBuildSettings {
  associatedChampions: number[]
  blocks: BlockState[]
}

export interface RiotItemBuild extends ItemBuildSettings {
  associatedChampions: number[]
  blocks: Block[]
}

export interface Block {
  items: Item[]
  type: string
}

/** @internal Used for UI */
export interface BlockState extends Block {
  id: string
  position: number
}

export interface Item {
  id: string
  count: number
  uid?: string
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

export interface DeleteSectionPopperProps {
  popperRef: React.RefObject<HTMLDivElement>
  id: string
  setArrowRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>
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
