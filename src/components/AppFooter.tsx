import { Eye, Bell, Clock, Shield, Zap } from 'lucide-react'
import type { ComponentType } from 'react'

const ITEMS: { title: string; desc: string; Icon: ComponentType<{ className?: string; size?: number }> }[] = [
  {
    title: 'Better overview',
    desc: 'See fleet status at a glance.',
    Icon: Eye,
  },
  {
    title: 'Faster response',
    desc: 'React quickly to alarms.',
    Icon: Bell,
  },
  {
    title: 'Less manual work',
    desc: 'Automate routine checks.',
    Icon: Clock,
  },
  {
    title: 'Stronger documentation',
    desc: 'Evidence for compliance.',
    Icon: Shield,
  },
  {
    title: 'Adaptable',
    desc: 'Fit your operation.',
    Icon: Zap,
  },
]

export function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-white/[0.04] dark:bg-[#030a1a]/90 dark:text-slate-300 dark:backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1680px] gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
        {ITEMS.map((item) => (
          <div key={item.title} className="group flex gap-3">
            <div className="shrink-0 text-blue-500 transition-colors group-hover:text-blue-600 dark:text-cyan-400/60 dark:group-hover:text-cyan-300">
              <item.Icon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-800 dark:text-white/90">{item.title}</p>
              <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 py-3.5 text-center dark:border-white/[0.04]">
        <p className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-500">
          JAXICLOUD · FLEET MANAGEMENT · TOGETHER WE SHOW THE WAY
        </p>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-600">
          Fleet management concept UI · mock data for demonstration
        </p>
      </div>
    </footer>
  )
}
