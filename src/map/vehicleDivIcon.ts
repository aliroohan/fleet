import L from 'leaflet'
import type { FleetVehicle } from '../types/fleet'

/** Premium vehicle marker with actual truck/car images and refined labels */
export function vehicleLabelDivIcon(vehicle: FleetVehicle): L.DivIcon {
  const isMoving = vehicle.status === 'Active'
  const isTruck = vehicle.unit_category === 'Trucks' || vehicle.unit_category === 'Refrigerated' || vehicle.unit_category === 'Tippers'
  const imagePath = isTruck ? '/assets/vehicles/van.png' : '/assets/vehicles/car.png'

  const html = `
    <div class="group relative flex flex-col items-center gap-1.5 transition-all duration-300" style="pointer-events:none">
      <!-- Glow effect when active -->
      ${isMoving ? '<div class="absolute -inset-2 bg-sky-400/20 blur-xl rounded-full scale-150 animate-pulse"></div>' : ''}
      
      <!-- Vehicle Image Container (Circular) -->
      <div class="relative w-14 h-14 rounded-full border-2 border-white bg-white shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-110 dark:border-sky-400/50">
        <img src="${imagePath}" class="w-full h-full object-contain scale-90" style="mix-blend-mode: multiply;" />
      </div>

      <!-- Label -->
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-sky-500/30 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:border-sky-400">
        <span class="w-2 h-2 rounded-full ${isMoving ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}"></span>
        <span class="text-[10px] font-black tracking-wider text-slate-900 dark:text-white uppercase font-sans">${vehicle.vehicle_id}</span>
      </div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'jc-vehicle-marker-wrap',
    iconSize: [80, 100],
    iconAnchor: [40, 50],
  })
}
