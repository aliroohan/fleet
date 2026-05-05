import { useMemo, useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { focusVehicle } from '../../store/uiSlice'
import type { AlertLogRow } from '../../types/fleet'
import { useMockFleet } from '../../hooks/useMockFleet'
import { WidgetChrome } from './WidgetChrome'

type SortKey = 'time' | 'severity'
const rank: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

export function AlertsTableWidget(_props: { widgetId?: string }) {
  const { alerts, loading } = useMockFleet()
  const dispatch = useAppDispatch()
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({
    key: 'time',
    dir: 'desc',
  })

  const rows = useMemo(() => {
    const copy = [...alerts]
    copy.sort((a, b) => {
      if (sort.key === 'severity') {
        const ra = rank[a.severity] ?? 9
        const rb = rank[b.severity] ?? 9
        return sort.dir === 'asc' ? ra - rb : rb - ra
      }
      const ta = new Date(a.timestamp).getTime()
      const tb = new Date(b.timestamp).getTime()
      return sort.dir === 'asc' ? ta - tb : tb - ta
    })
    return copy.slice(0, 50)
  }, [alerts, sort])

  function toggle(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' },
    )
  }

  return (
    <WidgetChrome title="Alarms & Faults" subtitle="Latest mock alerts — click a row to focus vehicle">
      {loading ? (
        <div className="flex items-center gap-2 p-4">
          <span className="size-2.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      ) : (
        <div className="h-full overflow-auto rounded-xl border border-slate-100 bg-white dark:border-white/[0.04] dark:bg-white/[0.01]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-[1] border-b border-slate-100 bg-slate-50 dark:border-white/[0.06] dark:bg-[#061028]/95 dark:backdrop-blur-md">
              <tr>
                <th className="p-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Vehicle
                </th>
                <th className="p-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    className="no-drag rounded-lg px-2 py-1 text-left text-inherit transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.06] dark:hover:text-cyan-300"
                    onClick={() => toggle('severity')}
                  >
                    Severity {sort.key === 'severity' ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </th>
                <th className="p-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Message
                </th>
                <th className="p-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    className="no-drag rounded-lg px-2 py-1 text-left text-inherit transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-white/[0.06] dark:hover:text-cyan-300"
                    onClick={() => toggle('time')}
                  >
                    Time {sort.key === 'time' ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: AlertLogRow) => (
                <tr
                  key={r.alert_id}
                  className="cursor-pointer border-t border-slate-100 transition-all duration-200 hover:bg-blue-50/80 hover:shadow-[inset_4px_0_0_0_rgb(37_99_235)] dark:border-white/[0.03] dark:hover:bg-gradient-to-r dark:hover:from-sky-500/[0.1] dark:hover:to-transparent dark:hover:shadow-[inset_4px_0_0_0_rgb(34_211_238)]"
                  onClick={() => dispatch(focusVehicle(r.vehicle_id))}
                >
                  <td className="p-3 text-[13px] font-black text-blue-600 dark:text-sky-300">
                    {r.vehicle_id}
                  </td>
                  <td className="p-3">
                    <SeverityPill s={r.severity} />
                  </td>
                  <td className="p-3 text-[13px] font-medium text-slate-800 dark:text-slate-200">{r.message}</td>
                  <td className="whitespace-nowrap p-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {new Date(r.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading ? (
        <p className="mt-2 shrink-0 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          Sync Status · Operational
        </p>
      ) : null}
    </WidgetChrome>
  )
}

function SeverityPill({ s }: { s: AlertLogRow['severity'] }) {
  const cls =
    s === 'High'
      ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:ring-rose-400/30'
      : s === 'Medium'
        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-400/30'
        : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:ring-white/[0.1]'
  return (
    <span className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {s}
    </span>
  )
}
