import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getLastNDaysTrips } from '../../data/fleetData'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useChartPalette } from '../../lib/chartTheme'
import { WidgetChrome } from './WidgetChrome'

export function UtilizationLineWidget({ widgetId }: { widgetId: string }) {
  const { trips, loading } = useMockFleet()
  const palette = useChartPalette()
  const last30 = getLastNDaysTrips(trips, 30)
  const maxActive = Math.max(
    1,
    ...last30.map((t) => t.active_vehicles_count),
  )
  const data = last30.map((t) => ({
    date: t.date.slice(5),
    utilization: Math.round((t.active_vehicles_count / maxActive) * 1000) / 10,
    active: t.active_vehicles_count,
  }))

  return (
    <WidgetChrome
      title="Fleet utilization"
      subtitle="Last 30 days (normalized from active vehicles)"
    >
      {loading ? (
        <p className="p-4 text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis dataKey="date" tick={{ fill: palette.tick }} fontSize={10} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: palette.tick }}
                fontSize={11}
                unit=" %"
              />
              <Tooltip
                contentStyle={{
                  background: palette.tooltipBg,
                  border: `1px solid ${palette.tooltipBorder}`,
                  borderRadius: 8,
                }}
                labelStyle={{ color: palette.label }}
                itemStyle={{ color: palette.tooltipItem }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="utilization"
                name="Utilization %"
                stroke={palette.line}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-1 shrink-0 px-1 text-[10px] text-slate-400">ID · {widgetId}</p>
        </>
      )}
    </WidgetChrome>
  )
}
