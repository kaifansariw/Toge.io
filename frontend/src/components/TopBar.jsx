import Icon, { ICONS } from './Icon.jsx'

export default function TopBar({
  onUndo, onRedo, canUndo, canRedo,
  zoom, onResetZoom,
  elementCount,
  onClear,
  onToggleCollab,
  collabActive,
}) {
  return (
    <header style={{
      height: 52,
      background: '#16213e',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      zIndex: 20,
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 1,
        marginRight: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ color: '#8be9fd' }}></span>
        <span style={{
          color: '#ffb86c',
        }}>
         Toge.io
        </span>
      </div>

      <div className="divider-h" />

      {/* Undo */}
      <button
        className="tool-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Icon d={ICONS.undo} size={17} />
        <span className="tooltip">Undo (Ctrl+Z)</span>
      </button>

      {/* Redo */}
      <button
        className="tool-btn"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Icon d={ICONS.redo} size={17} />
        <span className="tooltip">Redo (Ctrl+Y)</span>
      </button>

      <div className="divider-h" />

      {/* Zoom */}
      <button
        className="zoom-badge"
        onClick={onResetZoom}
        title="Reset zoom (click)"
      >
        {Math.round(zoom * 100)}%
      </button>

      <div style={{ flex: 1 }} />

      {/* Element count */}
      <span style={{ color:'#ffffff', fontSize: 11 }}>
        {elementCount} element{elementCount !== 1 ? 's' : ''}
      </span>

      <div className="divider-h" />

      {/* Clear */}
      <button
        className="tool-btn"
        onClick={onClear}
        title="Clear canvas"
      >
        <Icon d={ICONS.trash} size={17} />
        <span className="tooltip">Clear canvas</span>
      </button>

      {/* Collaboration */}
      <button
        className={`tool-btn ${collabActive ? 'active' : ''}`}
        onClick={onToggleCollab}
        title="Collaboration"
        style={{ position: 'relative' }}
      >
        <Icon d={ICONS.collab} size={17} />
        {collabActive && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            background: '#50fa7b',
            borderRadius: '50%',
            border: '1.5px solid #16213e',
            boxShadow: '0 0 6px #50fa7b',
          }} />
        )}
        <span className="tooltip">Collaboration</span>
      </button>
    </header>
  )
}
