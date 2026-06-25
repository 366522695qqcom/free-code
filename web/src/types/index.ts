export type RailItem = 'files' | 'search' | 'git' | 'terminal'
export type ChatTab = 'chat' | 'plan'
export type ViewMode = 'verbose' | 'normal' | 'summary'

export type ChatMessage = {
  id: string
  type: 'user' | 'assistant' | 'tool-use'
  content: string
  toolName?: string
  toolStatus?: 'done' | 'progress' | 'error'
  timestamp: number
}

export type EditorTab = {
  id: string
  name: string
  icon: string
  isActive: boolean
}

export type SlashCommand = {
  name: string
  description: string
  shortcut?: string
}

export type WorkspaceState = {
  sidebarOpen: boolean
  chatPanelOpen: boolean
  activeRailItem: RailItem
  activeChatTab: ChatTab
  activeViewMode: ViewMode
  slashCommandOpen: boolean
  slashCommandFilter: string
  slashCommandIndex: number
  messages: ChatMessage[]
  editorTabs: EditorTab[]
  activeEditorTab: string | null
  settingsActiveNav: string
  sessionsActiveTab: 'active' | 'history' | 'archived'
  newSessionModalOpen: boolean
}

export function getDefaultWorkspaceState(): WorkspaceState {
  return {
    sidebarOpen: true,
    chatPanelOpen: true,
    activeRailItem: 'files',
    activeChatTab: 'chat',
    activeViewMode: 'normal',
    slashCommandOpen: false,
    slashCommandFilter: '',
    slashCommandIndex: 0,
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Help me refactor the authentication module to use JWT tokens instead of session cookies',
        timestamp: Date.now() - 60000,
      },
      {
        id: '2',
        type: 'assistant',
        content: 'I\'ll help you refactor the authentication module. Let me start by examining the current implementation.\n\nFirst, let me look at the existing session-based auth code:',
        timestamp: Date.now() - 55000,
      },
      {
        id: '3',
        type: 'tool-use',
        content: 'src/auth/session.ts',
        toolName: 'Read',
        toolStatus: 'done',
        timestamp: Date.now() - 50000,
      },
      {
        id: '4',
        type: 'assistant',
        content: 'Now I can see the current implementation. Here\'s my plan:\n\n1. **Create JWT utility module** — `src/auth/jwt.ts`\n2. **Update auth middleware** — Replace session validation with JWT verification\n3. **Modify login endpoint** — Issue JWT tokens instead of session cookies\n4. **Add refresh token logic** — For long-lived sessions\n\nLet me start implementing:',
        timestamp: Date.now() - 45000,
      },
      {
        id: '5',
        type: 'tool-use',
        content: 'src/auth/jwt.ts',
        toolName: 'Write',
        toolStatus: 'done',
        timestamp: Date.now() - 40000,
      },
      {
        id: '6',
        type: 'tool-use',
        content: 'src/auth/middleware.ts',
        toolName: 'Edit',
        toolStatus: 'progress',
        timestamp: Date.now() - 35000,
      },
    ],
    editorTabs: [
      { id: '1', name: 'jwt.ts', icon: 'code', isActive: true },
      { id: '2', name: 'middleware.ts', icon: 'code', isActive: false },
      { id: '3', name: 'session.ts', icon: 'code', isActive: false },
    ],
    activeEditorTab: '1',
    settingsActiveNav: 'general',
    sessionsActiveTab: 'active',
    newSessionModalOpen: false,
  }
}

export const SLASH_COMMANDS: SlashCommand[] = [
  { name: '/help', description: 'Show available commands', shortcut: '⌘H' },
  { name: '/clear', description: 'Clear conversation history' },
  { name: '/compact', description: 'Compact conversation context' },
  { name: '/config', description: 'Open configuration' },
  { name: '/cost', description: 'Show token usage and costs' },
  { name: '/doctor', description: 'Check installation health' },
  { name: '/init', description: 'Initialize project configuration' },
  { name: '/login', description: 'Switch Anthropic account' },
  { name: '/logout', description: 'Sign out of account' },
  { name: '/model', description: 'Change the AI model' },
  { name: '/permissions', description: 'Manage tool permissions' },
  { name: '/review', description: 'Review code changes' },
  { name: '/status', description: 'Show session status' },
  { name: '/vim', description: 'Toggle vim keybindings' },
]
