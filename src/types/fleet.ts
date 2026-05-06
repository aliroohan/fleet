export type VehicleStatus = 'Active' | 'Resting' | 'Maintenance'

export type AlertSeverity = 'High' | 'Medium' | 'Low'

export type SatelliteStatus = 'connected' | 'weak' | 'lost'

export type UnitCategory =
  | 'Refrigerated'
  | 'Trucks'
  | 'Trailers'
  | 'Tippers'

export interface FleetVehicle {
  vehicle_id: string
  status: VehicleStatus
  fuel_level_percent: number
  current_lat: number
  current_lng: number
  driver_name: string
  hours_driven_today: number
  /** Compliance-style driving time (hours) */
  working_time_hours: number
  resting_time_hours: number
  satellite_status: SatelliteStatus
  /** Fleet list grouping (mock) */
  unit_category: UnitCategory
  /** Mock speed when Active */
  speed_kmh: number
  image_url?: string
  driver_code?: string
  salary_number?: string
  location_address?: string
  location_timestamp?: string
  uninterrupted_driving_time?: string
  daily_driving_time?: string
  weekly_driving_time?: string
  two_weeks_driving_time?: string
  service_time?: string
  ten_h_driving_days?: number
  nine_h_rest_periods?: number
  reduced_weekly_rest?: number
}

export interface TripHistoryRow {
  date: string
  total_fleet_mileage: number
  co2_emissions_tons: number
  idle_time_hours: number
  active_vehicles_count: number
}

export interface AlertLogRow {
  alert_id: string
  severity: AlertSeverity
  vehicle_id: string
  message: string
  timestamp: string
}

/** Weekly CO2 target (tons) — mock KPI */
export const MOCK_CO2_WEEKLY_TARGET_TONS = 12
