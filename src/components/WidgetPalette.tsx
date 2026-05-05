import { useMemo } from 'react'
import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addWidget, removeWidget } from '../store/dashboardSlice'
import { setPaletteOpen } from '../store/uiSlice'
import {
  WIDGET_LABELS,
  WIDGET_TYPES,
  type WidgetType,
} from '../types/widgets'

function newWidgetId(type: WidgetType) {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`
}

export function WidgetPalette() {
  const open = useAppSelector((s) => s.ui.paletteOpen)
  const widgets = useAppSelector((s) => s.dashboard.widgets)
  const dispatch = useAppDispatch()

  const idsByType = useMemo(() => {
    const map = new Map<WidgetType, string[]>()
    for (const t of WIDGET_TYPES) map.set(t, [])
    for (const [id, t] of Object.entries(widgets)) {
      const list = map.get(t)
      if (list) list.push(id)
    }
    return map
  }, [widgets])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm dark:bg-[#030a1a]/50"
        aria-label="Close palette"
        onClick={() => dispatch(setPaletteOpen(false))}
      />
      <div className="fixed top-[4.5rem] right-4 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/[0.08] dark:bg-[#061028]/97 dark:shadow-[0_0_0_1px_rgb(34_211_238_/_0.06),0_32px_64px_-20px_rgb(0_0_0_/_0.7)] dark:backdrop-blur-xl">
        {/* Top accent line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-cyan-400/40"
          aria-hidden
        />
        <div className="flex items-center justify-between">
          <p className="text-base font-bold tracking-tight text-slate-800 dark:text-white">
            Widget Catalogue
          </p>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06] dark:hover:text-white"
            onClick={() => dispatch(setPaletteOpen(false))}
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Toggle tiles onto the customizable dashboard grid. Checked means at least one
          instance exists; duplicates are removed together when unchecked.
        </p>
        <ul className="mt-4 max-h-[min(70vh,28rem)] space-y-1.5 overflow-y-auto pr-1">
          {WIDGET_TYPES.map((t) => {
            const ids = idsByType.get(t) ?? []
            const present = ids.length > 0
            const inputId = `widget-palette-${t}`
            return (
              <li key={t}>
                <label
                  htmlFor={inputId}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3.5 text-sm transition-all ${
                    present
                      ? 'border-blue-300 bg-blue-50 shadow-sm dark:border-cyan-400/20 dark:bg-gradient-to-r dark:from-cyan-500/10 dark:via-transparent dark:to-transparent dark:shadow-[0_0_20px_-8px_rgb(34_211_238_/_0.3)]'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 dark:border-white/[0.05] dark:hover:border-white/[0.1] dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    className="no-drag mt-0.5 size-4 shrink-0 rounded border-slate-300 text-blue-500 accent-blue-500 focus:ring-blue-400 dark:border-slate-600 dark:text-cyan-500 dark:accent-cyan-500 dark:focus:ring-cyan-400"
                    checked={present}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (!present)
                          dispatch(addWidget({ type: t, id: newWidgetId(t) }))
                      } else {
                        for (const id of ids) {
                          dispatch(removeWidget(id))
                        }
                      }
                    }}
                  />
                  <span className="min-w-0 flex-1 leading-snug text-slate-700 dark:text-slate-200">
                    {WIDGET_LABELS[t]}
                    {ids.length > 1 ? (
                      <span className="mt-1 block text-[12px] font-normal text-amber-600 dark:text-amber-400">
                        ({ids.length} tiles — clearing removes every copy)
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
