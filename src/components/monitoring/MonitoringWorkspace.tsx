import { useCallback, useMemo, useState } from 'react'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useAppSelector } from '../../store/hooks'
import { FleetMapCore } from '../map/FleetMapCore'
import { MonitoringFleetSidebar } from './MonitoringFleetSidebar'
import type { AppTab } from '../TopNav'

/** Full-height legacy-style monitoring: fleet list + OSM map (no KPI strip beside map). */
export function MonitoringWorkspace({ onTabChange }: { onTabChange: (tab: AppTab) => void }) {
  const { fleet, loading } = useMockFleet()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const onToggleOnMap = useCallback((vehicleId: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      if (next.has(vehicleId)) next.delete(vehicleId)
      else next.add(vehicleId)
      return next
    })
  }, [])

  const visibleFleet = useMemo(
    () => fleet.filter((v) => !hiddenIds.has(v.vehicle_id)),
    [fleet, hiddenIds],
  )

  return (
    <section
      className="flex h-[min(calc(100svh-10rem),720px)] min-h-[480px] w-full gap-0 overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_0_0_1px_rgb(34_211_238_/_0.04),0_24px_55px_-18px_rgb(0_0_0_/_0.5)]"
      aria-label="Fleet monitoring"
    >
      <MonitoringFleetSidebar hiddenIds={hiddenIds} onToggleOnMap={onToggleOnMap} onTabChange={onTabChange} />
      <div className="min-h-0 min-w-0 flex-1 p-2">
        <FleetMapCore
          fleet={visibleFleet}
          loading={loading}
          focusedVehicleId={focusedId}

          hud
          coordinateReadout
          className="h-full rounded-xl"
          minHeight="min-h-0"
        />
      </div>
    </section>
  )
}
