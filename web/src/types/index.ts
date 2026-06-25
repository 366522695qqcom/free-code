/**
 * 工作区状态类型定义
 * 借鉴 src/state/AppStateStore.ts 的 AppState 类型模式
 */

export type RailItem = 'files' | 'search' | 'git' | 'terminal' | 'sessions' | 'settings'
export type ChatTab = 'chat' | 'plan'
export type ViewMode = 'verbose' | 'normal' | 'summary'

export interface ToolUseMessage {
  type: 'tool-use'
  toolName: string
  filePath: string
  status: 'done' | 'progress'
  icon: string
}

export interface TextMessage {
  type: 'user' | 'assistant'
  content: string
}

export type ChatMessage = TextMessage | ToolUseMessage

export interface SlashCommand {
  command: string
  name: string
  desc: string
  icon: string
}

export interface FileNode {
  name: string
  depth: number
  type: 'folder' | 'file'
  icon: string
  iconColor?: string
  active?: boolean
  expanded?: boolean
  children?: FileNode[]
}

export interface EditorTab {
  name: string
  icon: string
  iconColor: string
  active: boolean
}

export interface WorkspaceState {
  sidebarOpen: boolean
  chatPanelOpen: boolean
  activeRailItem: RailItem
  activeChatTab: ChatTab
  activeViewMode: ViewMode
  slashCommandOpen: boolean
  slashCommandFilter: string
  slashCommandIndex: number
  messages: ChatMessage[]
  inputValue: string
}

export const SLASH_COMMANDS: SlashCommand[] = [
  { command: '/model', name: '/model', desc: '切换 Claude 模型', icon: 'sparkles' },
  { command: '/plan', name: '/plan', desc: '进入规划模式', icon: 'layout' },
  { command: '/clear', name: '/clear', desc: '清除当前会话上下文', icon: 'refresh' },
  { command: '/compact', name: '/compact', desc: '压缩上下文窗口', icon: 'arrow-minimize' },
  { command: '/cost', name: '/cost', desc: '查看当前会话 token 用量', icon: 'dollar' },
  { command: '/help', name: '/help', desc: '查看所有可用命令', icon: 'help' },
  { command: '/config', name: '/config', desc: '查看或修改配置项', icon: 'sliders' },
  { command: '/memory', name: '/memory', desc: '管理 CLAUDE.md 记忆文件', icon: 'file-text' },
]

export const FILE_TREE: FileNode[] = [
  {
    name: 'my-project', depth: 0, type: 'folder', icon: 'folder', iconColor: 'var(--accent-amber)', expanded: true,
    children: [
      {
        name: 'src', depth: 1, type: 'folder', icon: 'folder', iconColor: 'var(--accent-amber)', expanded: true,
        children: [
          { name: 'app.tsx', depth: 2, type: 'file', icon: 'file-text', iconColor: 'var(--accent-blue)', active: true },
          {
            name: 'components', depth: 2, type: 'folder', icon: 'folder', iconColor: 'var(--accent-amber)', expanded: true,
            children: [
              { name: 'Header.tsx', depth: 3, type: 'file', icon: 'file-text', iconColor: 'var(--accent-blue)' },
              { name: 'Sidebar.tsx', depth: 3, type: 'file', icon: 'file-text', iconColor: 'var(--accent-blue)' },
            ],
          },
          {
            name: 'utils', depth: 2, type: 'folder', icon: 'folder', iconColor: 'var(--accent-amber)', expanded: true,
            children: [
              { name: 'helpers.ts', depth: 3, type: 'file', icon: 'file-text', iconColor: 'var(--accent-blue)' },
            ],
          },
        ],
      },
      { name: 'package.json', depth: 1, type: 'file', icon: 'file', iconColor: 'var(--code-constant)' },
      { name: 'tsconfig.json', depth: 1, type: 'file', icon: 'file', iconColor: 'var(--code-constant)' },
      { name: 'README.md', depth: 1, type: 'file', icon: 'file-text', iconColor: 'var(--accent-cyan)' },
    ],
  },
]

export const EDITOR_TABS: EditorTab[] = [
  { name: 'app.tsx', icon: 'file-text', iconColor: 'var(--accent-blue)', active: true },
  { name: 'helpers.ts', icon: 'file-text', iconColor: 'var(--accent-blue)', active: false },
  { name: 'package.json', icon: 'file', iconColor: 'var(--code-constant)', active: false },
]

export const EDITOR_CODE = `import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className={\`app \${theme}\`}>
      <Header
        theme={theme}
        onToggle={() =>
          setTheme(t => t === 'dark' ? 'light' : 'dark')
        }
      />
      <Sidebar />
    </div>
  );
}`

export const INITIAL_MESSAGES: ChatMessage[] = [
  { type: 'user', content: '帮我重构 App 组件，把 theme 状态提升到 Context 中' },
  { type: 'assistant', content: '好的，我来帮你重构。首先让我查看当前的代码结构...' },
  { type: 'tool-use', toolName: 'Read', filePath: 'app.tsx', status: 'done', icon: 'file-text' },
  { type: 'tool-use', toolName: 'Write', filePath: 'ThemeContext.tsx', status: 'progress', icon: 'edit' },
  { type: 'assistant', content: '我已经创建了 ThemeContext，现在更新 App 组件来使用它...' },
]
