import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mockDir = path.join(__dirname, '..', 'public', 'mock')
fs.mkdirSync(mockDir, { recursive: true })

const drivers = [
  'Anna Berg',
  'Marco Rossi',
  'Fatima Ali',
  'Jonas Nielsen',
  'Elena Popescu',
  'Thomas Klein',
  'Sofia Silva',
  'Lukas Meyer',
  'Priya Shah',
  'Henrik Voss',
]

const statuses = ['Active', 'Resting', 'Maintenance']
const sat = ['connected', 'weak', 'lost']
const categories = ['Refrigerated', 'Trucks', 'Trailers', 'Tippers']

/** Spread vehicles across Denmark-ish bbox */
const fleet = []
for (let i = 1; i <= 55; i++) {
  const lat = 54.95 + (i % 11) * 0.14 + (i % 5) * 0.02
  const lng = 9.15 + (i % 9) * 0.22 + (i % 7) * 0.03
  const status = statuses[i % statuses.length]
  fleet.push({
    vehicle_id: `VH-${String(i).padStart(4, '0')}`,
    status,
    fuel_level_percent: Math.min(
      100,
      Math.max(5, 28 + ((i * 17) % 72) + (i % 3) * 2),
    ),
    current_lat: Math.round(lat * 1e6) / 1e6,
    current_lng: Math.round(lng * 1e6) / 1e6,
    driver_name: drivers[i % drivers.length],
    hours_driven_today: Math.round(((i * 13) % 85) + (i % 4)) / 10,
    working_time_hours: Math.round(40 + (i % 50) + Math.sin(i) * 5) / 10,
    resting_time_hours: Math.round(20 + (i % 35) + Math.cos(i * 0.7) * 4) / 10,
    satellite_status: sat[i % sat.length],
    unit_category: categories[i % categories.length],
    speed_kmh: status === 'Active' ? Math.round(35 + ((i * 17) % 75)) : 0,
  })
}

fs.writeFileSync(
  path.join(mockDir, 'fleet_status.json'),
  JSON.stringify(fleet, null, 2),
)

const trips = []
const today = new Date()
for (let d = 0; d < 65; d++) {
  const date = new Date(today)
  date.setDate(date.getDate() - d)
  const iso = date.toISOString().slice(0, 10)
  const wave = Math.sin(d / 4.2) * 0.35 + Math.cos(d / 9) * 0.2
  const base = 9800 + d * 95
  trips.push({
    date: iso,
    total_fleet_mileage: Math.round(base + wave * 120 + (d % 7) * 40),
    co2_emissions_tons: Math.round((2.2 + wave * 0.55 + (d % 5) * 0.08) * 100) / 100,
    idle_time_hours: Math.round((12 + Math.sin(d / 3) * 4 + (d % 4)) * 10) / 10,
    active_vehicles_count: 38 + (d % 18) + Math.floor(Math.abs(wave) * 6),
  })
}

fs.writeFileSync(
  path.join(mockDir, 'trip_history_timeseries.json'),
  JSON.stringify(trips, null, 2),
)

const messages = [
  'Engine fault code 42',
  'Geofence boundary crossed',
  'Low tire pressure — rear axle',
  'Harsh braking event',
  'Battery voltage below threshold',
  'Oil temperature elevated',
  'Driver card authentication failed',
  'Auxiliary heating fault',
  'Coolant level low',
  'ABS warning — inspection required',
]

const severities = ['High', 'Medium', 'Low']
const alerts = []
for (let a = 1; a <= 48; a++) {
  const vid = `VH-${String(((a * 7) % 55) + 1).padStart(4, '0')}`
  const ts = new Date(today)
  ts.setHours(ts.getHours() - (a % 72))
  ts.setMinutes(ts.getMinutes() - (a * 13) % 60)
  alerts.push({
    alert_id: `ALT-${String(a).padStart(5, '0')}`,
    severity: severities[a % severities.length],
    vehicle_id: vid,
    message: messages[a % messages.length],
    timestamp: ts.toISOString(),
  })
}

fs.writeFileSync(
  path.join(mockDir, 'alerts_log.json'),
  JSON.stringify(alerts, null, 2),
)

console.log('Wrote mock JSON to', mockDir)
