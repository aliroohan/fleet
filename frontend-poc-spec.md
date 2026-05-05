# Product Requirements Document (PRD): Fleet Management Frontend POC (Mock Data Edition)

## 1. Project Overview
This project is a standalone, frontend-only Proof of Concept (POC) for a modern Fleet Management dashboard. **There is strictly NO backend connectivity.** All data will be simulated using local JSON or CSV files to generate varied, realistic graphs and map states. The primary objective is to demonstrate a highly customizable, "zero-click" interface where users can dynamically configure their own data views.

## 2. Tech Stack Requirements
*   **Framework:** React.js.
*   **State & Layout Management:** Redux Toolkit/Context API (React). Use a drag-and-drop grid system (e.g., `react-grid-layout`) for dashboard customization.
*   **Data Parsing & Visualization:** 
    *   `PapaParse` (if using CSVs).
    *   `Recharts` or `Chart.js` for dynamic, varied data visualizations.
*   **Mapping:** Mapbox GL JS or Leaflet (using mock latitude/longitude coordinate arrays).
*   **Persistence:** `localStorage` MUST be used to save the user's custom dashboard layouts so they persist on page refresh.

## 3. The Customization Engine (Core Feature)
The POC must heavily feature user-driven customization. The system should allow the user to:
1.  **Add/Remove Widgets:** A drawer or modal where users can select which graphs or tables to add to their screen.
2.  **Drag, Drop & Resize:** Users can freely move widgets around a grid and resize them.
3.  **Local State Saving:** The layout configuration (x, y coordinates, width, height, and widget ID) must be stringified and saved to the browser's `localStorage`.

## 4. Mock Data Architecture
The AI should generate or expect the following local data structures (`.json` or `.csv`) to ensure graphs look realistic:

*   **`fleet_status.json`**: Current snapshot of all vehicles.
    *   *Fields:* `vehicle_id`, `status` (Active, Resting, Maintenance), `fuel_level_percent`, `current_lat`, `current_lng`, `driver_name`, `hours_driven_today`.
*   **`trip_history_timeseries.json`**: Varied historical data for graphs.
    *   *Fields:* `date`, `total_fleet_mileage`, `co2_emissions_tons`, `idle_time_hours`, `active_vehicles_count`. (This data must fluctuate to create interesting line/bar charts).
*   **`alerts_log.json`**: For the notification center and task widgets.
    *   *Fields:* `alert_id`, `severity` (High, Medium, Low), `vehicle_id`, `message` (e.g., "Engine fault code 42", "Geofence boundary crossed"), `timestamp`.

## 5. Required UI Components
### 5.1. The Dynamic Dashboard
*   **Edit Mode Toggle:** A button that unlocks the grid, allowing users to drag, drop, resize, and delete widgets. 
*   **Widget Types to Implement:**
    *   *Gauge Chart:* Average fleet fuel level.
    *   *Bar Chart:* Weekly CO2 emissions vs. Target.
    *   *Line Chart:* Fleet utilization over the last 30 days.
    *   *Data Table:* Live list of active alarms/faults.

### 5.2. The Interactive Map Component
*   Renders markers based on `fleet_status.json`.
*   Includes a simulated "Geofence" (a static polygon drawn on the map).
*   **Hover State:** Hovering over a vehicle marker must instantly show a tooltip with working/resting time, fuel level, and satellite status.

### 5.3. The "One-Click" Context Flyout
*   A side-panel or modal that opens immediately when a vehicle is clicked on the map or in a list.
*   Must aggregate data from the mock files for that specific `vehicle_id` to show its active alerts, current driver status, and recent trip stats without routing to a new page.

## 6. Execution Steps for AI IDE
1.  **Step 1:** Scaffold the frontend framework and setup `localStorage` hooks for layout management.
2.  **Step 2:** Generate the mock JSON files with at least 50 lines of varied data each to ensure charts render beautifully.
3.  **Step 3:** Build the drag-and-drop grid wrapper.
4.  **Step 4:** Implement the individual charting and mapping components, feeding them the local JSON data.
5.  **Step 5:** Apply styling (Tailwind CSS) including a toggleable Dark Mode.