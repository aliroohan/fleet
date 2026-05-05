import { useCallback, useMemo } from 'react'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout/legacy'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  removeWidget,
  setLayout,
} from '../store/dashboardSlice'
import type { Layout } from 'react-grid-layout'
import { getWidgetConstraints } from '../data/widgetLayout'
import { balanceLayoutWidths } from '../lib/balanceLayout'
import { WidgetRenderer } from './widgets/WidgetRenderer'

const GridLayoutWithWidth = WidthProvider(ReactGridLayout)

export function DashboardGrid() {
  const dispatch = useAppDispatch()
  const layout = useAppSelector((s) => s.dashboard.layout)
  const widgets = useAppSelector((s) => s.dashboard.widgets)
  const editMode = useAppSelector((s) => s.dashboard.editMode)

  const layoutForGrid = useMemo(
    () =>
      layout.map((item) => {
        const type = widgets[item.i]
        if (!type) return item
        const c = getWidgetConstraints(type)
        return {
          ...item,
          minW: c.minW,
          minH: c.minH,
          maxW: c.maxW,
          maxH: c.maxH,
        }
      }),
    [layout, widgets],
  )

  const finalizeLayout = useCallback(
    (next: Layout) => {
      dispatch(setLayout(balanceLayoutWidths([...next], widgets)))
    },
    [dispatch, widgets],
  )

  function onLayoutChange(next: Layout) {
    dispatch(setLayout([...next]))
  }

  return (
    <GridLayoutWithWidth
      className="layout"
      layout={layoutForGrid}
      cols={12}
      rowHeight={28}
      margin={[10, 10]}
      containerPadding={[0, 0]}
      onLayoutChange={onLayoutChange}
      onDragStop={(next) => finalizeLayout(next)}
      onResizeStop={(next) => finalizeLayout(next)}
      isDraggable={editMode}
      isResizable={editMode}
      draggableCancel=".no-drag"
      compactType="vertical"
      useCSSTransforms
    >
      {layoutForGrid.map((item) => {
        const type = widgets[item.i]
        if (!type) return null
        return (
          <div
            key={item.i}
            className="relative overflow-hidden rounded-2xl bg-transparent"
          >
            <div className="relative z-0 h-full">
              <WidgetRenderer id={item.i} type={type} />
            </div>
            {editMode ? (
              <button
                type="button"
                className="no-drag absolute top-3 right-3 z-10 rounded-lg border border-rose-200 bg-white/90 px-3 py-1 text-[10px] font-black text-rose-600 shadow-lg shadow-rose-500/10 backdrop-blur transition-all hover:border-rose-300 hover:bg-rose-50 dark:border-rose-500/30 dark:bg-rose-950/90 dark:text-rose-300 dark:shadow-[0_0_16px_rgba(244,63,94,0.2)] dark:hover:border-rose-400/50 dark:hover:bg-rose-900/95 uppercase tracking-wider"
                onClick={() => dispatch(removeWidget(item.i))}
              >
                ✕ Remove
              </button>
            ) : null}
          </div>
        )
      })}
    </GridLayoutWithWidth>
  )
}
