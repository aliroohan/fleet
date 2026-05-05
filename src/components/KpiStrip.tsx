import {
  Truck,
  AlertTriangle,
  Wifi,
  ParkingCircle,
  UserCheck,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useMockFleet } from '../hooks/useMockFleet'
import {
  countAttentionAlerts,
  countOnlineUnits,
  countParked,
  uniqueDriversToday,
} from '../data/fleetMetrics'

type KpiItem = {
  label: string
  value: string
  sub: string
  Icon: ComponentType<{ className?: string; size?: number }>
  accentFrom: string
  accentTo: string
  iconBg: string
  iconBgLight: string
  glowColor: string
  textColor: string
  textColorLight: string
}

export function KpiStrip({ embedded }: { embedded?: boolean }) {
  const { fleet, alerts, loading } = useMockFleet()

  const active = fleet.filter((v) => v.status === 'Active').length
  const alarms = countAttentionAlerts(alerts)
  const { online, pct: onlinePct } = countOnlineUnits(fleet)
  const { parked, pct: parkedPct } = countParked(fleet)
  const drivers = uniqueDriversToday(fleet)

  const cards: KpiItem[] = [
    {
      label: 'Active vehicles',
      value: loading ? '—' : String(active),
      sub: 'On the road',
      Icon: Truck,
      accentFrom: 'from-cyan-400',
      accentTo: 'to-blue-500',
      iconBg: 'bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300 ring-cyan-400/20',
      iconBgLight: 'bg-blue-50 text-blue-600 ring-blue-200',
      glowColor: 'bg-cyan-400/8',
      textColor: 'text-cyan-300',
      textColorLight: 'text-blue-700',
    },
    {
      label: 'Open alarms',
      value: loading ? '—' : String(alarms),
      sub: 'High & medium severity',
      Icon: AlertTriangle,
      accentFrom: 'from-rose-400',
      accentTo: 'to-orange-500',
      iconBg: 'bg-gradient-to-br from-rose-400/20 to-orange-500/10 text-rose-300 ring-rose-400/20',
      iconBgLight: 'bg-rose-50 text-rose-600 ring-rose-200',
      glowColor: 'bg-rose-400/8',
      textColor: 'text-rose-300',
      textColorLight: 'text-rose-700',
    },
    {
      label: 'Online units',
      value: loading ? '—' : String(online),
      sub: loading ? '' : `${onlinePct}% telemetry OK`,
      Icon: Wifi,
      accentFrom: 'from-emerald-400',
      accentTo: 'to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-400/20 to-teal-500/10 text-emerald-300 ring-emerald-400/20',
      iconBgLight: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
      glowColor: 'bg-emerald-400/8',
      textColor: 'text-emerald-300',
      textColorLight: 'text-emerald-700',
    },
    {
      label: 'Parked',
      value: loading ? '—' : String(parked),
      sub: loading ? '' : `${parkedPct}% idle`,
      Icon: ParkingCircle,
      accentFrom: 'from-violet-400',
      accentTo: 'to-purple-500',
      iconBg: 'bg-gradient-to-br from-violet-400/20 to-purple-500/10 text-violet-300 ring-violet-400/20',
      iconBgLight: 'bg-violet-50 text-violet-600 ring-violet-200',
      glowColor: 'bg-violet-400/8',
      textColor: 'text-violet-300',
      textColorLight: 'text-violet-700',
    },
    {
      label: 'Drivers today',
      value: loading ? '—' : String(drivers),
      sub: 'Unique assignments',
      Icon: UserCheck,
      accentFrom: 'from-amber-400',
      accentTo: 'to-yellow-500',
      iconBg: 'bg-gradient-to-br from-amber-400/20 to-yellow-500/10 text-amber-300 ring-amber-400/20',
      iconBgLight: 'bg-amber-50 text-amber-600 ring-amber-200',
      glowColor: 'bg-amber-400/8',
      textColor: 'text-amber-300',
      textColorLight: 'text-amber-700',
    },
  ]

  const outer =
    embedded !== true
      ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-5'
      : 'grid gap-2 sm:grid-cols-2 lg:grid-cols-5'

  const padding = embedded ? 'p-3.5' : 'p-4'
  const iconBox = embedded ? 'rounded-xl p-2.5' : 'rounded-xl p-3'
  const iconSize = embedded ? 20 : 22
  const valueCls = embedded
    ? 'text-xl font-bold tracking-tight'
    : 'text-2xl font-bold tracking-tight sm:text-3xl'

  return (
    <section className={outer}>
      {cards.map((c) => (
        <article
          key={c.label}
          className={`jc-neon-border group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[0_0_0_1px_rgb(34_211_238_/_0.03)_inset,0_20px_40px_-24px_rgb(0_0_0_/_0.4)] dark:hover:border-white/[0.12] dark:hover:bg-white/[0.05] ${padding}`}
        >
          {/* Corner glow (dark only) */}
          <div
            className={`pointer-events-none absolute -right-6 -top-8 size-24 rounded-full ${c.glowColor} blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-60`}
            aria-hidden
          />

          <div className="relative flex items-start gap-3">
            <div
              className={`shrink-0 ring-1 ${iconBox} ${c.iconBgLight} dark:${c.iconBg} backdrop-blur-sm`}
            >
              <c.Icon size={iconSize} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                {c.label}
              </p>
              <p
                className={`${valueCls} tabular-nums ${
                  loading
                    ? 'text-slate-300 dark:text-slate-500'
                    : `${c.textColorLight} dark:bg-gradient-to-r dark:from-white dark:to-slate-200 dark:bg-clip-text dark:text-transparent`
                }`}
              >
                {c.value}
              </p>
              {c.sub ? (
                <p className="mt-0.5 text-[11px] font-medium leading-snug text-slate-400 dark:font-mono dark:text-[10px] dark:text-slate-500">
                  {c.sub}
                </p>
              ) : null}
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${c.accentFrom} ${c.accentTo} opacity-0 transition-opacity duration-300 group-hover:opacity-60`} />
          </div>
        </article>
      ))}
    </section>
  )
}
