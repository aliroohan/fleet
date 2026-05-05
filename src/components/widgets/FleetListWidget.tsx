import { FleetListPanel } from '../FleetListPanel'
import { WidgetChrome } from './WidgetChrome'

export function FleetListWidget({ widgetId }: { widgetId: string }) {
  return (
    <WidgetChrome title="Fleet list" subtitle="Search, filters, grouped units">
      <div className="flex h-full min-h-0 flex-col">
        <FleetListPanel />
        <p className="mt-1 shrink-0 px-1 text-[10px] text-slate-400">
          ID · {widgetId}
        </p>
      </div>
    </WidgetChrome>
  )
}
