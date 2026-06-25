/**
 * Store 实现 — 直接借鉴 src/state/store.ts
 * 外部 store + useSyncExternalStore 模式
 */
import { useSyncExternalStore } from 'react'
import type { WorkspaceState } from '../types'
import { INITIAL_MESSAGES } from '../types'

type Listener = () => void
type OnChange<T> = (args: { newState: T; oldState: T }) => void

export type Store<T> = {
  getState: () => T
  setState: (updater: (prev: T) => T) => void
  subscribe: (listener: Listener) => () => void
}

export function createStore<T>(
  initialState: T,
  onChange?: OnChange<T>,
): Store<T> {
  let state = initialState
  const listeners = new Set<Listener>()

  return {
    getState: () => state,

    setState: (updater: (prev: T) => T) => {
      const prev = state
      const next = updater(prev)
      if (Object.is(next, prev)) return
      state = next
      onChange?.({ newState: next, oldState: prev })
      for (const listener of listeners) listener()
    },

    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const defaultWorkspaceState: WorkspaceState = {
  sidebarOpen: true,
  chatPanelOpen: true,
  activeRailItem: 'files',
  activeChatTab: 'chat',
  activeViewMode: 'normal',
  slashCommandOpen: false,
  slashCommandFilter: '',
  slashCommandIndex: 0,
  messages: INITIAL_MESSAGES,
  inputValue: '',
}

export const workspaceStore = createStore(defaultWorkspaceState)

/**
 * 借鉴 src/state/AppState.tsx 的 useAppState(selector) 模式
 * Subscribe to a slice of WorkspaceState.
 */
export function useWorkspaceState<T>(selector: (s: WorkspaceState) => T): T {
  return useSyncExternalStore(
    workspaceStore.subscribe,
    () => selector(workspaceStore.getState()),
    () => selector(defaultWorkspaceState),
  )
}

/**
 * 借鉴 useSetAppState() — returns stable setState reference.
 */
export function useSetWorkspaceState() {
  return workspaceStore.setState
}

export function useWorkspaceStore() {
  return workspaceStore
}
