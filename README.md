# Jaxi Cloud — Fleet Management Frontend POC

Standalone React dashboard using **mock JSON only** (no backend).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Unified customizable dashboard

Everything lives on **one page**: KPI strip, fleet list, live map, operational overview, charts, and alerts table are **widgets** in a drag-and-drop grid.

- **Edit layout** — drag and resize tiles. Each widget has **minimum / maximum grid widths**; when you finish a drag or resize, sibling widgets on the same row **grow within those caps** so the row uses the full 12-column width where possible.
- **Manage widgets** — checklist (one tile per type); check to add, uncheck to remove — avoids duplicates.
- **Reset layout** — restores the default arrangement (operations-style row + charts).
- Layout is saved as **`jaxicloud.dashboard.v2`** in `localStorage` (older `v1` keys are ignored).

**Dark / light** is stored under `jaxicloud.theme`.

## Mock data

Static files are served from `public/mock/`:

- `fleet_status.json` — vehicles, unit category, speed (mock), map coordinates, fuel, driver, hours, satellite status
- `trip_history_timeseries.json` — daily series for charts
- `alerts_log.json` — alarms for tables and flyout

Regenerate demo JSON:

```bash
npm run generate-mocks
```

## Widget types

KPI summary, fleet list, map & geofence, operational overview (driver/health/events), fuel gauge, weekly CO₂ chart, utilization line, alerts table.

## Future API integration

Replace `loadAllMockData()` in [`src/data/fleetData.ts`](src/data/fleetData.ts) with REST calls; keep or map into [`src/types/fleet.ts`](src/types/fleet.ts).

## Out of scope for this POC

Real authentication, RBAC, PDF/Excel export, live API, hosting — see product planning notes.

## Stack

Vite, React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, Recharts, react-grid-layout (legacy API), Leaflet / react-leaflet.
