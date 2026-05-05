import type { AlertLogRow, FleetVehicle, TripHistoryRow } from '../types/fleet'
import { MOCK_CO2_WEEKLY_TARGET_TONS } from '../types/fleet'

export type LoadedMockData = {
  fleet: FleetVehicle[]
  trips: TripHistoryRow[]
  alerts: AlertLogRow[]
}

let cache: LoadedMockData | null = null

export async function loadAllMockData(): Promise<LoadedMockData> {
  if (cache) return cache
  const [fleet, trips, alerts] = await Promise.all([
    fetch('/mock/fleet_status.json').then((r) => r.json()) as Promise<
      FleetVehicle[]
    >,
    fetch('/mock/trip_history_timeseries.json').then((r) => r.json()) as Promise<
      TripHistoryRow[]
    >,
    fetch('/mock/alerts_log.json').then((r) => r.json()) as Promise<
      AlertLogRow[]
    >,
  ])
  cache = { fleet, trips, alerts }
  return cache
}

export function getWeeklyCo2VsTarget(
  trips: TripHistoryRow[],
  weeks = 5,
): { label: string; co2: number; target: number }[] {
  const sorted = [...trips].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const recent = sorted.slice(0, weeks * 7)
  const out: { label: string; co2: number; target: number }[] = []
  for (let w = 0; w < weeks; w++) {
    const chunk = recent.slice(w * 7, (w + 1) * 7)
    if (chunk.length === 0) break
    const sum = chunk.reduce((s, r) => s + r.co2_emissions_tons, 0)
    out.push({
      label: `Week ${weeks - w}`,
      co2: Math.round(sum * 100) / 100,
      target: MOCK_CO2_WEEKLY_TARGET_TONS,
    })
  }
  return out.reverse()
}

export function getLastNDaysTrips(
  trips: TripHistoryRow[],
  days: number,
): TripHistoryRow[] {
  const sorted = [...trips].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  return sorted.slice(-days)
}

export function averageFuelPercent(fleet: FleetVehicle[]): number {
  if (fleet.length === 0) return 0
  const sum = fleet.reduce((s, v) => s + v.fuel_level_percent, 0)
  return Math.round((sum / fleet.length) * 10) / 10
}
