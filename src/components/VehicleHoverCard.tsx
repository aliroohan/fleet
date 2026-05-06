import { Truck, Snowflake, Container, HardHat } from 'lucide-react'
import type { ComponentType } from 'react'
import { buildVehicleContext } from '../data/vehicleContext'
import type { AlertLogRow, FleetVehicle, TripHistoryRow, UnitCategory, VehicleStatus } from '../types/fleet'

type Props = {
  vehicle: FleetVehicle
  trips: TripHistoryRow[]
  alerts: AlertLogRow[]
  compact?: boolean
}

const CATEGORY_ICONS: Record<UnitCategory, ComponentType<{ className?: string; size?: number }>> = {
  Refrigerated: Snowflake,
  Trucks: Truck,
  Trailers: Container,
  Tippers: HardHat,
}

function statusTone(s: VehicleStatus): string {
  if (s === 'Active') return 'bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25'
  if (s === 'Resting') return 'bg-sky-100 text-sky-700 ring-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/25'
  return 'bg-amber-100 text-amber-700 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25'
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 dark:border-white/[0.04] dark:bg-white/[0.03]">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-[12px] font-semibold text-slate-700 dark:text-cyan-100">{value}</p>
    </div>
  )
}

export function VehicleHoverCard({ vehicle, trips, alerts, compact = false }: Props) {
  const ctx = buildVehicleContext(vehicle.vehicle_id, [vehicle], trips, alerts)
  const latest = ctx.alerts[0]
  const VehicleIcon = CATEGORY_ICONS[vehicle.unit_category]

  return (
    <div
      className={`relative overflow-hidden rounded-xl text-left ${
        compact ? 'max-w-[300px]' : 'max-w-[340px]'
      }`}
    >
      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-purple-50/20 dark:from-cyan-500/8 dark:via-transparent dark:to-violet-500/6"
        aria-hidden
      />
      <div className={`relative border border-slate-200 bg-white shadow-xl rounded-xl dark:border-sky-500/20 dark:bg-[#020617] dark:shadow-none ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start gap-3">
          {/* Vehicle icon */}
          <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-400/20 overflow-hidden ${compact ? 'size-10' : 'size-12'}`}>
            {vehicle.image_url ? (
              <img src={vehicle.image_url} alt={vehicle.vehicle_id} className="h-full w-full object-cover" />
            ) : (
              <VehicleIcon size={compact ? 20 : 24} className="text-sky-600 dark:text-sky-300" />
            )}
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div>
              <p className={`${compact ? 'text-sm' : 'text-base'} font-black tracking-tight text-slate-900 dark:text-white leading-none`}>
                {vehicle.vehicle_id}
              </p>
              <p className="mt-1 truncate text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-none">
                {vehicle.unit_category}
              </p>
            </div>
            <div>
              <p className={`${compact ? 'text-sm' : 'text-base'} font-black tracking-tight text-slate-900 dark:text-white leading-none`}>
                {vehicle.driver_name}
              </p>
              <p className="mt-1 truncate text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-none">
                Driver
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ring-1 ${statusTone(vehicle.status)}`}
          >
            {vehicle.status}
          </span>
        </div>

        <div
          className={`mt-3 grid gap-1.5 ${compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}
        >
          <Stat label="Speed" value={`${vehicle.speed_kmh}`} />
          <Stat label="Fuel" value={`${vehicle.fuel_level_percent}%`} />
          <Stat label="Shift" value={`${vehicle.hours_driven_today}h`} />
        </div>

        <div className={`mt-3 rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2.5 dark:border-white/[0.04] dark:bg-white/[0.02]`}>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Intelligence (7D)
          </p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] font-black text-slate-900 dark:text-white">
            <span>{ctx.last7DaysMileage.toLocaleString()} km</span>
            <span className="text-sky-600 dark:text-sky-400">{ctx.last7DaysCo2Tons} t</span>
          </div>
          <div className="mt-2 border-t border-slate-100 pt-2 dark:border-white/[0.04]">
            {latest ? (
              <p className="text-[10px] leading-tight">
                <span className={`font-black uppercase tracking-widest ${
                  latest.severity === 'High'
                    ? 'text-rose-500'
                    : latest.severity === 'Medium'
                      ? 'text-amber-500'
                      : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {latest.severity}:
                </span>
                <span className="ml-1 font-bold text-slate-700 dark:text-slate-300">{latest.message}</span>
              </p>
            ) : (
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic">Clean records</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
