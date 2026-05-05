import { useCallback, useMemo, useState } from 'react'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { focusVehicle, setHover } from '../../store/uiSlice'
import type { FleetVehicle, SatelliteStatus, VehicleStatus } from '../../types/fleet'


type SortMode = 'id' | 'status' | 'driver'

/** Left asset list patterned after legacy JAXICLOUD Monitoring */
export function MonitoringFleetSidebar({
  hiddenIds,
  onToggleOnMap,
}: {
  hiddenIds: Set<string>
  onToggleOnMap: (vehicleId: string) => void
}) {
  const { fleet, loading } = useMockFleet()
  const dispatch = useAppDispatch()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('id')
  const [tick, setTick] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base =
      q.length === 0
        ? fleet
        : fleet.filter(
            (v) =>
              v.vehicle_id.toLowerCase().includes(q) ||
              v.driver_name.toLowerCase().includes(q),
          )

    const copy = [...base]
    copy.sort((a, b) => {
      if (sortMode === 'status')
        return a.status.localeCompare(b.status) || a.vehicle_id.localeCompare(b.vehicle_id)
      if (sortMode === 'driver')
        return a.driver_name.localeCompare(b.driver_name) || a.vehicle_id.localeCompare(b.vehicle_id)
      return a.vehicle_id.localeCompare(b.vehicle_id)
    })
    return copy
  }, [fleet, query, sortMode])

  const onRefresh = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  return (
    <div className="relative flex h-full min-h-0 w-full shrink-0 flex-col border-r border-white/[0.06] bg-[#061028]/95 backdrop-blur-xl md:w-[min(100%,22rem)]">
      {/* Search & actions */}
      <div className="shrink-0 border-b border-white/[0.06] bg-white/[0.02] p-2.5">
        <div className="flex gap-1.5">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search units…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 pl-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            title="Add"
            className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <span className="text-lg font-light leading-none">+</span>
          </button>
          <button
            type="button"
            title="Refresh"
            onClick={onRefresh}
            className="flex size-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-cyan-300"
          >
            <RefreshIcon className="size-4" />
          </button>
          <button
            type="button"
            title="Sort"
            onClick={() =>
              setSortMode((m) =>
                m === 'id' ? 'status' : m === 'status' ? 'driver' : 'id',
              )
            }
            className="flex size-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-cyan-300"
          >
            <SortIcon className="size-4" />
          </button>
          <button
            type="button"
            title="Settings"
            className="ml-auto flex size-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-cyan-300"
          >
            <GearIcon className="size-4" />
          </button>
        </div>
        <p className="mt-2 font-mono text-[9px] text-slate-600">
          Sort: {sortMode} · Refresh #{tick}
        </p>
      </div>

      {/* Fleet list */}
      <div className="min-h-0 flex-1 divide-y divide-white/[0.04] overflow-y-auto">
        {loading ? (
          <div className="flex items-center gap-2 p-4">
            <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
            <p className="text-xs text-slate-500">Loading assets…</p>
          </div>
        ) : (
          filtered.map((v) => {
            const onMap = !hiddenIds.has(v.vehicle_id)
            return (
              <div
                key={v.vehicle_id}
                className={`flex items-start gap-2 px-2.5 py-2.5 text-left transition-colors hover:bg-white/[0.03] ${
                  focusedId === v.vehicle_id
                    ? 'bg-cyan-500/8'
                    : ''
                }`}
              >
                <label className="mt-1 flex cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={onMap}
                    onChange={() => onToggleOnMap(v.vehicle_id)}
                    className="size-3.5 rounded border-slate-600 text-cyan-500 accent-cyan-500"
                  />
                </label>
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
                  onClick={() => dispatch(focusVehicle(v.vehicle_id))}
                  onMouseEnter={(e) => {
                    dispatch(setHover({ id: v.vehicle_id, x: e.clientX, y: e.clientY }))
                    dispatch(focusVehicle(v.vehicle_id))
                  }}
                  onMouseMove={(e) => {
                    dispatch(setHover({ id: v.vehicle_id, x: e.clientX, y: e.clientY }))
                  }}
                  onMouseLeave={() => dispatch(setHover({ id: null }))}
                >
                  <div className="flex items-start gap-2">
                    <UnitGlyph category={v.unit_category} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight text-white">
                        {displayName(v)}
                      </p>
                      <RowStatusRail vehicle={v} />
                    </div>
                  </div>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-2.5 py-2.5">
        <p className="text-center font-mono text-[9px] text-slate-500">
          {filtered.filter((v) => !hiddenIds.has(v.vehicle_id)).length} / {filtered.length}{' '}
          on map
        </p>
      </div>

    </div>
  )
}

function displayName(v: FleetVehicle): string {
  return v.unit_category === 'Trailers'
    ? `Trailer · ${v.vehicle_id}`
    : v.unit_category === 'Trucks'
      ? `${v.vehicle_id}`
      : `${v.unit_category.slice(0, 4)} · ${v.vehicle_id}`
}

function UnitGlyph({ category }: { category: FleetVehicle['unit_category'] }) {
  return (
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-cyan-300">
      {category === 'Trailers' ? '🚛' : category === 'Tippers' ? '⛏️' : '🚚'}
    </span>
  )
}

function RowStatusRail({ vehicle }: { vehicle: FleetVehicle }) {
  const fuelLow = vehicle.fuel_level_percent < 35

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
      <MovementGlyph status={vehicle.status} />
      <span title="Satellite connectivity" className="font-mono text-[10px] tracking-tighter">
        {vehicle.satellite_status === 'connected' ? (
          <span className="text-emerald-400">███</span>
        ) : vehicle.satellite_status === 'weak' ? (
          <>
            <span className="text-emerald-400">██</span>
            <span className="text-amber-400">░</span>
          </>
        ) : (
          <span className="text-rose-400">░░░</span>
        )}{' '}
        <span className={`font-sans text-[9px] font-bold ${satelliteBars(vehicle.satellite_status).tone}`}>{satelliteBars(vehicle.satellite_status).label}</span>
      </span>
      <span className="inline-flex items-center gap-1 truncate" title="Driver">
        <span className="text-cyan-400">⏵</span>
        <span className="max-w-[120px] truncate">{vehicle.driver_name}</span>
      </span>
      <span title="Fuel (proxy for battery)" className="inline-flex items-center gap-0.5">
        <BatteryIcon warn={fuelLow} />
        <span className={fuelLow ? 'font-semibold text-amber-400' : ''}>
          {vehicle.fuel_level_percent}%
        </span>
      </span>
      <IgnitionGlyph active={vehicle.status === 'Active'} />
    </div>
  )
}

function MovementGlyph({ status }: { status: VehicleStatus }) {
  if (status === 'Active')
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400" title="Moving">
        <PlayIcon className="size-3.5" />
      </span>
    )
  return (
    <span className="inline-flex items-center gap-0.5 text-rose-400" title="Stopped">
      <StopIcon className="size-3.5" />
    </span>
  )
}

function satelliteBars(s: SatelliteStatus): {
  good: number
  weak: number
  label: string
  tone: string
} {
  if (s === 'connected') return { good: 3, weak: 0, label: 'OK', tone: 'text-emerald-400' }
  if (s === 'weak') return { good: 2, weak: 1, label: 'LOW', tone: 'text-amber-400' }
  return { good: 0, weak: 3, label: 'LOST', tone: 'text-rose-400' }
}

function IgnitionGlyph({ active }: { active: boolean }) {
  return (
    <span
      title={active ? 'Ignition on' : 'Ignition off'}
      className={`text-xs font-semibold ${active ? 'text-emerald-400' : 'text-slate-600'}`}
    >
      ●
    </span>
  )
}

function BatteryIcon({ warn }: { warn: boolean }) {
  return (
    <svg
      className={`size-3.5 ${warn ? 'text-amber-400' : 'text-slate-500'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 16H8a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1v1a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

function SortIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
