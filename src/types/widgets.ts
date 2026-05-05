import type { LayoutItem } from 'react-grid-layout'

export const WIDGET_TYPES = [
  'kpiStrip',
  'fleetList',
  'fleetMap',
  'operationalOverview',
  'gauge',
  'co2Bar',
  'utilizationLine',
  'alertsTable',
] as const

export type WidgetType = (typeof WIDGET_TYPES)[number]

export const WIDGET_LABELS: Record<WidgetType, string> = {
  kpiStrip: 'KPI summary strip',
  fleetList: 'Fleet list (search & categories)',
  fleetMap: 'Live map & geofence',
  operationalOverview: 'Operational overview sidebar',
  gauge: 'Average fuel (gauge)',
  co2Bar: 'Weekly CO₂ vs target',
  utilizationLine: 'Fleet utilization (30 days)',
  alertsTable: 'Active alarms / faults',
}

export interface PersistedDashboard {
  layout: LayoutItem[]
  widgets: Record<string, WidgetType>
}

/** Bumped so merged Operations + charts layout applies cleanly */
export const DASHBOARD_STORAGE_KEY = 'jaxicloud.dashboard.v2'
