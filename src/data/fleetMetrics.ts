import type { AlertLogRow, FleetVehicle } from '../types/fleet'

/** Alarms treated as needing attention (mock KPI) */
export function countAttentionAlerts(alerts: AlertLogRow[]): number {
  return alerts.filter((a) => a.severity !== 'Low').length
}

export function countOnlineUnits(fleet: FleetVehicle[]): {
  online: number
  pct: number
} {
  const online = fleet.filter((v) => v.satellite_status === 'connected').length
  const pct =
    fleet.length === 0 ? 0 : Math.round((online / fleet.length) * 100)
  return { online, pct }
}

export function countParked(fleet: FleetVehicle[]): {
  parked: number
  pct: number
} {
  const parked = fleet.filter((v) => v.status === 'Resting').length
  const pct =
    fleet.length === 0 ? 0 : Math.round((parked / fleet.length) * 100)
  return { parked, pct }
}

export function uniqueDriversToday(fleet: FleetVehicle[]): number {
  return new Set(fleet.map((v) => v.driver_name)).size
}

export function fleetHealthBuckets(fleet: FleetVehicle[]): {
  healthy: number
  attention: number
  unhealthy: number
} {
  let healthy = 0
  let attention = 0
  let unhealthy = 0
  for (const v of fleet) {
    if (v.status === 'Maintenance') unhealthy++
    else if (v.status === 'Resting' || v.fuel_level_percent <= 35)
      attention++
    else healthy++
  }
  return { healthy, attention, unhealthy }
}
