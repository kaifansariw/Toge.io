import { useState } from 'react'
import Icon, { ICONS } from './Icon.jsx'

export default function TopBar({
  onUndo, onRedo, canUndo, canRedo,
  zoom, onResetZoom, onZoomIn, onZoomOut,
  elementCount,
  onClear,
  onToggleCollab,
  collabActive,
}) {
  const [showMenu, setShowMenu] = useState(false)

  // Prevent pointer events from reaching the canvas beneath
  const stopPointer = (e) => e.stopPropagation()

  return (
    <>
      {/* ─── Top-Left: Hamburger Menu ─── */}
      <div className="top-left-area" onPointerDown={stopPointer} onPointerUp={stopPointer}
        style={showMenu ? { zIndex: 100 } : undefined}
      >
        <div style={{ position: 'relative' }}>
          <button
            className="menu-btn"
            onClick={() => setShowMenu(v => !v)}
            title="Menu"
          >
            <Icon d={ICONS.menu} size={18} />
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close */}
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 98,
                }}
                onClick={() => setShowMenu(false)}
                onPointerDown={stopPointer}
              />
              <div
                className="main-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  zIndex: 99,
                }}
              >
                <button onClick={() => { onClear(); setShowMenu(false) }} className="danger">
                  <Icon d={ICONS.trash} size={16} />
                  Clear canvas
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Top-Right: Collab Button ─── */}
      <div className="top-right-area" onPointerDown={stopPointer}>
        {/* Element count badge */}
        <span style={{
          fontSize: 11,
          color: '#868e96',
          fontWeight: 500,
        }}>
          {elementCount} element{elementCount !== 1 ? 's' : ''}
        </span>

        <button
          className={`collab-btn ${collabActive ? 'connected' : ''}`}
          onClick={onToggleCollab}
          title="Live Collaboration"
        >
          <Icon d={ICONS.collab} size={16} />
          {collabActive ? 'Connected' : 'Share'}
        </button>
      </div>

      {/* ─── Bottom-Left: Zoom + Undo/Redo ─── */}
      <div className="bottom-left-area" onPointerDown={stopPointer}>
        {/* Zoom controls */}
        <div className="floating-panel zoom-control">
          <button onClick={onZoomOut} title="Zoom out">
            <Icon d={ICONS.minus} size={14} />
          </button>
          <span
            className="zoom-value"
            onClick={onResetZoom}
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={onZoomIn} title="Zoom in">
            <Icon d={ICONS.plus} size={14} />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="floating-panel history-control">
          <button
            className="tool-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo — Ctrl+Z"
            style={{ padding: 6 }}
          >
            <Icon d={ICONS.undo} size={16} />
          </button>
          <button
            className="tool-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo — Ctrl+Y"
            style={{ padding: 6 }}
          >
            <Icon d={ICONS.redo} size={16} />
          </button>
        </div>
      </div>

      {/* ─── Bottom-Right: Help Badge ─── */}
      <div className="bottom-right-area" onPointerDown={stopPointer}>
        <div className="help-badge">
          <Icon d={ICONS.help} size={14} />
          Alt+drag pan · Scroll zoom
        </div>
      </div>
    </>
  )
}
