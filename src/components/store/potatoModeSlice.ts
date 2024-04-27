import { createAction, createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from '@/types/App'

import { RootState } from '@/store/store'
import { PotatoModeState } from '@/types/PotatoMode'

const hydrate = createAction<AppState>(HYDRATE)

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
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })
  },
})

export const selectPotatoMode = (state: RootState) => state.potatoMode.enabled

export const { setPotatoMode, unsetPotatoMode, setPotatoModeLocal } = potatoModeSlice.actions
export default potatoModeSlice.reducer
