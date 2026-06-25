/**
 * App 根组件
 * 借鉴 src/components/App.tsx 的 Provider 嵌套模式
 * 借鉴 src/components/FullscreenLayout.tsx 的分层布局思路
 */
import { useWorkspaceState } from './state/store'
import { Titlebar } from './components/Titlebar'
import { ActivityRail } from './components/ActivityRail'
import { Sidebar } from './components/Sidebar'
import { EditorArea } from './components/EditorArea'
import { ChatPanel } from './components/ChatPanel'
import { StatusBar } from './components/StatusBar'

export function App() {
  const sidebarOpen = useWorkspaceState(s => s.sidebarOpen)
  const chatPanelOpen = useWorkspaceState(s => s.chatPanelOpen)

  // 动态计算 grid-template-columns — 借鉴设计稿的 cc-workbench 布局
  const gridCols = [
    '48px',
    sidebarOpen ? '260px' : '0px',
    '1fr',
    chatPanelOpen ? 'minmax(0, 480px)' : '0px',
  ].join(' ')

  return (
    <div
      className="cc-workbench"
      style={{
        gridTemplateColumns: gridCols,
      }}
    >
      <Titlebar />
      <ActivityRail />
      {sidebarOpen && <Sidebar />}
      <EditorArea />
      {chatPanelOpen && <ChatPanel />}
      <StatusBar />
    </div>
  )
}
