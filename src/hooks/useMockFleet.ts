import { useContext } from 'react'
import { MockFleetContext, type MockFleetState } from '../context/mockFleetState'

export function useMockFleet(): MockFleetState {
  const ctx = useContext(MockFleetContext)
  if (!ctx) throw new Error('useMockFleet requires MockFleetProvider')
  return ctx
}
