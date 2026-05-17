import Icon, { ICONS } from './Icon.jsx'
import { TOOLS } from '../constants.js'

const TOOL_LIST = [
  { id: TOOLS.SELECT,  icon: ICONS.select,  label: 'Select',    key: 'V' },
  { id: TOOLS.PEN,     icon: ICONS.pen,     label: 'Pen',       key: 'P' },
  { id: TOOLS.RECT,    icon: ICONS.rect,    label: 'Rectangle', key: 'R' },
  { id: TOOLS.ELLIPSE, icon: ICONS.ellipse, label: 'Ellipse',   key: 'E' },
  { id: TOOLS.ARROW,   icon: ICONS.arrow,   label: 'Arrow',     key: 'A' },
  { id: TOOLS.LINE,    icon: ICONS.line,    label: 'Line',      key: 'L' },
  { id: TOOLS.TEXT,    icon: ICONS.text,    label: 'Text',      key: 'T' },
  { id: TOOLS.ERASER,  icon: ICONS.eraser,  label: 'Eraser',    key: 'X' },
]

export default function Toolbar({ tool, onToolChange }) {
  return (
    <aside style={{
      width: 56,
      background: '#16213e',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      gap: 4,
      zIndex: 10,
      flexShrink: 0,
    }}>
      {TOOL_LIST.map((t, i) => (
        <button
          key={t.id}
          className={`tool-btn ${tool === t.id ? 'active' : ''}`}
          onClick={() => onToolChange(t.id)}
          style={{ width: 40, height: 40 }}
          title={`${t.label} (${t.key})`}
        >
          <Icon d={t.icon} size={18} />
          <span className="tooltip right">{t.label} ({t.key})</span>
        </button>
      ))}

      {/* Separator */}
      <div style={{ flex: 1 }} />
    </aside>
  )
}
