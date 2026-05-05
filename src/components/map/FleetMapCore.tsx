import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { LatLngLiteral, Map as LeafletMap } from 'leaflet'
import { useMockFleet } from '../../hooks/useMockFleet'
import { useAppDispatch } from '../../store/hooks'
import { focusVehicle } from '../../store/uiSlice'
import { GEOFENCE_RING } from '../../data/geofence'
import type { FleetVehicle } from '../../types/fleet'
import { ensureLeafletIcons } from '../../map/setupLeafletIcons'
import { vehicleLabelDivIcon } from '../../map/vehicleDivIcon'
import { VehicleHoverCard } from '../VehicleHoverCard'

type Props = {
  fleet: FleetVehicle[]
  loading: boolean
  /** Highlight focused unit */
  focusedVehicleId?: string | null
  className?: string
  minHeight?: string

  /** Corner controls inspired by legacy map UI */
  hud?: boolean
  /** Cursor lat/lng in bottom-right */
  coordinateReadout?: boolean
}

function CursorCoordsUpdater({
  onMove,
}: {
  onMove: (ll: LatLngLiteral) => void
}) {
  useMapEvents({
    mousemove: (e) => onMove(e.latlng),
    moveend: (e) => onMove(e.target.getCenter()),
    zoomend: (e) => onMove(e.target.getCenter()),
  })
  const map = useMap()
  useEffect(() => {
    onMove(map.getCenter())
  }, [map, onMove])
  return null
}

function MapHudDeck({
  mapRef,
  coordinateReadout,
  mouseLatLng,
}: {
  mapRef: RefObject<LeafletMap | null>
  coordinateReadout: boolean
  mouseLatLng: LatLngLiteral | null
}) {
  const fmt = coordinateReadout
    ? `${mouseLatLng ? mouseLatLng.lat.toFixed(5) : '—'}, ${mouseLatLng ? mouseLatLng.lng.toFixed(5) : '—'}`
    : null

  return (
    <div className="pointer-events-none absolute inset-0 z-[620] [&_button]:pointer-events-auto">
      <div className="absolute left-3 top-3 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:border-white/[0.08] dark:bg-[#061028]/90">
        <HudIconBtn label="Area search (stub)" svg="search" />
        <HudIconBtn label="Visibility (stub)" svg="eye" />
        <HudIconBtn label="Base map (stub)" svg="layers" />
        <HudIconBtn label="Measure (stub)" svg="ruler" />
      </div>
      <div className="absolute right-3 top-3 flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow backdrop-blur-sm dark:border-white/[0.08] dark:bg-[#061028]/90">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg text-lg font-semibold text-blue-600 hover:bg-slate-100 dark:text-cyan-300 dark:hover:bg-white/[0.08]"
          aria-label="Zoom in"
          onClick={() => mapRef.current?.zoomIn()}
        >
          +
        </button>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg text-lg font-semibold text-blue-600 hover:bg-slate-100 dark:text-cyan-300 dark:hover:bg-white/[0.08]"
          aria-label="Zoom out"
          onClick={() => mapRef.current?.zoomOut()}
        >
          −
        </button>
      </div>
      {coordinateReadout && fmt !== null ? (
        <div className="absolute bottom-11 right-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 font-mono text-[12px] tabular-nums text-blue-700 shadow backdrop-blur-sm dark:border-white/[0.08] dark:bg-[#061028]/90 dark:text-cyan-200">
          {fmt}
        </div>
      ) : null}
    </div>
  )
}

function HudIconBtn({
  label,
  svg,
}: {
  label: string
  svg: 'search' | 'eye' | 'layers' | 'ruler'
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-cyan-300"
    >
      {svg === 'search' ? (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35" />
        </svg>
      ) : svg === 'eye' ? (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
          />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
        </svg>
      ) : svg === 'layers' ? (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"
          />
        </svg>
      ) : (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21h16M8 21V7l4-4 4 4v14" />
        </svg>
      )}
    </button>
  )
}

export function FleetMapCore({
  fleet,
  loading,
  focusedVehicleId,
  className = '',
  minHeight = 'min-h-[320px]',
  hud = false,
  coordinateReadout = false,
}: Props) {
  const dispatch = useAppDispatch()
  const { trips, alerts } = useMockFleet()

  const center = useMemo((): [number, number] => {
    if (fleet.length === 0) return [55.7, 10.4]
    const lat = fleet.reduce((s, v) => s + v.current_lat, 0) / fleet.length
    const lng = fleet.reduce((s, v) => s + v.current_lng, 0) / fleet.length
    return [lat, lng]
  }, [fleet])

  const [mouseLatLng, setMouseLatLng] = useState<LatLngLiteral | null>(null)
  const onLatLngMove = useCallback((ll: LatLngLiteral) => {
    setMouseLatLng(ll)
  }, [])
  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    ensureLeafletIcons()
  }, [])

  if (loading) {
    return (
      <div
        className={`flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.02] ${minHeight} ${className}`}
      >
        <span className="mr-2 size-2 animate-pulse rounded-full bg-cyan-400" />
        Loading map…
      </div>
    )
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner dark:border-white/[0.06] ${minHeight} ${className}`}
    >
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={7}
        className="h-full w-full min-h-[inherit] rounded-2xl"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={GEOFENCE_RING}
          pathOptions={{
            color: '#22d3ee',
            fillColor: '#22d3ee',
            fillOpacity: 0.06,
            weight: 2,
          }}
        />
        {coordinateReadout ? (
          <CursorCoordsUpdater onMove={onLatLngMove} />
        ) : null}
        {fleet.map((v) => {
          const isFocus = focusedVehicleId === v.vehicle_id
          return (
            <Marker
              key={v.vehicle_id}
              position={[v.current_lat, v.current_lng]}
                            icon={vehicleLabelDivIcon(v)}
              opacity={isFocus ? 1 : 0.88}
              eventHandlers={{
                mouseover: () => {
                  dispatch(focusVehicle(v.vehicle_id))
                },
              }}
            >
              <Tooltip
                direction="auto"
                offset={[0, -10]}
                opacity={1}
                className="jc-tip"
              >
                <VehicleHoverCard
                  vehicle={v}
                  trips={trips}
                  alerts={alerts}
                  compact
                />
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>
      {hud ? (
        <MapHudDeck
          mapRef={mapRef}
          coordinateReadout={coordinateReadout}
          mouseLatLng={mouseLatLng}
        />
      ) : coordinateReadout ? (
        <div className="pointer-events-none absolute bottom-11 right-3 z-[620] rounded-lg border border-white/[0.08] bg-[#061028]/90 px-2.5 py-1 font-mono text-[11px] tabular-nums text-cyan-200 shadow backdrop-blur-sm">
          {mouseLatLng
            ? `${mouseLatLng.lat.toFixed(5)}, ${mouseLatLng.lng.toFixed(5)}`
            : '—, —'}
        </div>
      ) : null}
    </div>
  )
}
