import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import type { TypedAddListener, TypedStartListening } from '@reduxjs/toolkit'

import { addAssociatedChampion, removeAssociatedChampion } from './itemBuildSlice'
import { AppDispatch, RootState } from './store'

export const listenerMiddleware = createListenerMiddleware()
export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening = listenerMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>

// startAppListening({
//   actionCreator: addSelectedChampion,
//   effect: (action, { dispatch }) => {
//     dispatch(addAssociatedChampion(action.payload.id))
//   },
// })

// startAppListening({
//   actionCreator: removeSelectedChampion,
//   effect: (action, { dispatch }) => {
//     dispatch(removeAssociatedChampion(action.payload.id))
//   },
// })
