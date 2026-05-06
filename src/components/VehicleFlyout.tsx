import {
  Truck,
  Snowflake,
  Container,
  HardHat,
  X,
  Gauge,
  Fuel,
  Clock,
  Briefcase,
  BedDouble,
  Satellite,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useMockFleet } from '../hooks/useMockFleet'
import { buildVehicleContext } from '../data/vehicleContext'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { closeFlyout } from '../store/uiSlice'
import type { UnitCategory } from '../types/fleet'

const CATEGORY_ICONS: Record<UnitCategory, ComponentType<{ className?: string; size?: number }>> = {
  Refrigerated: Snowflake,
  Trucks: Truck,
  Trailers: Container,
  Tippers: HardHat,
}

export function VehicleFlyout() {
  const id = useAppSelector((s) => s.ui.selectedVehicleId)
  const dispatch = useAppDispatch()
  const { fleet, trips, alerts, loading } = useMockFleet()

  if (!id) return null

  const ctx = buildVehicleContext(id, fleet, trips, alerts)
  const v = ctx.vehicle

  const VehicleIcon = v ? CATEGORY_ICONS[v.unit_category] : Truck

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm dark:bg-[#030a1a]/60"
        aria-label="Close panel"
        onClick={() => dispatch(closeFlyout())}
      />
      <aside className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-white/[0.06] dark:bg-[#061028]/98 dark:shadow-[0_0_60px_rgba(0,0,0,0.6)] dark:backdrop-blur-xl">
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.06]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-500 dark:text-cyan-400/60">
              Vehicle Context
            </p>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {id}
            </h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-cyan-400/20 dark:hover:text-cyan-300"
            onClick={() => dispatch(closeFlyout())}
          >
            <X size={14} />
            Close
          </button>
        </header>

        {loading ? (
          <div className="flex items-center gap-2 p-5">
            <span className="size-2.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
            <p className="text-sm text-slate-500">Loading…</p>
          </div>
        ) : !v ? (
          <p className="p-5 text-sm text-amber-600 dark:text-amber-300">
            No mock row found for this id.
          </p>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {/* Vehicle image/icon area matching reference */}
            <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 ring-1 ring-blue-200 dark:from-cyan-500/20 dark:to-blue-600/10 dark:ring-cyan-400/20 overflow-hidden">
                {v.image_url ? (
                  <img src={v.image_url} alt={v.vehicle_id} className="h-full w-full object-cover" />
                ) : (
                  <VehicleIcon size={40} className="text-blue-600 dark:text-cyan-200" />
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{v.vehicle_id}</p>
                <p className="text-sm text-slate-500">{v.unit_category}</p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Driver: {v.driver_name}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {[
                { label: 'Status', value: v.status, Icon: Clock },
                { label: 'Speed', value: `${v.speed_kmh} km/h`, Icon: Gauge },
                { label: 'Fuel', value: `${v.fuel_level_percent}%`, Icon: Fuel },
                { label: 'Hours today', value: `${v.hours_driven_today} h`, Icon: Clock },
                { label: 'Working time', value: `${v.working_time_hours} h`, Icon: Briefcase },
                { label: 'Resting time', value: `${v.resting_time_hours} h`, Icon: BedDouble },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <item.Icon size={13} />
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-slate-800 dark:text-white">{item.value}</dd>
                </div>
              ))}
              <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Satellite size={13} />
                  Satellite
                </dt>
                <dd className="mt-1 text-base font-semibold capitalize text-slate-800 dark:text-white">{v.satellite_status}</dd>
              </div>
            </dl>

            <section className="mt-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Recent Trip Stats
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Last 7 days · aggregated from demo time series
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-center dark:border-white/[0.04] dark:bg-white/[0.02]">
                  <p className="text-xl font-bold tabular-nums text-blue-600 dark:text-cyan-300">{ctx.last7DaysMileage.toLocaleString()}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">km (7d)</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-center dark:border-white/[0.04] dark:bg-white/[0.02]">
                  <p className="text-xl font-bold tabular-nums text-blue-600 dark:text-cyan-300">{ctx.last7DaysCo2Tons}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">t CO₂ (7d)</p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Alerts for this Vehicle
              </h3>
              {ctx.alerts.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">None in mock log.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {ctx.alerts.slice(0, 8).map((a) => (
                    <li
                      key={a.alert_id}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3 text-sm dark:border-white/[0.04] dark:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          a.severity === 'High' ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20' :
                          a.severity === 'Medium' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20' :
                          'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-400/20'
                        }`}>
                          {a.severity}
                        </span>
                        <p className="font-medium text-slate-800 dark:text-white">{a.message}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-400 dark:font-mono dark:text-slate-500">
                        {new Date(a.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </aside>
    </>
  )
}
