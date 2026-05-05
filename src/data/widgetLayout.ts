import type { WidgetType } from '../types/widgets'

/** Grid placement rules (12-column grid). Pixel width scales with container automatically. */
export type WidgetConstraints = {
  w: number
  h: number
  minW: number
  minH: number
  maxW: number
  maxH: number
}

export function getWidgetConstraints(type: WidgetType): WidgetConstraints {
  switch (type) {
    case 'kpiStrip':
      return { w: 12, h: 8, minW: 6, minH: 4, maxW: 12, maxH: 14 }
    case 'fleetList':
      return { w: 3, h: 16, minW: 2, minH: 10, maxW: 6, maxH: 32 }
    case 'fleetMap':
      return { w: 6, h: 14, minW: 4, minH: 10, maxW: 12, maxH: 32 }
    case 'operationalOverview':
      return { w: 3, h: 16, minW: 2, minH: 10, maxW: 6, maxH: 32 }
    case 'gauge':
      return { w: 3, h: 10, minW: 2, minH: 6, maxW: 6, maxH: 18 }
    case 'co2Bar':
      return { w: 5, h: 10, minW: 3, minH: 6, maxW: 12, maxH: 18 }
    case 'utilizationLine':
      return { w: 4, h: 10, minW: 3, minH: 6, maxW: 12, maxH: 18 }
    case 'alertsTable':
      return { w: 6, h: 12, minW: 4, minH: 8, maxW: 12, maxH: 28 }
    default: {
      const _e: never = type
      return _e
    }
  }
}
