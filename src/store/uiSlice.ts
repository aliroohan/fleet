import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    /** Highlighted unit (fleet list / map) */
    focusedVehicleId: null as string | null,
    /** Slide-over “full details” */
    selectedVehicleId: null as string | null,
    paletteOpen: false,
    hoveredVehicleId: null as string | null,
    hoverPosition: { x: 0, y: 0 },
  },
  reducers: {
    focusVehicle(state, action: { payload: string | null }) {
      state.focusedVehicleId = action.payload
    },
    selectVehicle(state, action: { payload: string | null }) {
      state.selectedVehicleId = action.payload
      if (action.payload) state.focusedVehicleId = action.payload
    },
    closeFlyout(state) {
      state.selectedVehicleId = null
    },
    setPaletteOpen(state, action: { payload: boolean }) {
      state.paletteOpen = action.payload
    },
    setHover(state, action: { payload: { id: string | null; x?: number; y?: number } }) {
      state.hoveredVehicleId = action.payload.id
      if (action.payload.x !== undefined) state.hoverPosition.x = action.payload.x
      if (action.payload.y !== undefined) state.hoverPosition.y = action.payload.y
    },
  },
})

export const {
  focusVehicle,
  selectVehicle,
  closeFlyout,
  setPaletteOpen,
  setHover,
} = uiSlice.actions
