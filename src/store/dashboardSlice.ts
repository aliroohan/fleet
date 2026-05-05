import { createSlice } from '@reduxjs/toolkit'
import type { LayoutItem } from 'react-grid-layout'
import {
  DASHBOARD_STORAGE_KEY,
  type PersistedDashboard,
  type WidgetType,
} from '../types/widgets'
import { getWidgetConstraints } from '../data/widgetLayout'
import { balanceLayoutWidths } from '../lib/balanceLayout'

type LayoutRow = LayoutItem[]

function loadPersisted(): PersistedDashboard | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedDashboard
    if (!parsed.layout || !parsed.widgets) return null
    return parsed
  } catch {
    return null
  }
}

function savePersisted(layout: LayoutRow, widgets: Record<string, WidgetType>) {
  if (typeof window === 'undefined') return
  const payload: PersistedDashboard = { layout, widgets }
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(payload))
}

/** Operations + analytics tiles — users remove/reorder via grid */
export const DEFAULT_DASHBOARD: PersistedDashboard = {
  layout: [
    {
      i: 'kpi-main',
      x: 0,
      y: 0,
      w: 12,
      h: 6,
      minW: 6,
      minH: 4,
      maxW: 12,
      maxH: 8,
    },
    {
      i: 'fleet-main',
      x: 0,
      y: 4,
      w: 2.5,
      h: 22,
      minW: 2,
      minH: 12,
      maxW: 6,
      maxH: 32,
    },
    {
      i: 'map-main',
      x: 2.5,
      y: 9,
      w: 5,
      h: 22,
      minW: 2,
      minH: 10,
      maxW: 8,
      maxH: 32,
    },
    {
      i: 'ops-main',
      x: 7.5,
      y: 9,
      w: 4.5,
      h: 22,
      minW: 5,
      minH: 12,
      maxW: 6,
      maxH: 32,
    },
    {
      i: 'gauge-1',
      x: 0,
      y: 31,
      w: 3,
      h: 11,
      minW: 2,
      minH: 6,
      maxW: 6,
      maxH: 18,
    },
    {
      i: 'co2-1',
      x: 3,
      y: 31,
      w: 5,
      h: 11,
      minW: 3,
      minH: 6,
      maxW: 12,
      maxH: 18,
    },
    {
      i: 'util-1',
      x: 8,
      y: 31,
      w: 4,
      h: 11,
      minW: 3,
      minH: 6,
      maxW: 12,
      maxH: 18,
    },
    {
      i: 'alerts-1',
      x: 0,
      y: 42,
      w: 12,
      h: 12,
      minW: 4,
      minH: 8,
      maxW: 12,
      maxH: 28,
    },
  ],
  widgets: {
    'kpi-main': 'kpiStrip',
    'fleet-main': 'fleetList',
    'map-main': 'fleetMap',
    'ops-main': 'operationalOverview',
    'gauge-1': 'gauge',
    'co2-1': 'co2Bar',
    'util-1': 'utilizationLine',
    'alerts-1': 'alertsTable',
  },
}

const persisted = loadPersisted()
const initialWidgets = (persisted?.widgets ??
  DEFAULT_DASHBOARD.widgets) as Record<string, WidgetType>
const initialLayout = balanceLayoutWidths(
  (persisted?.layout ?? DEFAULT_DASHBOARD.layout) as LayoutRow,
  initialWidgets,
)

const COLS = 12

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    editMode: false,
    layout: initialLayout,
    widgets: initialWidgets,
    cols: COLS,
  },
  reducers: {
    setEditMode(state, action: { payload: boolean }) {
      state.editMode = action.payload
    },
    setLayout(state, action: { payload: LayoutRow }) {
      state.layout = action.payload
      savePersisted(state.layout, state.widgets)
    },
    addWidget(state, action: { payload: { type: WidgetType; id: string } }) {
      const { type, id } = action.payload
      if (Object.values(state.widgets).includes(type)) return
      const maxY = state.layout.reduce((m, l) => Math.max(m, l.y + l.h), 0)
      const c = getWidgetConstraints(type)
      state.widgets[id] = type
      state.layout.push({
        i: id,
        x: 0,
        y: maxY,
        w: c.w,
        h: c.h,
        minW: c.minW,
        minH: c.minH,
        maxW: c.maxW,
        maxH: c.maxH,
      })
      state.layout = balanceLayoutWidths(state.layout, state.widgets)
      savePersisted(state.layout, state.widgets)
    },
    removeWidget(state, action: { payload: string }) {
      const id = action.payload
      delete state.widgets[id]
      state.layout = balanceLayoutWidths(
        state.layout.filter((l) => l.i !== id),
        state.widgets,
      )
      savePersisted(state.layout, state.widgets)
    },
    resetDashboard(state) {
      savePersisted(DEFAULT_DASHBOARD.layout, DEFAULT_DASHBOARD.widgets)
      state.editMode = false
      state.layout = [...DEFAULT_DASHBOARD.layout]
      state.widgets = { ...DEFAULT_DASHBOARD.widgets }
    },
  },
})

export const {
  setEditMode,
  setLayout,
  addWidget,
  removeWidget,
  resetDashboard,
} = dashboardSlice.actions
