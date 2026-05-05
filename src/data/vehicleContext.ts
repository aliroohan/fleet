import type { AlertLogRow, FleetVehicle, TripHistoryRow } from '../types/fleet'
import { getLastNDaysTrips } from './fleetData'

export type VehicleContext = {
  vehicle: FleetVehicle | undefined
  alerts: AlertLogRow[]
  /** Simple “recent” stats from global series (mock) */
  last7DaysMileage: number
  last7DaysCo2Tons: number
}

export function buildVehicleContext(
  vehicleId: string,
  fleet: FleetVehicle[],
  trips: TripHistoryRow[],
  alerts: AlertLogRow[],
): VehicleContext {
  const vehicle = fleet.find((v) => v.vehicle_id === vehicleId)
  const vehAlerts = alerts
    .filter((a) => a.vehicle_id === vehicleId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  const last7 = getLastNDaysTrips(trips, 7)
  const last7DaysMileage = last7.reduce((s, t) => s + t.total_fleet_mileage, 0)
  const last7DaysCo2Tons = last7.reduce((s, t) => s + t.co2_emissions_tons, 0)
  return {
    vehicle,
    alerts: vehAlerts,
    last7DaysMileage: Math.round(last7DaysMileage),
    last7DaysCo2Tons: Math.round(last7DaysCo2Tons * 100) / 100,
  }
}
