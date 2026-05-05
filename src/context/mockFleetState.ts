import { createContext } from 'react'
import type { AlertLogRow, FleetVehicle, TripHistoryRow } from '../types/fleet'

export type MockFleetState = {
  loading: boolean
  error: string | null
  fleet: FleetVehicle[]
  trips: TripHistoryRow[]
  alerts: AlertLogRow[]
}

export const MockFleetContext = createContext<MockFleetState | null>(null)
