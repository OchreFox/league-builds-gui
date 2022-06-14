import { Dispatch } from 'react'

export interface PotatoModeInterface {
  enabled: boolean
}

export type ActionType = {
  type: string
  payload?: any
}

export type PotatoModeType = {
  state: PotatoModeInterface
  dispatch: Dispatch<ActionType>
}

export type ReducedMotionType = 'always' | 'never' | 'user' | undefined
