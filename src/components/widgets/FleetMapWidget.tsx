import { useAppSelector } from '../../store/hooks'
import { useMockFleet } from '../../hooks/useMockFleet'
import { FleetMapCore } from '../map/FleetMapCore'
import { WidgetChrome } from './WidgetChrome'

export function FleetMapWidget({ widgetId }: { widgetId: string }) {
  const { fleet, loading } = useMockFleet()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)

  return (
    <WidgetChrome title="Live map" subtitle="Mock positions + geofence (hover / click)">
      <FleetMapCore
        fleet={fleet}
        loading={loading}
        focusedVehicleId={focusedId}
        minHeight="min-h-[220px]"

      />
      <p className="pointer-events-none mt-1 px-1 text-[10px] text-slate-400">
        {widgetId}
      </p>
    </WidgetChrome>
  )
}
