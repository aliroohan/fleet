import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts'
import { averageFuelPercent } from '../../data/fleetData'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useChartPalette } from '../../lib/chartTheme'
import { WidgetChrome } from './WidgetChrome'

export function GaugeWidget({ widgetId }: { widgetId: string }) {
  const { fleet, loading } = useMockFleet()
  const palette = useChartPalette()
  const avg = averageFuelPercent(fleet)
  const data = [{ name: 'fuel', value: Math.min(100, avg), fill: '#22d3ee' }]

  return (
    <WidgetChrome title="Fleet Fuel" subtitle="Average level across all vehicles">
      {loading ? (
        <div className="flex items-center gap-2 p-4">
          <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadialBarChart
                innerRadius="68%"
                outerRadius="100%"
                data={data}
                startAngle={180}
                endAngle={0}
                cx="50%"
                cy="70%"
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: palette.muted }}
                  dataKey="value"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-4xl font-bold tabular-nums text-blue-600 dark:bg-gradient-to-r dark:from-white dark:to-cyan-200 dark:bg-clip-text dark:text-transparent">
            {avg}%
          </p>
          <p className="mt-1 text-[11px] text-slate-400 dark:font-mono dark:text-[10px] dark:text-slate-500">
            {widgetId}
          </p>
        </div>
      )}
    </WidgetChrome>
  )
}
