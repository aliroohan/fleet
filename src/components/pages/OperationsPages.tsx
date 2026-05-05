import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getLastNDaysTrips } from '../../data/fleetData'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useChartPalette } from '../../lib/chartTheme'
import { useAppDispatch } from '../../store/hooks'
import { focusVehicle } from '../../store/uiSlice'
import type { FleetVehicle, UnitCategory } from '../../types/fleet'
import type { AppTab } from '../TopNav'
import { MonitoringWorkspace } from '../monitoring/MonitoringWorkspace'
import { AlertsTableWidget } from '../widgets/AlertsTableWidget'

function Card({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[0_24px_48px_-20px_rgb(0_0_0_/_0.5)] dark:backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent dark:via-cyan-400/30"
        aria-hidden
      />
      <header className="relative mb-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{subtitle}</p> : null}
      </header>
      {children}
    </article>
  )
}

function MiniStat({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'danger' | 'good'
}) {
  const toneClasses =
    tone === 'danger'
      ? 'text-rose-600 dark:text-rose-400'
      : tone === 'good'
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-slate-900 dark:text-white'

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-black ${toneClasses}`}>{value}</p>
    </div>
  )
}


function statusPill(status: FleetVehicle['status']): string {
  if (status === 'Active') return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20'
  if (status === 'Maintenance') return 'bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20'
  return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-white/[0.04] dark:text-slate-300 dark:ring-white/[0.06]'
}

function satTone(v: FleetVehicle['satellite_status']): string {
  if (v === 'connected') return 'text-emerald-400'
  if (v === 'weak') return 'text-amber-400'
  return 'text-rose-400'
}

function TracksPage() {
  const { trips, fleet } = useMockFleet()
  const palette = useChartPalette()
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [range, setRange] = useState<7 | 14 | 30>(14)
  const latestTrips = useMemo(() => getLastNDaysTrips(trips, range), [trips, range])
  const series = useMemo(
    () =>
      latestTrips.map((row) => ({
        day: new Date(row.date).toLocaleDateString(undefined, {
          weekday: range === 30 ? undefined : 'short',
          month: 'short',
          day: 'numeric',
        }),
        mileage: row.total_fleet_mileage,
        active: row.active_vehicles_count,
        idle: row.idle_time_hours,
      })),
    [latestTrips, range],
  )
  const trackedVehicles = useMemo(() => fleet.slice(0, 12), [fleet])
  const avgMileage = useMemo(() => {
    if (series.length === 0) return 0
    return Math.round(series.reduce((sum, s) => sum + s.mileage, 0) / series.length)
  }, [series])
  const peak = useMemo(() => Math.max(0, ...series.map((s) => s.mileage)), [series])

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card title="Tracks Playback" subtitle="Historical path and active-unit trend analysis">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {([7, 14, 30] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    range === r
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-900 focus:border-blue-400 outline-none dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white dark:focus:border-sky-400/50"
            >
              <option value="all" className="bg-white dark:bg-navy-950">All units</option>
              {trackedVehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id} className="bg-navy-950">
                  {v.vehicle_id} · {v.driver_name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  stroke={palette.tick}
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  interval={range === 30 ? 3 : 0}
                />
                <YAxis yAxisId="left" stroke={palette.tick} tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis yAxisId="right" orientation="right" stroke={palette.tick} tick={{ fontSize: 11, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    background: palette.tooltipBg,
                    borderColor: palette.tooltipBorder,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Bar yAxisId="left" dataKey="mileage" fill={palette.bar} radius={[6, 6, 2, 2]} />
                <Line yAxisId="right" type="monotone" dataKey="active" stroke={palette.line} strokeWidth={3} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Track Health">
          <div className="grid grid-cols-2 gap-2">
            <MiniStat label="Avg mileage/day" value={`${avgMileage} km`} />
            <MiniStat label="Peak day" value={`${peak} km`} />
          </div>
          <div className="mt-3 space-y-2">
            {trackedVehicles.slice(0, 6).map((v, idx) => (
              <div
                key={v.vehicle_id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-3 transition-all hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{v.vehicle_id}</span>
                  <span className={`${satTone(v.satellite_status)} text-[10px] font-black tracking-widest`}>{v.satellite_status.toUpperCase()}</span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  last ping {4 + idx}m · speed {Math.max(0, v.speed_kmh)} km/h
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}


function DriversPage() {
  const { fleet, alerts } = useMockFleet()
  const drivers = useMemo(
    () => [...fleet].sort((a, b) => a.driver_name.localeCompare(b.driver_name)),
    [fleet],
  )
  const topRiskDrivers = useMemo(
    () =>
      drivers
        .map((d) => ({
          driver: d,
          alerts: alerts.filter((a) => a.vehicle_id === d.vehicle_id && a.severity !== 'Low').length,
        }))
        .sort((a, b) => b.alerts - a.alerts || b.driver.hours_driven_today - a.driver.hours_driven_today)
        .slice(0, 6),
    [drivers, alerts],
  )

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card title="Driver Registry" subtitle="Assignment, workload, satellite quality and tachograph watchlist">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Driver</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Unit</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Hours</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Link</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((v) => (
                  <tr
                    key={v.vehicle_id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-white/[0.04] dark:hover:bg-white/[0.02]"
                  >
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">
                      {v.driver_name}
                    </td>
                    <td className="py-3 pr-3 font-mono font-bold text-slate-500 dark:text-slate-300">
                      {v.vehicle_id}
                    </td>
                    <td className="py-3 pr-3 font-bold text-slate-400 dark:text-slate-500">{v.unit_category}</td>
                    <td className="py-3 pr-3 font-black tabular-nums text-slate-900 dark:text-white">
                      {v.hours_driven_today.toFixed(1)} h
                    </td>
                    <td className={`py-3 pr-3 font-black tracking-widest text-[10px] ${satTone(v.satellite_status)}`}>
                      {v.satellite_status.toUpperCase()}
                    </td>
                    <td className="py-3 font-bold text-slate-500 dark:text-slate-400">
                      {v.hours_driven_today >= 9
                        ? <span className="text-rose-400">Review</span>
                        : v.hours_driven_today >= 7
                          ? <span className="text-amber-400">Watch</span>
                          : 'OK'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Driver Risk Queue">
          <div className="space-y-2">
            {topRiskDrivers.map((row) => (
              <button
                key={row.driver.vehicle_id}
                type="button"
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left transition-all hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-900 dark:text-white">{row.driver.driver_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusPill(row.driver.status)}`}>
                    {row.driver.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {row.driver.vehicle_id} · {row.driver.hours_driven_today.toFixed(1)}h · {row.alerts} active alerts
                </p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}


