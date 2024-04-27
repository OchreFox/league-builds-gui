import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { appSlice } from '@/store/appSlice'
import { itemBuildSlice } from '@/store/itemBuildSlice'
import { listenerMiddleware } from '@/store/middleware'
import { potatoModeSlice } from '@/store/potatoModeSlice'
import { ItemBuild } from '@/types/Build'
import { PotatoModeState } from '@/types/PotatoMode'

export interface GlobalState {
  itemBuild: ItemBuild
  potatoMode: PotatoModeState
}

const store = configureStore({
  reducer: {
    itemBuild: itemBuildSlice.reducer,
    potatoMode: potatoModeSlice.reducer,
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export default store
