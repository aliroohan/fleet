import type { LayoutItem } from 'react-grid-layout'
import type { WidgetType } from '../types/widgets'
import { getWidgetConstraints } from '../data/widgetLayout'

const COLS = 12

function maxWidthForItem(item: LayoutItem, widgets: Record<string, WidgetType>): number {
  const type = widgets[item.i]
  if (!type) return COLS
  return getWidgetConstraints(type).maxW
}

function growSlackOnRow(rowItems: LayoutItem[], widgets: Record<string, WidgetType>): void {
  if (rowItems.length === 0) return

  const sorted = [...rowItems].sort((a, b) => a.x - b.x)
  const typed = sorted.filter((it) => widgets[it.i])

  const totalW = sorted.reduce((s, it) => s + it.w, 0)
  let slack = COLS - totalW

  if (slack > 0 && typed.length === 1) {
    const it = typed[0]
    const cap = maxWidthForItem(it, widgets)
    const grow = Math.min(slack, Math.max(0, cap - it.w))
    it.w += grow
  } else if (slack > 0 && typed.length > 1) {
    const growth = typed.map((it) => ({
      it,
      headroom: Math.max(0, maxWidthForItem(it, widgets) - it.w),
    }))
    while (slack > 0 && growth.some((g) => g.headroom > 0)) {
      const active = growth.filter((g) => g.headroom > 0)
      const step = Math.max(1, Math.ceil(slack / active.length))
      for (const g of active) {
        const add = Math.min(step, g.headroom, slack)
        g.it.w += add
        g.headroom -= add
        slack -= add
        if (slack <= 0) break
      }
    }
  }

  let x = 0
  for (const it of sorted) {
    it.x = x
    x += it.w
  }
}

/**
 * For each grid row (same `y`), if columns sum to less than 12, widen tiles up to their maxW
 * so the row uses the full width (fluid columns).
 */
export function balanceLayoutWidths(
  layout: LayoutItem[],
  widgets: Record<string, WidgetType>,
): LayoutItem[] {
  const next = layout.map((l) => ({ ...l }))
  const byY = new Map<number, LayoutItem[]>()

  for (const item of next) {
    const row = byY.get(item.y) ?? []
    row.push(item)
    byY.set(item.y, row)
  }

  for (const [, row] of byY) {
    growSlackOnRow(row, widgets)
  }

  return next
}
