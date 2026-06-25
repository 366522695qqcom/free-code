import { Fragment } from 'react'
import type { ReactNode, FC } from 'react'
import { useWorkspaceState } from '../../state/WorkspaceState.js'

/* ── Shared sub-components ─────────────────────────────────── */

function SettingRow({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: ReactNode
}) {
  return (
    <div className="ds-settingrow">
      <div className="ds-settingrow__main">
        <span className="ds-settingrow__title">{title}</span>
        <span className="ds-settingrow__desc">{desc}</span>
      </div>
      <div className="ds-settingrow__control">{children}</div>
    </div>
  )
}

function SettingSelect({
  value,
  options: _options,
}: {
  value: string
  options: string[]
}) {
  return (
    <button className="ds-settingrow__select">
      {value}
      <img src="/assets/icons/chevron-down.svg" width={16} height={16} alt="" className="icon" />
    </button>
  )
}

function SettingSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="ds-switch">
      <input type="checkbox" defaultChecked={defaultChecked} />
      <span className="ds-switch__thumb" />
    </label>
  )
}

function SettingButton({
  children,
  variant,
}: {
  children: ReactNode
  variant?: 'default' | 'danger'
}) {
  const cls = variant === 'danger' ? 'ds-settingrow__btn ds-settingrow__btn--danger' : 'ds-settingrow__btn'
  return <button className={cls}>{children}</button>
}

function GroupLabel({ children }: { children: ReactNode }) {
  return <span className="ds-settingrow__grouplabel">{children}</span>
}

function Panel({ children }: { children: ReactNode }) {
  return <div className="ds-settingrow__panel">{children}</div>
}

function KbdCombo({ keys }: { keys: string[] }) {
  return (
    <span className="ds-kbd__combo">
      {keys.map((k, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="ds-kbd__plus">+</span>}
          <span className="ds-kbd">{k}</span>
        </Fragment>
      ))}
    </span>
  )
}

/* ── Section panels ────────────────────────────────────────── */

function GeneralSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Basic Settings</GroupLabel>
        <Panel>
          <SettingRow title="Default Model" desc="Choose the default model for Claude Code">
            <SettingSelect value="Claude 4 Opus" options={['Claude 4 Opus', 'Claude 4 Sonnet', 'Claude 3.5 Sonnet']} />
          </SettingRow>
          <SettingRow title="Context Window" desc="Set the context window size">
            <SettingSelect value="200K tokens" options={['200K tokens', '128K tokens', '100K tokens']} />
          </SettingRow>
          <SettingRow title="Auto Save" desc="Automatically save session progress">
            <SettingSwitch defaultChecked />
          </SettingRow>
          <SettingRow title="Notifications" desc="Send notifications when tasks complete">
            <SettingSwitch />
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

function ModelSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Model Selection</GroupLabel>
        <Panel>
          <SettingRow title="Default Model" desc="Choose the default model for Claude Code">
            <SettingSelect value="Claude 4 Opus" options={['Claude 4 Opus', 'Claude 4 Sonnet', 'Claude 3.5 Sonnet']} />
          </SettingRow>
          <SettingRow title="Context Window" desc="Set the context window size">
            <SettingSelect value="200K tokens" options={['200K tokens', '128K tokens', '100K tokens']} />
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

function PermissionsSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Permission Management</GroupLabel>
        <Panel>
          <SettingRow title="File Read/Write" desc="Allow Claude Code to read and write files">
            <SettingSelect value="Ask before executing" options={['Ask before executing', 'Always allow', 'Never allow']} />
          </SettingRow>
          <SettingRow title="Command Execution" desc="Allow executing terminal commands">
            <SettingSelect value="Ask before executing" options={['Ask before executing', 'Always allow', 'Never allow']} />
          </SettingRow>
          <SettingRow title="MCP Tools" desc="Allow using external MCP tools">
            <SettingSelect value="Always allow" options={['Always allow', 'Ask before executing', 'Never allow']} />
          </SettingRow>
          <SettingRow title="Network Access" desc="Allow Claude Code to access the network">
            <SettingSwitch />
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

function AppearanceSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Appearance Settings</GroupLabel>
        <Panel>
          <SettingRow title="Theme" desc="Choose the interface theme">
            <SettingSelect value="Dark" options={['Dark', 'Light']} />
          </SettingRow>
          <SettingRow title="Font Size" desc="Editor font size">
            <SettingButton>14px</SettingButton>
          </SettingRow>
          <SettingRow title="Terminal Font Size" desc="Terminal output font size">
            <SettingButton>12px</SettingButton>
          </SettingRow>
          <SettingRow title="Line Numbers" desc="Show line numbers in the editor">
            <SettingSwitch defaultChecked />
          </SettingRow>
          <SettingRow title="Minimap" desc="Show code minimap">
            <SettingSwitch />
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

function ShortcutsSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Keyboard Shortcuts</GroupLabel>
        <Panel>
          <SettingRow title="New Session" desc="Start a new chat session">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', 'N']} />
            </div>
          </SettingRow>
          <SettingRow title="Toggle Sidebar" desc="Show or hide the file sidebar">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', 'B']} />
            </div>
          </SettingRow>
          <SettingRow title="Toggle Chat" desc="Show or hide the chat panel">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', 'J']} />
            </div>
          </SettingRow>
          <SettingRow title="Command Palette" desc="Open the command palette">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', 'Shift', 'P']} />
            </div>
          </SettingRow>
          <SettingRow title="Search Files" desc="Search across project files">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', 'P']} />
            </div>
          </SettingRow>
          <SettingRow title="Settings" desc="Open settings page">
            <div className="ds-kbd__row">
              <KbdCombo keys={['Ctrl', ',']} />
            </div>
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

function DataSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>Data Management</GroupLabel>
        <Panel>
          <SettingRow title="Session History" desc="Keep recent session records">
            <SettingSelect value="30 days" options={['7 days', '14 days', '30 days', '90 days', 'Forever']} />
          </SettingRow>
          <SettingRow title="Export Config" desc="Export current configuration as JSON">
            <SettingButton>
              <img src="/assets/icons/download.svg" width={16} height={16} alt="" className="icon" />
              Export
            </SettingButton>
          </SettingRow>
          <SettingRow title="Clear History" desc="Clear all session history records">
            <SettingButton variant="danger">
              <img src="/assets/icons/trash.svg" width={16} height={16} alt="" className="icon" />
              Clear History
            </SettingButton>
          </SettingRow>
        </Panel>
      </div>

      <div className="danger-zone">
        <div className="ds-alert ds-alert--danger">
          <span className="ds-alert__icon">
            <img src="/assets/icons/alert-circle.svg" width={16} height={16} alt="" className="icon" />
          </span>
          <div>
            <div className="ds-alert__title">Danger Zone</div>
            <div className="ds-alert__desc">The following actions are irreversible. Please proceed with caution.</div>
            <div className="ds-alert__actions">
              <button className="ds-btn ds-btn--danger">Reset All Settings</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function AboutSection() {
  return (
    <>
      <div className="ds-settingrow__group">
        <GroupLabel>About</GroupLabel>
        <Panel>
          <SettingRow title="Version" desc="Claude Code Web UI version">
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--body-sm-font-size)' }}>0.1.0</span>
          </SettingRow>
          <SettingRow title="API Version" desc="Claude API version">
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--body-sm-font-size)' }}>2024-01-01</span>
          </SettingRow>
          <SettingRow title="Release Channel" desc="Current update channel">
            <SettingSelect value="Stable" options={['Stable', 'Beta', 'Canary']} />
          </SettingRow>
          <SettingRow title="Check for Updates" desc="Check if a new version is available">
            <SettingButton>
              <img src="/assets/icons/refresh.svg" width={16} height={16} alt="" className="icon" />
              Check Now
            </SettingButton>
          </SettingRow>
        </Panel>
      </div>

      <div className="ds-settingrow__group">
        <GroupLabel>Links</GroupLabel>
        <Panel>
          <SettingRow title="Documentation" desc="Read the official documentation">
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-settingrow__btn"
              style={{ textDecoration: 'none' }}
            >
              <img src="/assets/icons/external.svg" width={16} height={16} alt="" className="icon" />
              Open
            </a>
          </SettingRow>
          <SettingRow title="Report Issue" desc="Submit a bug report or feature request">
            <a
              href="https://github.com/anthropics/claude-code/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="ds-settingrow__btn"
              style={{ textDecoration: 'none' }}
            >
              <img src="/assets/icons/bug.svg" width={16} height={16} alt="" className="icon" />
              Open
            </a>
          </SettingRow>
        </Panel>
      </div>
    </>
  )
}

/* ── Main content router ───────────────────────────────────── */

const SECTION_MAP: Record<string, FC> = {
  general: GeneralSection,
  model: ModelSection,
  context: ModelSection,
  permissions: PermissionsSection,
  tools: PermissionsSection,
  'auto-approve': PermissionsSection,
  theme: AppearanceSection,
  'font-size': AppearanceSection,
  highlight: AppearanceSection,
  keybindings: ShortcutsSection,
  'custom-shortcuts': ShortcutsSection,
  history: DataSection,
  export: DataSection,
  about: AboutSection,
}

export function SettingsContent() {
  const activeNav = useWorkspaceState(s => s.settingsActiveNav)
  const Section = SECTION_MAP[activeNav] ?? GeneralSection

  return (
    <main className="settings-content">
      <Section />
    </main>
  )
}
