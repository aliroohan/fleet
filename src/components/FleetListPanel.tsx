import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Snowflake, Truck, Container, HardHat, ChevronDown, ChevronRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { focusVehicle, setHover } from '../store/uiSlice'
import type { FleetVehicle, UnitCategory } from '../types/fleet'
import { useMockFleet } from '../hooks/useMockFleet'
import type { ComponentType } from 'react'

const CATEGORY_ORDER: UnitCategory[] = [
  'Refrigerated',
  'Trucks',
  'Trailers',
  'Tippers',
]

const CATEGORY_ICONS: Record<UnitCategory, ComponentType<{ className?: string; size?: number }>> = {
  Refrigerated: Snowflake,
  Trucks: Truck,
  Trailers: Container,
  Tippers: HardHat,
}

const CATEGORY_COLORS: Record<UnitCategory, string> = {
  Refrigerated: 'text-sky-500 dark:text-sky-400',
  Trucks: 'text-blue-600 dark:text-blue-400',
  Trailers: 'text-amber-600 dark:text-amber-400',
  Tippers: 'text-orange-600 dark:text-orange-400',
}

/** Fleet list body — used inside the draggable "Fleet list" widget */
export function FleetListPanel() {
  const { fleet, loading } = useMockFleet()
  const dispatch = useAppDispatch()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return fleet
    return fleet.filter(
      (v) =>
        v.vehicle_id.toLowerCase().includes(q) ||
        v.driver_name.toLowerCase().includes(q) ||
        v.unit_category.toLowerCase().includes(q),
    )
  }, [fleet, query])

  const groups = useMemo(() => {
    const map = new Map<UnitCategory, FleetVehicle[]>()
    for (const c of CATEGORY_ORDER) map.set(c, [])
    for (const v of filtered) {
      const list = map.get(v.unit_category) ?? []
      list.push(v)
      map.set(v.unit_category, list)
    }
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: map.get(cat) ?? [],
    }))
  }, [filtered])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Search */}
      <div className="shrink-0 border-b border-slate-200 pb-3 dark:border-white/[0.06]">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="search"
              placeholder="Search fleet…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-cyan-400/30 dark:focus:ring-1 dark:focus:ring-cyan-400/20"
            />
          </div>
          <button
            type="button"
            className="no-drag flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-cyan-400/20 dark:hover:text-cyan-300"
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Fleet list */}
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex items-center gap-2 p-3">
            <span className="size-2.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
            <p className="text-sm text-slate-500">Loading fleet…</p>
          </div>
        ) : (
          groups.map(({ category, items }) => {
            const CatIcon = CATEGORY_ICONS[category]
            const catColor = CATEGORY_COLORS[category]
            const isCollapsed = collapsed[category]

            return (
              <section key={category} className="mb-3">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="mb-2 flex w-full items-center gap-2 px-1 text-[12px] font-bold tracking-[0.1em] text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  <CatIcon size={16} className={catColor} />
                  {category}
                  <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.05] dark:font-mono dark:text-[9px]">
                    {items.length}
                  </span>
                </button>
                {!isCollapsed && (
                  <ul className="space-y-1">
                    {items.map((v) => (
                      <li key={v.vehicle_id}>
                        <button
                          type="button"
                          onClick={() => dispatch(focusVehicle(v.vehicle_id))}
                          onMouseEnter={(e) => {
                            dispatch(setHover({ id: v.vehicle_id, x: e.clientX, y: e.clientY }))
                            dispatch(focusVehicle(v.vehicle_id))
                          }}
                          onMouseMove={(e) => {
                            dispatch(setHover({ id: v.vehicle_id, x: e.clientX, y: e.clientY }))
                          }}
                          onMouseLeave={() => dispatch(setHover({ id: null }))}
                          className={`no-drag relative flex w-full flex-col rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                            focusedId === v.vehicle_id
                              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 dark:bg-sky-400 dark:text-sky-950'
                              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-black tracking-tight ${
                                focusedId === v.vehicle_id ? 'text-white dark:text-sky-950' : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {v.vehicle_id}
                            </span>
                            <span
                              className={`inline-flex size-2 rounded-full ${
                                v.status === 'Active'
                                  ? 'bg-emerald-400 jc-status-dot-active'
                                  : v.status === 'Resting'
                                    ? 'bg-sky-200'
                                    : 'bg-amber-400'
                              } ${focusedId === v.vehicle_id ? 'ring-2 ring-white/30' : ''}`}
                            />
                          </div>
                          <span
                            className={`mt-0.5 text-[11px] font-bold ${
                              focusedId === v.vehicle_id
                                ? 'text-sky-50/80 dark:text-sky-900/80'
                                : 'text-slate-500 dark:text-slate-500'
                            }`}
                          >
                            {v.driver_name} · {v.status}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })
        )}
      </div>

      {/* Clear button */}
      <div className="shrink-0 border-t border-slate-200 pt-2.5 dark:border-white/[0.06]">
        <button
          type="button"
          className="no-drag w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-blue-500/10 dark:text-cyan-300 dark:shadow-none dark:hover:from-cyan-500/30 dark:hover:to-blue-500/20"
          onClick={() => dispatch(focusVehicle(null))}
        >
          Clear selection
        </button>
      </div>

    </div>
  )
}
