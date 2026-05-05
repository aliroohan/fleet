import type { ReactNode } from 'react'

export function WidgetChrome({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[0_0_0_1px_rgb(34_211_238_/_0.03)_inset,0_24px_55px_-18px_rgb(0_0_0_/_0.55)] dark:backdrop-blur-xl">
      {/* Header */}
      <div className="relative flex shrink-0 items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
        {/* Top neon line (dark only) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent dark:via-cyan-400/30"
          aria-hidden
        />
        <div className="min-w-0 pt-0.5">
          <h3 className="truncate text-[15px] font-bold tracking-tight text-slate-800 dark:text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-0.5 text-[12px] leading-snug text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white p-3 dark:bg-white/[0.01]">
        {children}
      </div>
    </div>
  )
}
