import React, { useContext, useState, useSyncExternalStore } from 'react'
import { createStore, type Store } from './store.js'
import type { WorkspaceState } from '../types/index.js'
import { getDefaultWorkspaceState } from '../types/index.js'

// Borrowed from src/state/AppState.tsx — simplified for Web workspace
export const WorkspaceStoreContext = React.createContext<Store<WorkspaceState> | null>(null)

type Props = {
  children: React.ReactNode
  initialState?: WorkspaceState
}

export function WorkspaceStateProvider({ children, initialState }: Props) {
  const [store] = useState(() => createStore(initialState ?? getDefaultWorkspaceState()))
  return (
    <WorkspaceStoreContext.Provider value={store}>
      {children}
    </WorkspaceStoreContext.Provider>
  )
}

function useWorkspaceStore(): Store<WorkspaceState> {
  const store = useContext(WorkspaceStoreContext)
  if (!store) {
    throw new ReferenceError('useWorkspaceState cannot be called outside of a <WorkspaceStateProvider />')
  }
  return store
}

/**
 * Subscribe to a slice of WorkspaceState. Only re-renders when the selected value
 * changes (compared via Object.is).
 *
 * Borrowed from useAppState in src/state/AppState.tsx
 */
export function useWorkspaceState<T>(selector: (s: WorkspaceState) => T): T {
  const store = useWorkspaceStore()
  const get = () => selector(store.getState())
  return useSyncExternalStore(store.subscribe, get, get)
}

/**
 * Get the setState updater without subscribing to any state.
 * Returns a stable reference that never changes.
 */
export function useSetWorkspaceState() {
  return useWorkspaceStore().setState
}