function VideoPage() {
  const { fleet } = useMockFleet()
  const cameras = useMemo(
    () =>
      fleet.slice(0, 6).map((v, idx) => ({
        id: `CAM-${String(idx + 1).padStart(3, '0')}`,
        vehicle: v.vehicle_id,
        label: idx % 2 === 0 ? 'Cabin' : 'Road Front',
        quality: idx % 3 === 0 ? 'HD' : idx % 3 === 1 ? 'SD' : 'Offline',
      })),
    [fleet],
  )
  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card title="Video Wall" subtitle="Real-time camera channels bound to active units">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cameras.map((cam) => (
              <div
                key={cam.id}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#020617] p-2 transition-all hover:border-sky-400/40"
              >
                <div className="mb-2 h-32 rounded-lg border border-white/[0.04] bg-slate-900/50 flex items-center justify-center">
                   <div className="size-8 rounded-full border-2 border-white/5 flex items-center justify-center">
                     <div className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                   </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="font-mono text-[10px] font-bold text-slate-400">{cam.id}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      cam.quality === 'Offline'
                        ? 'bg-rose-500/10 text-rose-400'
                        : cam.quality === 'SD'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {cam.quality}
                  </span>
                </div>
                <p className="mt-2 px-1 text-[13px] font-bold text-slate-900 dark:text-white">
                  {cam.vehicle}
                </p>
                <p className="mt-0.5 px-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {cam.label}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Playback Queue">
          <div className="space-y-2">
            {cameras.slice(0, 5).map((cam, idx) => (
              <div
                key={`${cam.id}-q`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 transition-all hover:bg-white/[0.06]"
              >
                <p className="font-bold text-slate-900 dark:text-white">
                  {cam.vehicle} · incident review
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {String(8 + idx).padStart(2, '0')}:15 - {String(8 + idx).padStart(2, '0')}:30
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}

function UsersPage() {
  const users = [
    { u: 'jaxicloudk', r: 'Admin', s: 'Active', mfa: 'Enabled', scope: 'Global' },
    { u: 'ops_controller_1', r: 'Dispatch', s: 'Active', mfa: 'Enabled', scope: 'North region' },
    { u: 'read_only_auditor', r: 'Audit', s: 'Invited', mfa: 'Pending', scope: 'Compliance' },
    { u: 'fleet_supervisor', r: 'Supervisor', s: 'Active', mfa: 'Enabled', scope: 'All depots' },
  ]
  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card title="Users & Permissions" subtitle="Role matrix aligned with legacy account management">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                <th className="pb-2 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                <th className="pb-2 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                <th className="pb-2 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Scope</th>
                <th className="pb-2 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">MFA</th>
                <th className="pb-2 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.u} className="border-b border-slate-100 dark:border-white/[0.04]">
                  <td className="py-2 font-mono font-bold text-blue-600 dark:text-sky-300">{row.u}</td>
                  <td className="py-2 font-bold text-slate-500 dark:text-slate-400">{row.r}</td>
                  <td className="py-2 font-bold text-slate-500 dark:text-slate-400">{row.scope}</td>
                  <td className="py-2 font-bold text-slate-500 dark:text-slate-400">{row.mfa}</td>
                  <td className="py-2 font-bold text-slate-500 dark:text-slate-400">{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Access Events">
          <div className="space-y-2 text-xs">
            {[
              'ops_controller_1 signed in from HQ',
              'new invite sent to compliance observer',
              'role update: fleet_supervisor -> Supervisor',
              'password reset enforced for inactive user',
            ].map((msg) => (
              <div
                key={msg}
                className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2 font-bold text-slate-500 transition-all hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                {msg}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}

function categoryFirmware(category: UnitCategory): string {
  if (category === 'Refrigerated') return 'v4.8.2-rf'
  if (category === 'Trailers') return 'v3.2.9-tr'
  if (category === 'Tippers') return 'v5.1.0-tp'
  return 'v4.0.6-trk'
}

function UnitsPage() {
  const { fleet } = useMockFleet()
  const unitRows = useMemo(
    () =>
      fleet.map((v, idx) => ({
        imei: `359${(420000000 + idx * 12345).toString()}`,
        fw: categoryFirmware(v.unit_category),
        lastAck: `${idx + 1}m ago`,
        voltage: (12.1 + (idx % 5) * 0.3).toFixed(1),
        vehicle: v,
      })),
    [fleet],
  )

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card title="Units Diagnostic Board" subtitle="Telematics health, pairing and firmware compliance">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.06]">
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">IMEI</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Firmware</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Voltage</th>
                  <th className="pb-3 pr-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Ack</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Satellite</th>
                </tr>
              </thead>
              <tbody>
                {unitRows.slice(0, 14).map((row) => (
                  <tr key={row.imei} className="border-b border-slate-100 dark:border-white/[0.04]">
                    <td className="py-3 pr-3 font-mono font-bold text-blue-600 dark:text-sky-300">{row.imei}</td>
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">
                      {row.vehicle.vehicle_id} · <span className="text-slate-500 dark:text-slate-400 font-bold">{row.vehicle.unit_category}</span>
                    </td>
                    <td className="py-3 pr-3 font-mono font-bold text-slate-500 dark:text-slate-400">{row.fw}</td>
                    <td className="py-3 pr-3 font-black tabular-nums text-slate-900 dark:text-white">{row.voltage}V</td>
                    <td className="py-3 pr-3 font-bold text-slate-500 dark:text-slate-400">{row.lastAck}</td>
                    <td className={`py-3 font-black tracking-widest text-[10px] ${satTone(row.vehicle.satellite_status)}`}>
                      {row.vehicle.satellite_status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Pending Unit Actions">
          <div className="space-y-2 text-xs">
            {[
              '2 units need firmware patch rollout',
              '1 unit has weak GNSS lock after 15m',
              '3 units pending reassignment to trailers',
              'SIM sync refresh scheduled at 23:00',
            ].map((msg) => (
              <div
                key={msg}
                className="rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2 font-bold text-slate-500 transition-all hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
              >
                {msg}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}


function AlertsPage() {
  const dispatch = useAppDispatch()
  const { alerts } = useMockFleet()
  const top = useMemo(
    () =>
      [...alerts]
        .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
        .slice(0, 6),
    [alerts],
  )
  const high = top.filter((a) => a.severity === 'High').length
  const med = top.filter((a) => a.severity === 'Medium').length

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <div className="h-[560px]">
          <AlertsTableWidget widgetId="page.alerts.table" />
        </div>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Incident response lane" subtitle="Action cards from live alert feed">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <MiniStat label="High priority" value={`${high}`} tone="danger" />
            <MiniStat label="Medium priority" value={`${med}`} />
          </div>
          <div className="space-y-2">
            {top.map((item) => (
              <button
                key={item.alert_id}
                type="button"
                className="no-drag w-full rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-left transition-colors hover:border-cyan-500/40 border-cyan-400/25 bg-white/[0.02]/70 hover:border-cyan-400/45"
                onClick={() => dispatch(focusVehicle(item.vehicle_id))}
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.message}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {item.vehicle_id} · {item.severity} ·{' '}
                  <span className="text-blue-600 dark:text-sky-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}

function TasksPage() {
  const { fleet, alerts } = useMockFleet()
  const openActions = alerts
    .filter((a) => a.severity !== 'Low')
    .slice(0, 10)
    .map((alert, index) => ({
      id: `TASK-${String(index + 1).padStart(3, '0')}`,
      title: alert.message,
      owner: `Ops ${((index % 4) + 1).toString()}`,
      vehicle: alert.vehicle_id,
      due: `${4 + (index % 5)}h`,
      priority: alert.severity,
    }))
  const driversAtLimit = fleet
    .filter((v) => v.hours_driven_today >= 7)
    .slice(0, 6)

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Card
          title="Operations task matrix"
          subtitle="Priority action items derived from mission-critical alerts"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {openActions.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500">{task.id}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-400/20'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-400/20'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {task.title}
                </p>
                <p className="mt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {task.vehicle} · {task.owner} · <span className="text-blue-600 dark:text-sky-400">Due {task.due}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Compliance watch">
          <div className="space-y-2">
            {driversAtLimit.map((driver) => (
              <div
                key={driver.vehicle_id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">{driver.driver_name}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {driver.vehicle_id} · <span className="text-amber-600 dark:text-amber-400">{driver.hours_driven_today.toFixed(1)}h today</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}

function ReportsPage() {
  const { trips, fleet } = useMockFleet()
  const palette = useChartPalette()
  const trend = getLastNDaysTrips(trips, 14)
    .map((row) => ({
      day: new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mileage: row.total_fleet_mileage,
      co2: row.co2_emissions_tons,
    }))
  const reportCards = [
    { title: 'Fleet utilization report', period: 'Last 7 days', status: 'Ready' },
    { title: 'Fuel efficiency benchmark', period: 'Last 30 days', status: 'Ready' },
    { title: 'Driver compliance log', period: 'Current month', status: 'Draft' },
  ]

  return (
    <section className="grid gap-4 xl:grid-cols-12">
      <div className="space-y-4 xl:col-span-8">
        <Card title="Analytics stream" subtitle="Fleet-wide metrics synthesized from historical mission data">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={palette.tick} tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis yAxisId="left" stroke={palette.tick} tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis yAxisId="right" orientation="right" stroke={palette.tick} tick={{ fontSize: 11, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    background: palette.tooltipBg,
                    borderColor: palette.tooltipBorder,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="mileage" stroke={palette.bar} strokeWidth={3} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="co2" stroke={palette.line} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="space-y-4 xl:col-span-4">
        <Card title="Report center">
          <div className="space-y-2">
            {reportCards.map((report) => (
              <div
                key={report.title}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {report.title}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {report.period}
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-sky-400">
                  {report.status}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Executive Insight">
          <p className="text-[11px] font-bold leading-relaxed text-slate-400 uppercase tracking-wide">
            Automated intelligence reports generated from real-time telematics.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniStat label="Assets" value={`${fleet.length}`} />
            <MiniStat label="Trip logs" value={`${trips.length}`} />
          </div>
        </Card>
      </div>
    </section>
  )
}

export function OperationsPageContent({ activeTab }: { activeTab: AppTab }) {
  switch (activeTab) {
    case 'Monitoring':
      return <MonitoringWorkspace />
    case 'Notifications':
      return <AlertsPage />
    case 'Reports':
      return <ReportsPage />
    case 'Tasks':
      return <TasksPage />
    case 'Tracks':
      return <TracksPage />
    case 'Drivers':
      return <DriversPage />
    case 'Video':
      return <VideoPage />
    case 'Users':
      return <UsersPage />
    case 'Units':
      return <UnitsPage />
    case 'Dashboard':
    default:
      return null
  }
}
