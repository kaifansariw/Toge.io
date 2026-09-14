import { useState, useRef } from 'react';
import Icon, { ICONS } from './Icon.jsx';
import { TOOLS, COLORS, STROKE_WIDTHS } from '../constants.js';

// Tools that reveal the color / stroke palette
const DRAWING_TOOLS = new Set([
  TOOLS.RECT, TOOLS.ELLIPSE, TOOLS.ARROW, TOOLS.LINE, TOOLS.PEN, TOOLS.TEXT,
]);

const TOOL_LIST = [
  { id: TOOLS.HAND,    icon: ICONS.hand,    label: 'Hand',       key: 'H' },
  'sep',
  { id: TOOLS.SELECT,  icon: ICONS.select,  label: 'Select',     key: 'V' },
  { id: TOOLS.RECT,    icon: ICONS.rect,    label: 'Rectangle',  key: 'R' },
  { id: TOOLS.ELLIPSE, icon: ICONS.ellipse, label: 'Circle',     key: 'E' },
  { id: TOOLS.ARROW,   icon: ICONS.arrow,   label: 'Arrow',      key: 'A' },
  { id: TOOLS.LINE,    icon: ICONS.line,    label: 'Line',       key: 'L' },
  { id: TOOLS.PEN,     icon: ICONS.pen,     label: 'Draw',       key: 'P' },
  { id: TOOLS.TEXT,    icon: ICONS.text,    label: 'Text',       key: 'T' },
  'sep',
  { id: TOOLS.ERASER,  icon: ICONS.eraser,  label: 'Eraser',     key: 'X' },
];

export default function Toolbar({
  tool, onToolChange,
  color, setColor,
  strokeWidth, setStrokeWidth,
  fill, setFill,
  onInsertImage,
}) {
  const [showMore, setShowMore] = useState(false);
  const fileInputRef = useRef(null);

  const showPalette = DRAWING_TOOLS.has(tool);
  const stopPointer = (e) => e.stopPropagation();

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onInsertImage?.(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      {/* ─── Main Toolbar ─── */}
      <div className="toolbar-float floating-panel" onPointerDown={stopPointer}>
        {TOOL_LIST.map((t, i) =>
          t === 'sep' ? (
            <div key={`sep-${i}`} className="divider-h" />
          ) : (
            <button
              key={t.id}
              className={`tool-btn ${tool === t.id ? 'active' : ''}`}
              onClick={() => onToolChange(t.id)}
              title={`${t.label} — ${t.key}`}
            >
              <Icon d={t.icon} size={18} />
              <span className="tooltip">{t.label} — {t.key}</span>
            </button>
          )
        )}

        {/* Separator before More */}
        <div className="divider-h" />

        {/* ··· More Options */}
        <div style={{ position: 'relative' }}>
          <button
            className={`tool-btn ${showMore ? 'active' : ''}`}
            onClick={() => setShowMore(v => !v)}
            title="More options"
          >
            <span className="more-dots">···</span>
            <span className="tooltip">More options</span>
          </button>

          {showMore && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setShowMore(false)}
                onPointerDown={stopPointer}
              />
              <div className="more-menu" onPointerDown={stopPointer}>
                <button
                  className="more-menu-item"
                  onClick={() => { fileInputRef.current?.click(); setShowMore(false); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Insert Image
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Color / Stroke Palette (only for drawing tools) ─── */}
      {showPalette && (
        <div className="palette-popup floating-panel" onPointerDown={stopPointer}>
          <div className="palette-section-label">Stroke</div>
          <div className="palette-swatches">
            {COLORS.map(c => (
              <div
                key={c}
                className={`swatch ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>

          <div className="divider-v" />

          <div className="palette-section-label">Width</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            {STROKE_WIDTHS.map(w => (
              <button
                key={w}
                className={`stroke-btn ${strokeWidth === w ? 'active' : ''}`}
                onClick={() => setStrokeWidth(w)}
                title={`${w}px`}
              >
                <div style={{
                  width: 20,
                  height: Math.max(Math.min(w, 8), 1),
                  background: strokeWidth === w ? 'var(--color-primary)' : '#868e96',
                  borderRadius: w / 2,
                }} />
              </button>
            ))}
          </div>

          <div className="divider-v" />

          <div className="palette-section-label">Fill</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div
              onClick={() => setFill('transparent')}
              style={{
                width: 28, height: 28,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                border: fill === 'transparent' ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.12s ease',
              }}
              title="No fill"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" style={{ position: 'absolute', inset: 0 }}>
                <line x1="2" y1="26" x2="26" y2="2" stroke="#e03131" strokeWidth="1.5" />
              </svg>
            </div>
            <div
              onClick={() => setFill(color)}
              style={{
                width: 28, height: 28,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: color,
                border: fill !== 'transparent' ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                transition: 'border-color 0.12s ease',
              }}
              title="Solid fill"
            />
          </div>
        </div>
      )}

      {/* Hidden file input for image insert */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFile}
      />
    </>
  );
}
