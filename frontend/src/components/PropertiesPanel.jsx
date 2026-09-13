import { COLORS, STROKE_WIDTHS } from '../constants.js'

export default function PropertiesPanel({ color, setColor, strokeWidth, setStrokeWidth, fill, setFill }) {
  return (
    <div className="top-left-area" style={{ top: 60 }}>
      <div className="floating-panel properties-float">

        {/* ── Stroke Color ── */}
        <div className="section-label">Stroke</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
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

        {/* ── Stroke Width ── */}
        <div className="section-label">Stroke width</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
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

        {/* ── Fill ── */}
        <div className="section-label">Fill</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* No fill */}
          <div
            onClick={() => setFill('transparent')}
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              border: fill === 'transparent'
                ? '2px solid var(--color-primary)'
                : '1.5px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.12s ease',
            }}
            title="No fill"
          >
            {/* Diagonal line for "no fill" indicator */}
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ position: 'absolute', inset: 0 }}>
              <line x1="2" y1="26" x2="26" y2="2" stroke="#e03131" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Solid fill */}
          <div
            onClick={() => setFill(color)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              background: color,
              border: fill !== 'transparent'
                ? '2px solid var(--color-primary)'
                : '1.5px solid var(--color-border)',
              transition: 'border-color 0.12s ease',
            }}
            title="Solid fill"
          />
        </div>

      </div>
    </div>
  )
}
