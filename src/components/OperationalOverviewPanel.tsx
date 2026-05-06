import { useState } from 'react'
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
  Wifi,
  Navigation,
  Wrench,
  GripHorizontal
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useAppSelector } from '../store/hooks'
import { useMockFleet } from '../hooks/useMockFleet'
import type { UnitCategory } from '../types/fleet'
import type { AppTab } from './TopNav'

const CATEGORY_VEHICLE_ICONS: Record<UnitCategory, ComponentType<{ className?: string; size?: number }>> = {
  Refrigerated: Snowflake,
  Trucks: Truck,
  Trailers: Container,
  Tippers: HardHat,
}

export function OperationalOverviewPanel({ onTabChange }: { onTabChange?: (tab: AppTab) => void }) {
  const { fleet, alerts, loading } = useMockFleet()
  const focusedId = useAppSelector((s) => s.ui.focusedVehicleId)
  const vehicle = focusedId
    ? (fleet.find((v) => v.vehicle_id === focusedId) ?? null)
    : null

  const [order, setOrder] = useState([
    'vehicle',
    'driver',
    'driving',
    'tasks',
    'health',
    'connection',
    'events',
  ])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  if (loading && fleet.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-8 text-sm text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.02]">
        <span className="size-2.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
        Syncing operational feed…
      </div>
    )
  }

  const VehicleIcon = vehicle ? CATEGORY_VEHICLE_ICONS[vehicle.unit_category] : Truck

  const vehicleSeed = vehicle ? parseInt(vehicle.vehicle_id.split('-')[1] || '0', 10) : 0
  const customers = ['Construction Site', 'Nordic Logistics', 'City Center', 'Main Depot', 'Airport Cargo']
  
  const vehicleAlerts = vehicle ? alerts.filter(a => a.vehicle_id === vehicle.vehicle_id) : []
  const vehicleAlarmsCount = vehicleAlerts.filter(a => a.severity !== 'Low').length
  const vehicleTasks = (vehicleSeed % 4) + 1

  const healthScore = vehicle 
    ? (vehicle.status === 'Maintenance' ? 45 : 85 + (vehicleSeed % 15)) 
    : 0
  
  const vehicleOnlinePct = vehicle ? (vehicle.satellite_status === 'connected' ? 98 : 65) : 0
  const gpsSignal = vehicle ? (vehicle.satellite_status === 'connected' ? 'Good' : 'Weak') : ''
  const serviceWk = vehicle ? (vehicleSeed % 15) + 2 : 0

  const uninitMins = Math.floor(((vehicle?.hours_driven_today ?? 0) % 4.5) * 60)
  const uninitLeft = Math.floor((4.5 - ((vehicle?.hours_driven_today ?? 0) % 4.5)) * 60)
  const dailyMins = Math.floor((vehicle?.hours_driven_today ?? 0) * 60)
  const weeklyMins = Math.floor(((vehicle?.hours_driven_today ?? 0) * 4.2 + 15) * 60)
  const twoWeeksMins = Math.floor(((vehicle?.hours_driven_today ?? 0) * 8.5 + 32) * 60)
  const serviceMins = Math.floor((vehicle?.working_time_hours ?? 0) * 60)

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = Math.floor(mins % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (!sourceId || sourceId === targetId) return
    
    setOrder(prev => {
      const newOrder = [...prev]
      const sourceIndex = newOrder.indexOf(sourceId)
      const targetIndex = newOrder.indexOf(targetId)
      if (sourceIndex === -1 || targetIndex === -1) return prev
      newOrder.splice(sourceIndex, 1)
      newOrder.splice(targetIndex, 0, sourceId)
      return newOrder
    })
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const getCardClass = (id: string) => 
    `w-full flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-200 ${draggedItem === id ? 'opacity-40 border-dashed border-cyan-400 scale-[0.99]' : 'opacity-100 hover:border-cyan-400/50 hover:shadow-cyan-400/10'}`

  const renderHeader = (title: string) => (
    <div className="flex items-center justify-between mb-4 shrink-0">
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
        {title}
      </h3>
      <GripHorizontal size={14} className="text-slate-300 dark:text-slate-600" />
    </div>
  )

  const blocks: Record<string, React.ReactNode> = {
    vehicle: (
      <section 
        key="vehicle" draggable onDragStart={(e) => handleDragStart(e, 'vehicle')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'vehicle')} onDragEnd={handleDragEnd}
        className={getCardClass('vehicle')}
      >
        {renderHeader('VEHICLE DETAIL')}
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 w-full cursor-pointer hover:opacity-80 transition-opacity no-drag"
          onClick={() => onTabChange?.('VehicleDetail')}
        >
           <div className="relative flex h-24 w-full sm:w-36 shrink-0 items-center justify-center rounded-xl bg-slate-50/80 ring-1 ring-slate-100 dark:bg-white/[0.03] dark:ring-white/[0.05] overflow-hidden">
              {vehicle?.image_url ? (
                <img src={vehicle.image_url} alt={vehicle.vehicle_id} className="h-full w-full object-cover" />
              ) : (
                <VehicleIcon size={48} className="text-slate-300 dark:text-slate-700" />
              )}
              <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                <div className="size-1 rounded-full bg-white animate-pulse" />
                ACTIVE
              </div>
           </div>
           
           <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit ID</p>
                <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  {vehicle?.vehicle_id}
                </h2>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {vehicle?.unit_category}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                <p className="text-sm font-black text-emerald-500 dark:text-emerald-400">
                  {vehicle?.status}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Speed</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {vehicle?.speed_kmh} km/h
                </p>
              </div>
           </div>
        </div>
      </section>
    ),
    driver: (
      <section 
        key="driver" draggable onDragStart={(e) => handleDragStart(e, 'driver')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'driver')} onDragEnd={handleDragEnd}
        className={getCardClass('driver')}
      >
        {renderHeader('DRIVER DETAIL')}
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 w-full cursor-pointer hover:opacity-80 transition-opacity no-drag"
          onClick={() => onTabChange?.('DriverDetail')}
        >
           <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-black text-white shadow-lg shadow-blue-500/20">
              {vehicle?.driver_name.split(' ').map(n => n[0]).join('')}
           </div>
           
           <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Driver</p>
                <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  {vehicle?.driver_name}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                 <div className="border-l-2 border-slate-100 dark:border-white/[0.04] pl-4">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Driven Today</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white">{vehicle?.hours_driven_today.toFixed(1)} h</p>
                 </div>
                 <div className="border-l-2 border-slate-100 dark:border-white/[0.04] pl-4">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rest Time</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white">{vehicle?.resting_time_hours.toFixed(1)} h</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    ),
    driving: (
      <section 
        key="driving" draggable onDragStart={(e) => handleDragStart(e, 'driving')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'driving')} onDragEnd={handleDragEnd}
        className={getCardClass('driving')}
      >
        {renderHeader('DRIVING TIME & REST')}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 w-full">
          <ComplianceBar 
            label="Uninterrupted" 
            time={formatTime(uninitMins)} 
            percent={(uninitMins / (4.5 * 60)) * 100}
            color={uninitMins > 4 * 60 ? "bg-rose-500" : "bg-emerald-500"}
            subtext={`${formatTime(uninitLeft)} of uninterrupted driving left`}
          />
          <ComplianceBar 
            label="Daily Driving" 
            time={formatTime(dailyMins)} 
            percent={(dailyMins / (10 * 60)) * 100}
            color={dailyMins > 9 * 60 ? "bg-amber-400" : "bg-amber-400"}
            subtext="Next daily rest: 05/05/2026 05:09"
          />
          <ComplianceBar 
            label="Weekly Driving" 
            time={formatTime(weeklyMins)} 
            percent={(weeklyMins / (56 * 60)) * 100}
            color={weeklyMins > 50 * 60 ? "bg-rose-500" : "bg-emerald-500"}
            subtext="Next weekly rest: 09/05/2026 08:00"
          />
          <ComplianceBar 
            label="2 Weeks Driving" 
            time={formatTime(twoWeeksMins)} 
            percent={(twoWeeksMins / (90 * 60)) * 100}
            color="bg-emerald-500"
          />
          <ComplianceBar 
            label="Service Time" 
            time={formatTime(serviceMins)} 
            percent={(serviceMins / (21 * 60)) * 100}
            color="bg-rose-500"
            subtexts={["Allowed hours (21)", "Service hours start: 04/05/2026 14:09"]}
          />
        </div>
      </section>
    ),
    tasks: (
      <section 
        key="tasks" draggable onDragStart={(e) => handleDragStart(e, 'tasks')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'tasks')} onDragEnd={handleDragEnd}
        className={getCardClass('tasks')}
      >
        {renderHeader('OPERATION & TASKS')}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 w-full pt-2">
          <div className="flex items-center gap-5 w-full sm:w-auto">
             <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:ring-rose-500/20">
               <AlertTriangle size={28} />
             </div>
             <div>
               <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{vehicleAlarmsCount}</p>
               <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requires Action</p>
             </div>
          </div>
          <div className="flex items-center gap-5 w-full sm:w-auto">
             <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20">
               <ListTodo size={28} />
             </div>
             <div>
               <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{vehicleTasks}</p>
               <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Tasks</p>
             </div>
          </div>
        </div>
      </section>
    ),
    health: (
      <section 
        key="health" draggable onDragStart={(e) => handleDragStart(e, 'health')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'health')} onDragEnd={handleDragEnd}
        className={getCardClass('health')}
      >
        {renderHeader('HEALTH & STATUS')}
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full pt-2">
           <div className="relative size-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{healthScore}</p>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Score</p>
              </div>
           </div>
           <div className="flex flex-col gap-3 text-[11px] font-bold flex-1 min-w-[200px] max-w-[400px]">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-slate-500">Healthy</span>
                </div>
                <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 42 : 12}</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span className="text-slate-500">Attention</span>
                </div>
                <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 14 : 28}</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-rose-500 shadow-sm" />
                  <span className="text-slate-500">Critical</span>
                </div>
                <span className="text-slate-900 dark:text-white font-black">{healthScore > 80 ? 7 : 21}</span>
              </div>
           </div>
        </div>
      </section>
    ),
    connection: (
      <section 
        key="connection" draggable onDragStart={(e) => handleDragStart(e, 'connection')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'connection')} onDragEnd={handleDragEnd}
        className={getCardClass('connection')}
      >
        {renderHeader('CONNECTION & SERVICE')}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/[0.04]">
             <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
               <Wifi size={24} className="text-emerald-500" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</p>
               <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">{vehicleOnlinePct}%</p>
             </div>
           </div>
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/[0.04]">
             <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
               <Navigation size={24} className="text-blue-500" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPS Signal</p>
               <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">{gpsSignal}</p>
             </div>
           </div>
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/[0.04]">
             <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
               <Wrench size={24} className="text-slate-400" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
               <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">{serviceWk} wk</p>
             </div>
           </div>
        </div>
      </section>
    ),
    events: (
      <section 
        key="events" draggable onDragStart={(e) => handleDragStart(e, 'events')} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'events')} onDragEnd={handleDragEnd}
        className={getCardClass('events')}
      >
        {renderHeader('LATEST EVENTS')}
        <div className="w-full">
          <ul className="space-y-4">
            {vehicleAlerts.length > 0 ? (
              vehicleAlerts.slice(0, 3).map((alert) => (
                <li key={alert.alert_id} className="flex items-start gap-3">
                   <div className="mt-1 size-2 shrink-0 rounded-full bg-blue-600 dark:bg-sky-400 ring-4 ring-blue-50 dark:ring-sky-400/10" />
                   <div className="flex-1">
                      <p className="text-[12px] font-black text-slate-900 dark:text-white">
                        <span className="text-slate-400 mr-2 tabular-nums">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {alert.message}
                      </p>
                   </div>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-3">
                 <div className="size-2 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700" />
                 <p className="text-[12px] font-bold text-slate-400 uppercase">No recent events</p>
              </li>
            )}
          </ul>
        </div>
      </section>
    ),
  }

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
        <div className="flex flex-col gap-4 w-full">
          {order.map((id) => blocks[id])}
        </div>
      )}
    </div>
  )
}

function ComplianceBar({ label, time, percent, color, subtext, subtexts = [] }: { label: string, time: string, percent: number, color: string, subtext?: string, subtexts?: string[] }) {
  const p = Math.min(100, Math.max(0, percent))
  const allSubtexts = subtext ? [subtext, ...subtexts] : subtexts
  
  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
        <span className="truncate min-w-[60px] flex-1">{label}</span>
        <span className="text-slate-900 dark:text-white font-mono shrink-0">({time})</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${p}%` }} />
      </div>
      {allSubtexts.length > 0 && (
        <div className="mt-1 flex flex-col items-start text-[9px] font-bold text-slate-400">
          {allSubtexts.map((text, i) => (
            <span key={i} className="w-full truncate" title={text}>{text}</span>
          ))}
        </div>
      )}
    </div>
  )
}
