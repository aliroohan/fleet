import { OperationalOverviewPanel } from '../OperationalOverviewPanel'
import { WidgetChrome } from './WidgetChrome'
import type { AppTab } from '../TopNav'

export function OperationalOverviewWidget({ 
  widgetId,
  onTabChange 
}: { 
  widgetId: string,
  onTabChange?: (tab: AppTab) => void
}) {
  return (
    <WidgetChrome
      title="Operational overview"
      subtitle="Driver, health, connectivity, events"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <OperationalOverviewPanel onTabChange={onTabChange} />
        </div>
        <p className="mt-1 shrink-0 px-1 text-[10px] text-slate-400">
          ID · {widgetId}
        </p>
      </div>
    </WidgetChrome>
  )
}
