/**
 * Sidebar 侧边栏 + FileTree
 * 从设计稿 workspace.html 转换
 */
import { usePanelToggle } from '../hooks/usePanelToggle'
import { FILE_TREE, type FileNode } from '../types'

function renderNode(node: FileNode, key: string): React.ReactNode {
  const isLeaf = node.type === 'file' || !node.expanded
  return (
    <div key={key}>
      <div
        className={`ds-filetree__row ${node.active ? 'is-active' : ''}`}
        data-depth={node.depth}
        style={{ paddingLeft: `calc(${node.depth} * var(--spacer-12) + var(--spacer-8))` }}
      >
        <span className={`ds-filetree__chevron ${isLeaf ? 'ds-filetree__chevron--leaf' : ''}`}>
          {!isLeaf && (
            <img src="/assets/icons/chevron-down.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-tertiary)' }} />
          )}
        </span>
        <img
          src={`/assets/icons/${node.icon}.svg`}
          width={14}
          height={14}
          alt=""
          style={{ color: node.iconColor }}
        />
        <span className="ds-filetree__label" style={node.depth === 0 ? { fontWeight: 'var(--font-weight-medium)' } : undefined}>
          {node.name}
        </span>
      </div>
      {node.expanded && node.children?.map((child, i) => renderNode(child, `${key}-${i}`))}
    </div>
  )
}

export function Sidebar() {
  const { toggleSidebar } = usePanelToggle()

  return (
    <div className="cc-sidebar">
      <div className="cc-sidebar-section">
        <span>Explorer</span>
        <button title="Collapse sidebar" onClick={toggleSidebar}>
          <img src="/assets/icons/arrow-left.svg" width={14} height={14} alt="" />
        </button>
      </div>
      <div className="cc-sidebar-tree">
        <div className="ds-filetree" style={{ border: 'none', borderRadius: 0, padding: 0 }}>
          {FILE_TREE.map((node, i) => renderNode(node, `root-${i}`))}
        </div>
      </div>
    </div>
  )
}
