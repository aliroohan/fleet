import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../store/hooks'
import { focusVehicle } from '../store/uiSlice'
import { useMockFleet } from './useMockFleet'

/** Pick first unit once data loads so operational widgets have context */
export function useSeedFocusedVehicle() {
  const { fleet, loading } = useMockFleet()
  const dispatch = useAppDispatch()
  const seeded = useRef(false)

  useEffect(() => {
    if (!loading && fleet.length > 0 && !seeded.current) {
      seeded.current = true
      dispatch(focusVehicle(fleet[0].vehicle_id))
    }
  }, [loading, fleet, dispatch])
}
