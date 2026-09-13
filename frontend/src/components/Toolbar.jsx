import Icon, { ICONS } from './Icon.jsx';
import { TOOLS } from '../constants.js';

const TOOL_LIST = [
  { id: TOOLS.HAND,    icon: ICONS.hand,    label: 'Hand (pan)',  key: 'H' },
  'sep',
  { id: TOOLS.SELECT,  icon: ICONS.select,  label: 'Select',      key: 'V' },
  { id: TOOLS.RECT,    icon: ICONS.rect,    label: 'Rectangle',   key: 'R' },
  { id: TOOLS.ELLIPSE, icon: ICONS.ellipse, label: 'Ellipse',     key: 'E' },
  { id: TOOLS.ARROW,   icon: ICONS.arrow,   label: 'Arrow',       key: 'A' },
  { id: TOOLS.LINE,    icon: ICONS.line,     label: 'Line',        key: 'L' },
  { id: TOOLS.PEN,     icon: ICONS.pen,      label: 'Draw',        key: 'P' },
  { id: TOOLS.TEXT,    icon: ICONS.text,     label: 'Text',        key: 'T' },
  'sep',
  { id: TOOLS.ERASER,  icon: ICONS.eraser,  label: 'Eraser',      key: 'X' },
]

export default function Toolbar({ tool, onToolChange }) {
  return (
    <div className="toolbar-float floating-panel">
      {TOOL_LIST.map((t, i) =>
        t === 'sep' ? (
          <div key={`sep-${i}`} className="divider-h" />
        ) : (
          <button
            key={t.id}
            className={`tool-btn ${tool === t.id ? 'active' : ''}`}
            onClick={() => onToolChange(t.id)}
            style={{ width: 36, height: 36 }}
            title={`${t.label} — ${t.key}`}
          >
            <Icon d={t.icon} size={18} />
            <span className="tooltip">{t.label} — {t.key}</span>
          </button>
        )
      )}
    </div>
  )
}
