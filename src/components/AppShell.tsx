import { useMemo, useState } from 'react'
import { Sun, Moon, Pencil, Check, LayoutGrid, RotateCcw, Bell, Box } from 'lucide-react'
import { countAttentionAlerts, countOnlineUnits } from '../data/fleetMetrics'
import { useMockFleet } from '../hooks/useMockFleet'
import { useSeedFocusedVehicle } from '../hooks/useSeedFocusedVehicle'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { resetDashboard, setEditMode } from '../store/dashboardSlice'
import { setPaletteOpen } from '../store/uiSlice'
import { toggleTheme } from '../store/themeSlice'
import { AppFooter } from './AppFooter'
import { DashboardGrid } from './DashboardGrid'
import { OperationsPageContent } from './pages/OperationsPages'
import { TopNav, type AppTab } from './TopNav'
import { WidgetPalette } from './WidgetPalette'
import { VehicleHoverCard } from './VehicleHoverCard'

export function AppShell() {
  useSeedFocusedVehicle()
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard')
  const editMode = useAppSelector((s) => s.dashboard.editMode)
  const theme = useAppSelector((s) => s.theme.mode)
  const hoveredVehicleId = useAppSelector((s) => s.ui.hoveredVehicleId)
  const hoverPosition = useAppSelector((s) => s.ui.hoverPosition)
  const { error: mockError, fleet, alerts, trips } = useMockFleet()
  const hoveredVehicle = useMemo(
    () => fleet.find((v) => v.vehicle_id === hoveredVehicleId) || null,
    [fleet, hoveredVehicleId],
  )
  const online = useMemo(() => countOnlineUnits(fleet), [fleet])
  const attention = useMemo(() => countAttentionAlerts(alerts), [alerts])
  const tasksBadgeCount = useMemo(
    () => alerts.filter((a) => a.severity !== 'Low').length,
    [alerts],
  )
  const isDashboard = activeTab === 'Dashboard'
  const compactHero = activeTab === 'Monitoring'

  return (
    <div className="jc-app-layer relative flex min-h-svh flex-col bg-slate-50 text-slate-800 transition-colors duration-500 dark:bg-navy-950 dark:text-slate-100">
      <TopNav active={activeTab} onChange={setActiveTab} tasksBadgeCount={tasksBadgeCount} />

      {mockError ? (
        <div
          className="border-b border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/60 dark:text-rose-200"
          role="alert"
        >
          <span className="mr-2 inline-flex size-2.5 rounded-full bg-rose-500 jc-status-dot-active" />
          Telematics Sync Error: {mockError}
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[1680px] flex-1 px-4 py-4 sm:px-6 sm:py-6">
        {compactHero ? (
          <div className="jc-glass relative mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white/50 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400/70">
                Live Monitoring
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Fleet Intelligence Stream
              </h1>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-sky-400/30 dark:hover:bg-white/[0.08]"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        ) : (
          /* ─── Hero Section ─── */
          <div className="jc-glass relative mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/50 p-5 sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.02]">
            {/* Ambient glow orbs */}
            <div
              className="pointer-events-none jc-pulse-soft absolute -right-20 -top-20 size-80 rounded-full bg-sky-400/10 blur-[80px]"
              aria-hidden
            />
            <div
              className="pointer-events-none jc-pulse-soft-delay absolute -bottom-16 -left-8 size-64 rounded-full bg-blue-500/5 blur-[60px]"
              aria-hidden
            />

            {/* KPI Cards Row */}
            <div className="relative mb-8 grid gap-4 sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-400/50 hover:shadow-xl hover:shadow-sky-500/5 dark:border-white/[0.08] dark:bg-navy-900/40 dark:backdrop-blur-md">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <LayoutGrid size={40} className="text-sky-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400/60">
                  Online Fleet
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">
                    {online.online}
                  </p>
                  <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                    +{online.pct}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-1000 dark:from-sky-400 dark:to-blue-500" style={{ width: `${online.pct}%` }} />
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-rose-400/50 hover:shadow-xl hover:shadow-rose-500/5 dark:border-white/[0.08] dark:bg-navy-900/40 dark:backdrop-blur-md">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Bell size={40} className="text-rose-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 dark:text-rose-400/60">
                  Critical Alerts
                </p>
                <p className="mt-2 text-4xl font-black tabular-nums text-rose-600 dark:text-rose-400">
                  {attention}
                </p>
                <div className="mt-4 flex gap-1.5">
                  {[...Array(12)].map((_, i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < attention ? 'bg-rose-500' : 'bg-slate-100 dark:bg-white/[0.04]'}`} />
                  ))}
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/[0.08] dark:bg-navy-900/40 dark:backdrop-blur-md">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Box size={40} className="text-blue-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400/60">
                  Module Status
                </p>
                <p className="mt-2 text-4xl font-black text-slate-900 dark:text-white truncate">
                  {activeTab}
                </p>
                <p className="mt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Active Control Plane
                </p>
              </div>
            </div>

            {/* Hero text + controls */}
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Autonomous Fleet Command
                </h1>
                <p className="mt-3 text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  Experience next-generation logistics management with real-time telematics and predictive diagnostics. 
                  Customize your workspace to optimize mission-critical operations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isDashboard ? (
                  <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/80 p-1.5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                        editMode
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
                      }`}
                      onClick={() => dispatch(setEditMode(!editMode))}
                    >
                      {editMode ? <Check size={18} /> : <Pencil size={18} />}
                      {editMode ? 'Finish setup' : 'Configure layout'}
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                      disabled={!editMode}
                      onClick={() => dispatch(setPaletteOpen(true))}
                    >
                      <LayoutGrid size={18} />
                      Widgets
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                      disabled={!editMode}
                      onClick={() => {
                        if (window.confirm('Reset dashboard layout to default?')) {
                          dispatch(resetDashboard())
                        }
                      }}
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-sky-400/30 dark:hover:bg-white/[0.08]"
                  onClick={() => dispatch(toggleTheme())}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="min-h-[520px]" aria-label={`${activeTab} workspace`}>
          {isDashboard ? (
            <DashboardGrid onTabChange={setActiveTab} />
          ) : (
            <OperationsPageContent activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </section>
      </main>

      <AppFooter />
      <WidgetPalette />

      {/* Global Hover Overlay — Prevents clipping by sidebar/widget boundaries */}
      {hoveredVehicleId && hoveredVehicle ? (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${Math.max(12, Math.min(hoverPosition.x + 16, window.innerWidth - 380))}px, ${Math.max(12, Math.min(hoverPosition.y + 16, window.innerHeight - 420))}px)`,
          }}
        >
          <div className="jc-glass overflow-hidden rounded-2xl border border-sky-500/30 bg-navy-950/90 shadow-2xl backdrop-blur-xl">
            <VehicleHoverCard vehicle={hoveredVehicle} trips={trips} alerts={alerts} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
