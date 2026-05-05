import { createSlice } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'jaxicloud.theme'

function readInitial(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'dark' || raw === 'light') return raw
  // Default to dark for the futuristic navy-cyan design
  return 'dark'
}

function applyDom(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

const initialMode: ThemeMode = readInitial()
applyDom(initialMode)

export const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, state.mode)
      applyDom(state.mode)
    },
    setTheme(state, action: { payload: ThemeMode }) {
      state.mode = action.payload
      localStorage.setItem(STORAGE_KEY, state.mode)
      applyDom(state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
