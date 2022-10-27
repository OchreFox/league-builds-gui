import { Dispatch } from 'react'

export interface PotatoModeState {
  enabled: boolean
}

export type ActionType = {
  type: 'SET_POTATO_MODE' | 'UNSET_POTATO_MODE' | 'SET_POTATO_MODE_LOCAL'
  payload?: any
}

export type PotatoModeType = {
  state: PotatoModeState
  dispatch: Dispatch<ActionType>
}

export type ReducedMotionType = 'always' | 'never' | 'user' | undefined
