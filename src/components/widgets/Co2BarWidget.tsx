import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getWeeklyCo2VsTarget } from '../../data/fleetData'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useChartPalette } from '../../lib/chartTheme'
import { WidgetChrome } from './WidgetChrome'

export function Co2BarWidget({ widgetId }: { widgetId: string }) {
  const { trips, loading } = useMockFleet()
  const palette = useChartPalette()
  const rows = getWeeklyCo2VsTarget(trips, 5)

  return (
    <WidgetChrome
      title="Weekly CO₂"
      subtitle="Sum vs weekly target (mock KPI)"
    >
      {loading ? (
        <p className="p-4 text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
              <XAxis dataKey="label" tick={{ fill: palette.tick }} fontSize={11} />
              <YAxis tick={{ fill: palette.tick }} fontSize={11} unit=" t" />
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
              <Bar
                dataKey="co2"
                name="CO₂ (tons)"
                fill={palette.bar}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                name="Target"
                fill={palette.bar2}
                radius={[4, 4, 0, 0]}
                opacity={0.55}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-1 shrink-0 px-1 text-[10px] text-slate-400">ID · {widgetId}</p>
        </>
      )}
    </WidgetChrome>
  )
}
