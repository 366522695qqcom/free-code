import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'

type FileTreeNode = {
  name: string
  depth: number
  isFolder: boolean
  isExpanded?: boolean
  iconClass?: string
  iconSrc: string
  iconColor?: string
  isActive?: boolean
}

const FILE_TREE: FileTreeNode[] = [
  { name: 'my-project', depth: 0, isFolder: true, isExpanded: true, iconSrc: 'folder.svg', iconColor: 'var(--accent-amber)', iconClass: 'ds-filetree__icon--folder' },
  { name: 'src', depth: 1, isFolder: true, isExpanded: true, iconSrc: 'folder.svg', iconColor: 'var(--accent-amber)', iconClass: 'ds-filetree__icon--folder' },
  { name: 'app.tsx', depth: 2, isFolder: false, iconSrc: 'file-text.svg', iconColor: 'var(--accent-blue)', iconClass: 'ds-filetree__icon--ts', isActive: true },
  { name: 'components', depth: 2, isFolder: true, isExpanded: true, iconSrc: 'folder.svg', iconColor: 'var(--accent-amber)', iconClass: 'ds-filetree__icon--folder' },
  { name: 'Header.tsx', depth: 3, isFolder: false, iconSrc: 'file-text.svg', iconColor: 'var(--accent-blue)', iconClass: 'ds-filetree__icon--ts' },
  { name: 'Sidebar.tsx', depth: 3, isFolder: false, iconSrc: 'file-text.svg', iconColor: 'var(--accent-blue)', iconClass: 'ds-filetree__icon--ts' },
  { name: 'utils', depth: 2, isFolder: true, isExpanded: true, iconSrc: 'folder.svg', iconColor: 'var(--accent-amber)', iconClass: 'ds-filetree__icon--folder' },
  { name: 'helpers.ts', depth: 3, isFolder: false, iconSrc: 'file-text.svg', iconColor: 'var(--accent-blue)', iconClass: 'ds-filetree__icon--ts' },
  { name: 'package.json', depth: 1, isFolder: false, iconSrc: 'file.svg', iconColor: 'var(--code-constant)', iconClass: 'ds-filetree__icon--json' },
  { name: 'tsconfig.json', depth: 1, isFolder: false, iconSrc: 'file.svg', iconColor: 'var(--code-constant)', iconClass: 'ds-filetree__icon--json' },
  { name: 'README.md', depth: 1, isFolder: false, iconSrc: 'file-text.svg', iconColor: 'var(--accent-cyan)' },
]

export function Sidebar() {
  const sidebarOpen = useWorkspaceState(s => s.sidebarOpen)
  const setState = useSetWorkspaceState()

  if (!sidebarOpen) return null

  return (
    <div className="cc-sidebar" style={{ gridColumn: 2, gridRow: 2, display: 'flex', flexDirection: 'column', background: 'var(--bg-base-secondary)', borderRight: '1px solid var(--border-neutral-l1)', overflow: 'hidden' }}>
      <div className="cc-sidebar-section">
        <span>Explorer</span>
        <button title="Collapse sidebar" onClick={() => setState(prev => ({ ...prev, sidebarOpen: false }))}>
          <img src="/assets/icons/arrow-left.svg" width={14} height={14} alt="" />
        </button>
      </div>
      <div className="cc-sidebar-tree">
        <div className="ds-filetree" style={{ border: 'none', borderRadius: 0, padding: 0 }}>
          {FILE_TREE.map((node, i) => (
            <div
              key={i}
              className={`ds-filetree__row${node.isActive ? ' is-active' : ''}`}
              data-depth={node.depth}
            >
              <span className={`ds-filetree__chevron${!node.isFolder ? ' ds-filetree__chevron--leaf' : ''}`}>
                {node.isFolder && (
                  <img src="/assets/icons/chevron-down.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-tertiary)' }} />
                )}
              </span>
              <img
                src={`/assets/icons/${node.iconSrc}`}
                width={14}
                height={14}
                alt=""
                className={node.iconClass}
                style={{ color: node.iconColor }}
              />
              <span className="ds-filetree__label" style={node.depth === 0 ? { fontWeight: 'var(--font-weight-medium)' } : undefined}>
                {node.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
