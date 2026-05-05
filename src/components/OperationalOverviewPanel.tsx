import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts'
import {
  Truck,
  Snowflake,
  Container,
  HardHat,
  AlertTriangle,
  ListTodo,
  Eye,
  MapPin,
  Calendar,
  Wifi,
  Navigation,
  Wrench,
  ArrowRight,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useAppSelector } from '../store/hooks'
import { useMockFleet } from '../hooks/useMockFleet'
import type { UnitCategory } from '../types/fleet'


const CATEGORY_VEHICLE_ICONS: Record<UnitCategory, ComponentType<{ className?: string; size?: number }>> = {
  Refrigerated: Snowflake,
  Trucks: Truck,
  Trailers: Container,
  Tippers: HardHat,
}

/** Operational sidebar content — used inside draggable widget */
export function OperationalOverviewPanel() {
  const { fleet, alerts, loading } = useMockFleet()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)
  const vehicle = focusedId
    ? (fleet.find((v) => v.vehicle_id === focusedId) ?? null)
    : null

  if (loading && fleet.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-8 text-sm text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <span className="size-2.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
        Syncing operational feed…
      </div>
    )
  }

  const VehicleIcon = vehicle ? CATEGORY_VEHICLE_ICONS[vehicle.unit_category] : Truck

  // Dynamic derivations for selected vehicle
  const vehicleSeed = vehicle ? parseInt(vehicle.vehicle_id.split('-')[1] || '0', 10) : 0
  const dailyTrips = vehicle ? (vehicleSeed % 5) + 3 : 0
  const nextStopTime = vehicle ? `${String(10 + (vehicleSeed % 6)).padStart(2, '0')}:30` : ''
  const customers = ['Construction Site', 'Nordic Logistics', 'City Center', 'Main Depot', 'Airport Cargo']
  const nextStopCustomer = vehicle ? customers[vehicleSeed % customers.length] : ''
  const drivenToday = vehicle ? (100 + (vehicleSeed * 7) % 200) : 0
  const estReturn = vehicle ? `${String(15 + (vehicleSeed % 4)).padStart(2, '0')}:45` : ''
  
  const vehicleAlerts = vehicle ? alerts.filter(a => a.vehicle_id === vehicle.vehicle_id) : []
  const vehicleAlarmsCount = vehicleAlerts.filter(a => a.severity !== 'Low').length
  const vehicleTasks = (vehicleSeed % 4) + 1

  const healthScore = vehicle 
    ? (vehicle.status === 'Maintenance' ? 45 : 85 + (vehicleSeed % 15)) 
    : 0
  
  const vehicleOnlinePct = vehicle ? (vehicle.satellite_status === 'connected' ? 98 : 65) : 0
  const gpsSignal = vehicle ? (vehicle.satellite_status === 'connected' ? 'Good' : 'Weak') : ''
  const serviceWk = vehicle ? (vehicleSeed % 15) + 2 : 0

  return (
    <div className="flex flex-col gap-4">
      {!vehicle ? (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
           <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-slate-50 dark:bg-white/[0.05]">
             <Eye size={32} className="text-slate-300 dark:text-slate-600" />
           </div>
           <h3 className="text-lg font-black text-slate-900 dark:text-white">Select a Vehicle</h3>
           <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-500">
             Choose a unit from the fleet list to view real-time operations data.
           </p>
        </section>
      ) : (
        <>
          {/* VEHICLE & DAILY ROUTE (Main Header Card) */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] overflow-hidden">
            <div className="p-6">
               <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                 VEHICLE & DAILY ROUTE
               </h3>
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                 {/* Mock Vehicle Image Container */}
                 <div className="relative flex h-36 w-full sm:w-52 shrink-0 items-center justify-center rounded-2xl bg-slate-50/80 ring-1 ring-slate-100 dark:bg-white/[0.03] dark:ring-white/[0.05]">
                    <VehicleIcon size={72} className="text-slate-300 dark:text-slate-700" />
                    {/* Status Pill over image area */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                      <div className="size-1.5 rounded-full bg-white animate-pulse" />
                      ACTIVE
                    </div>
                 </div>
                 
                 <div className="flex-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      {vehicle.vehicle_id}
                    </h2>
                    <p className="text-base font-bold text-slate-500">
                      {vehicle.unit_category === 'Trucks' ? 'Service Vehicle' : vehicle.unit_category}
                    </p>
                    <div className="mt-4 space-y-1 text-[12px] font-bold text-slate-400 dark:text-slate-500">
                      <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-300" /> Reg. no. AB 12 345</p>
                      <p className="flex items-center gap-2"><Calendar size={14} className="text-slate-300" /> Department: Copenhagen</p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 dark:border-white/[0.04] bg-slate-50/30 dark:bg-transparent">
               <div className="border-r border-b sm:border-b-0 border-slate-100 p-4 sm:p-5 text-center dark:border-white/[0.04]">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Trips</p>
                 <p className="mt-1.5 text-xl font-black text-slate-900 dark:text-white">{dailyTrips}</p>
               </div>
               <div className="border-b sm:border-b-0 sm:border-r border-slate-100 p-4 sm:p-5 text-center dark:border-white/[0.04]">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Stop</p>
                 <p className="mt-1.5 text-xl font-black text-slate-900 dark:text-white">{nextStopTime}</p>
                 <p className="mt-0.5 text-[10px] font-bold text-slate-500 truncate px-1">{nextStopCustomer}</p>
               </div>
               <div className="border-r border-slate-100 p-4 sm:p-5 text-center dark:border-white/[0.04]">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driven Today</p>
                 <div className="mt-1.5 flex flex-col items-center leading-none">
                   <p className="text-xl font-black text-slate-900 dark:text-white">{drivenToday}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">km</p>
                 </div>
               </div>
               <div className="p-4 sm:p-5 text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Return</p>
                 <p className="mt-1.5 text-xl font-black text-slate-900 dark:text-white">{estReturn}</p>
               </div>
            </div>
          </section>

          {/* DRIFT & SUNDHED GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPERATION & TASKS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                OPERATION & TASKS
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                   <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:ring-rose-500/20">
                     <AlertTriangle size={28} />
                   </div>
                   <div>
                     <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{vehicleAlarmsCount}</p>
                     <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requires Action</p>
                   </div>
                </div>
                <div className="flex items-center gap-5">
                   <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20">
                     <ListTodo size={28} />
                   </div>
                   <div>
                     <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{vehicleTasks}</p>
                     <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Tasks</p>
                   </div>
                </div>
              </div>
            </section>

            {/* HEALTH & STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                HEALTH & STATUS
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-80">Health Check</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                 <div className="relative size-24 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="75%"
                        outerRadius="100%"
                        data={[{ name: 'h', value: healthScore, fill: healthScore > 80 ? '#10b981' : healthScore > 50 ? '#f59e0b' : '#f43f5e' }]}
                        startAngle={90}
                        endAngle={-270}
                        cx="50%"
                        cy="50%"
                      >
                        <RadialBar dataKey="value" cornerRadius={12} background={{ fill: 'rgba(0,0,0,0.03)' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{healthScore}</p>
                    </div>
                 </div>
                 <div className="flex-1 space-y-2 text-[10px] font-bold">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 shadow-sm" />
                        <span className="text-slate-500">Healthy</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 42 : 12}</span>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-500 shadow-sm" />
                        <span className="text-slate-500">Attention</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 14 : 28}</span>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-rose-500 shadow-sm" />
                        <span className="text-slate-500">Critical</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 7 : 21}</span>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* BOTTOM ROW GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CONNECTION & SERVICE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <h3 className="mb-7 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                CONNECTION & SERVICE
              </h3>
              <div className="grid grid-cols-3 gap-2">
                 <div className="flex flex-col items-center text-center">
                   <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                     <Wifi size={22} className="text-emerald-500" />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</p>
                   <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">{vehicleOnlinePct}%</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                   <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                     <Navigation size={22} className="text-blue-500" />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPS Signal</p>
                   <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">{gpsSignal}</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                   <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5">
                     <Wrench size={22} className="text-slate-400" />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
                   <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">{serviceWk} wk</p>
                 </div>
              </div>
            </section>

            {/* LATEST EVENTS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                LATEST EVENTS
              </h3>
              <ul className="space-y-4">
                {vehicleAlerts.length > 0 ? (
                  vehicleAlerts.slice(0, 3).map((alert) => (
                    <li key={alert.alert_id} className="flex items-center gap-4">
                       <div className="size-2 shrink-0 rounded-full bg-blue-600 dark:bg-sky-400 ring-4 ring-blue-50 dark:ring-sky-400/10" />
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-slate-900 dark:text-white">
                            <span className="text-slate-400 mr-3 tabular-nums">
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {alert.message}
                          </p>
                       </div>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-4">
                     <div className="size-2 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700" />
                     <p className="text-[11px] font-bold text-slate-400 uppercase">No recent events</p>
                  </li>
                )}
              </ul>
              <button className="mt-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-sky-400 hover:opacity-70 transition-opacity">
                View all events <ArrowRight size={14} />
              </button>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
