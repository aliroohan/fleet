import { OperationalOverviewPanel } from '../OperationalOverviewPanel'
import { WidgetChrome } from './WidgetChrome'

export function OperationalOverviewWidget({ widgetId }: { widgetId: string }) {
  return (
    <WidgetChrome
      title="Operational overview"
      subtitle="Driver, health, connectivity, events"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <OperationalOverviewPanel />
        </div>
        <p className="mt-1 shrink-0 px-1 text-[10px] text-slate-400">
          ID · {widgetId}
        </p>
      </div>
    </WidgetChrome>
  )
}
