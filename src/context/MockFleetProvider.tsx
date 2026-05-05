import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadAllMockData } from '../data/fleetData'
import { MockFleetContext, type MockFleetState } from './mockFleetState'

export function MockFleetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockFleetState>({
    loading: true,
    error: null,
    fleet: [],
    trips: [],
    alerts: [],
  })

  useEffect(() => {
    let cancelled = false
    loadAllMockData()
      .then((d) => {
        if (!cancelled)
          setState({
            loading: false,
            error: null,
            fleet: d.fleet,
            trips: d.trips,
            alerts: d.alerts,
          })
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState((s) => ({
            ...s,
            loading: false,
            error: e instanceof Error ? e.message : String(e),
          }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => state, [state])

  return (
    <MockFleetContext.Provider value={value}>
      {children}
    </MockFleetContext.Provider>
  )
}
