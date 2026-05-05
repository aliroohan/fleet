import { useAppSelector } from '../store/hooks'

export function useChartPalette() {
  const dark = useAppSelector((s) => s.theme.mode === 'dark')
  return {
    tick: dark ? '#64748b' : '#64748b',
    grid: dark ? 'rgba(148,163,184,0.08)' : '#e2e8f0',
    label: dark ? '#e2e8f0' : '#1e293b',
    /** Recharts Tooltip panel */
    tooltipBg: dark ? 'rgba(3,10,26,0.95)' : '#ffffff',
    tooltipBorder: dark ? 'rgba(34,211,238,0.15)' : '#e2e8f0',
    tooltipItem: dark ? '#e2e8f0' : '#334155',
    bar: '#22d3ee',
    bar2: '#818cf8',
    line: '#34d399',
    danger: '#f87171',
    muted: dark ? 'rgba(148,163,184,0.12)' : '#cbd5e1',
  }
}
