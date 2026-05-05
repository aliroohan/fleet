import { KpiStrip } from '../KpiStrip'
import { WidgetChrome } from './WidgetChrome'

export function KpiStripWidget({ widgetId }: { widgetId: string }) {
  return (
    <WidgetChrome
      title="KPI summary"
      subtitle="Fleet snapshot · counts from mock data"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="max-h-[min(420px,60vh)] min-h-0 flex-1 overflow-y-auto">
          <KpiStrip embedded />
        </div>
        <p className="mt-1.5 shrink-0 px-1 font-mono text-[10px] text-slate-400/90 dark:text-slate-500">
          ID · {widgetId}
        </p>
      </div>
    </WidgetChrome>
  )
}
