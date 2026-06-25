/**
 * 面板折叠/展开 hook
 * 借鉴 src/state/AppState.tsx 的 useAppState + useSetAppState 模式
 */
import { useCallback } from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../state/store'

export function usePanelToggle() {
  const sidebarOpen = useWorkspaceState(s => s.sidebarOpen)
  const chatPanelOpen = useWorkspaceState(s => s.chatPanelOpen)
  const setState = useSetWorkspaceState()

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }, [setState])

  const toggleChatPanel = useCallback(() => {
    setState(prev => ({ ...prev, chatPanelOpen: !prev.chatPanelOpen }))
  }, [setState])

  return { sidebarOpen, chatPanelOpen, toggleSidebar, toggleChatPanel }
}
