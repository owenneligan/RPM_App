import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStore } from '../store'

/**
 * Watches the auth session and keeps the Zustand store in sync with Supabase.
 * - When a user logs in → fetch all their data and hydrate the store.
 * - When a user logs out → clear the store.
 */
export function useDataLoader() {
  const { user } = useAuth()
  const loadAllData = useStore((s) => s.loadAllData)
  const clearAllData = useStore((s) => s.clearAllData)

  useEffect(() => {
    if (user) {
      loadAllData(user.id)
    } else {
      clearAllData()
    }
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps
}
