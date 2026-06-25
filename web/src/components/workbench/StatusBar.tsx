export function StatusBar() {
  return (
    <div className="cc-statusbar ds-statusbar" style={{ gridColumn: '1 / -1', gridRow: 3 }}>
      <div className="ds-statusbar__group">
        <div className="ds-statusbar__item">
          <img src="/assets/icons/git.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-secondary)' }} />
          <span>main</span>
        </div>
        <div className="ds-statusbar__item">
          <span className="ds-statusbar__dot ds-statusbar__dot--success" />
          <span>Synced</span>
        </div>
      </div>
      <div className="ds-statusbar__group">
        <div className="ds-statusbar__item">
          <img src="/assets/icons/alert-circle.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-secondary)' }} />
          <span>0</span>
          <img src="/assets/icons/alert.svg" width={14} height={14} alt="" style={{ color: 'var(--status-warning-default)' }} />
          <span>2</span>
        </div>
        <div className="ds-statusbar__item">
          <span>Ln 12, Col 34</span>
        </div>
        <div className="ds-statusbar__item">
          <span>UTF-8</span>
        </div>
        <div className="ds-statusbar__item">
          <span>TypeScript React</span>
        </div>
      </div>
    </div>
  )
}
