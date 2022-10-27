import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { PotatoModeState } from '../../types/PotatoMode'
import { RootState } from './store'

const initialState: PotatoModeState = {
  enabled: false,
}

export const potatoModeSlice = createSlice({
  name: 'potatoMode',
  initialState,
  reducers: {
    setPotatoMode: (state) => {
      state.enabled = true
    },
    unsetPotatoMode: (state) => {
      state.enabled = false
    },
    setPotatoModeLocal: (state, action) => {
      state.enabled = action.payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.potatoMode,
      }
    },
  },
})

export const selectPotatoMode = (state: RootState) => state.potatoMode.enabled

export const { setPotatoMode, unsetPotatoMode, setPotatoModeLocal } = potatoModeSlice.actions
export default potatoModeSlice.reducer
