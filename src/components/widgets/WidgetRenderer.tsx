import type { WidgetType } from '../../types/widgets'
import { AlertsTableWidget } from './AlertsTableWidget'
import { Co2BarWidget } from './Co2BarWidget'
import { FleetListWidget } from './FleetListWidget'
import { FleetMapWidget } from './FleetMapWidget'
import { GaugeWidget } from './GaugeWidget'
import { KpiStripWidget } from './KpiStripWidget'
import { OperationalOverviewWidget } from './OperationalOverviewWidget'
import { UtilizationLineWidget } from './UtilizationLineWidget'

import type { AppTab } from '../TopNav'

export function WidgetRenderer({
  id,
  type,
  onTabChange,
}: {
  id: string
  type: WidgetType
  onTabChange?: (tab: AppTab) => void
}) {
  switch (type) {
    case 'kpiStrip':
      return <KpiStripWidget widgetId={id} />
    case 'fleetList':
      return <FleetListWidget widgetId={id} />
    case 'fleetMap':
      return <FleetMapWidget widgetId={id} />
    case 'operationalOverview':
      return <OperationalOverviewWidget widgetId={id} onTabChange={onTabChange} />
    case 'gauge':
      return <GaugeWidget widgetId={id} />
    case 'co2Bar':
      return <Co2BarWidget widgetId={id} />
    case 'utilizationLine':
      return <UtilizationLineWidget widgetId={id} />
    case 'alertsTable':
      return <AlertsTableWidget widgetId={id} />
    default:
      return null
  }
}
