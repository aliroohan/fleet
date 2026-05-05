import { configureStore } from '@reduxjs/toolkit'
import { themeSlice } from './themeSlice'
import { dashboardSlice } from './dashboardSlice'
import { uiSlice } from './uiSlice'

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    dashboard: dashboardSlice.reducer,
    ui: uiSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
