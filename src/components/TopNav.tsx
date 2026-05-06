import {
  LayoutDashboard,
  MonitorDot,
  ClipboardList,
  Route,
  FileBarChart,
  Users,
  Bell,
  Video,
  UserPlus,
  Box,
  Menu,
  X,
  Truck,
} from 'lucide-react'
import { type ComponentType, useState } from 'react'

const TABS = [
  'Dashboard',
  'Monitoring',
  'Tasks',
  'Tracks',
  'Reports',
  'Drivers',
  'Notifications',
] as const

const HIDDEN_TABS = [
  'Video',
  'Users',
  'Units',
  'VehicleDetail',
  'DriverDetail',
] as const

export type AppTab = (typeof TABS)[number] | (typeof HIDDEN_TABS)[number]

const TAB_ICONS: Record<AppTab, ComponentType<{ className?: string; size?: number }>> = {
  Dashboard: LayoutDashboard,
  Monitoring: MonitorDot,
  Tasks: ClipboardList,
  Tracks: Route,
  Reports: FileBarChart,
  Drivers: Users,
  Notifications: Bell,
  Video: Video,
  Users: UserPlus,
  Units: Box,
  VehicleDetail: Truck,
  DriverDetail: Users,
}

export function TopNav({
  active,
  onChange,
  tasksBadgeCount,
}: {
  active: AppTab
  onChange: (tab: AppTab) => void
  /** Shown next to Tasks; aligned with legacy "open items" cue */
  tasksBadgeCount?: number
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const now = new Date().toLocaleString(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const rawBadge = tasksBadgeCount ?? 0
  const badgeLabel = rawBadge > 99 ? '99+' : rawBadge > 0 ? String(rawBadge) : ''
  const showBadge = rawBadge > 0

  const handleTabChange = (tab: AppTab) => {
    onChange(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 text-slate-900 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-navy-950/80 dark:text-white dark:shadow-2xl">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-6 py-0 lg:flex-nowrap">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3 py-4">
          <div className="relative flex items-center gap-3">
            <span className="relative inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-black tracking-tight text-white shadow-lg shadow-blue-500/20 dark:from-sky-400 dark:to-blue-600 dark:shadow-sky-500/30">
              JC
              <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-base font-bold tracking-[0.1em] text-slate-900 dark:text-white">
                JAXICLOUD
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-sky-600 dark:text-sky-400/80 uppercase">
                Fleet Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Nav tabs - Desktop */}
        <nav
          className="hidden md:flex items-center gap-1 overflow-x-auto [scrollbar-width:none] md:max-w-none"
          aria-label="Modules"
        >
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/50 p-1.5 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
            {TABS.map((tab) => {
              const isActive = active === tab
              const IconComp = TAB_ICONS[tab]
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onChange(tab)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/5 ring-1 ring-slate-200 dark:bg-sky-500/10 dark:text-sky-400 dark:shadow-none dark:ring-1 dark:ring-sky-400/30'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white'
                  }`}
                >
                  <IconComp
                    size={16}
                    className={isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}
                  />
                  {tab}
                  {tab === 'Tasks' && showBadge ? (
                    <span className="absolute -right-1 -top-1 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-lg shadow-rose-500/30">
                      {badgeLabel}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex shrink-0 items-center gap-3 py-4">
          {/* System time */}
          <div className="hidden rounded-xl border border-slate-200 bg-white/50 px-4 py-1.5 text-right dark:border-white/[0.08] dark:bg-white/[0.02] dark:backdrop-blur-sm md:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-sky-400/60">
              System Live
            </p>
            <p className="font-mono text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">{now}</p>
          </div>

          {/* User profile */}
          <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-white/[0.08]">
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-sky-300"
              aria-label="Alerts"
            >
              <Bell size={20} />
              {showBadge ? (
                <span className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#030a1a]"></span>
              ) : null}
            </button>
            
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 dark:from-sky-400 dark:to-blue-500"
              aria-label="Account"
            >
              JK
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex md:hidden size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-sky-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>


      {/* Mobile nav dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-slate-200 bg-white shadow-xl dark:border-white/[0.08] dark:bg-navy-950 md:hidden">
          <nav className="flex flex-col px-4 py-4 gap-2" aria-label="Modules (mobile)">
            {TABS.map((tab) => {
              const isActive = active === tab
              const IconComp = TAB_ICONS[tab]
              return (
                <button
                  key={`m-${tab}`}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-sky-500/10 dark:text-sky-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <IconComp
                    size={18}
                    className={isActive ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}
                  />
                  {tab}
                  {tab === 'Tasks' && showBadge ? (
                    <span className="ml-auto flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {badgeLabel}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>
          
          <div className="border-t border-slate-100 px-4 py-4 dark:border-white/[0.04]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
                aria-label="Account"
              >
                JK
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Admin User</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">View Profile</span>
              </div>
              <button
                type="button"
                className="relative ml-auto flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-sky-300"
                aria-label="Alerts"
              >
                <Bell size={20} />
                {showBadge ? (
                  <span className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#030a1a]"></span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
