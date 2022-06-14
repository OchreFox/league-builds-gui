// Hook to expose context state of potato mode

import React, { createContext, useEffect, useReducer, ReactNode } from 'react'
import {
  ActionType,
  PotatoModeInterface,
  PotatoModeType,
} from '../../types/Store'

// Reducer
const Reducer = (state: PotatoModeInterface, action: ActionType) => {
  switch (action.type) {
    case 'SET_POTATO_MODE':
      return { ...state, enabled: true }
    case 'UNSET_POTATO_MODE':
      return { ...state, enabled: false }
    case 'SET_POTATO_MODE_LOCAL':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Context-based store with reducer and persistent state saving to localStorage

// Context
const PotatoModeContext = createContext<PotatoModeType>({
  state: {
    enabled: false,
  },
  dispatch: () => {
    throw new Error('PotatoModeStore: dispatch not implemented')
  },
})

// Store
const PotatoModeStore = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(Reducer, {
    enabled: false,
  })

  // Get potato mode from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('potatoMode')
    if (storedState) {
      dispatch({
        type: 'SET_POTATO_MODE_LOCAL',
        payload: JSON.parse(storedState),
      })
    }
  }, [])

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('potatoMode', JSON.stringify(state))
  }, [state])
  return (
    <PotatoModeContext.Provider value={{ state, dispatch }}>
      {children}
    </PotatoModeContext.Provider>
  )
}

export { PotatoModeContext, PotatoModeStore }
