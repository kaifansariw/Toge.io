import { COLORS, STROKE_WIDTHS } from '../constants.js'

export default function PropertiesPanel({ color, setColor, strokeWidth, setStrokeWidth, fill, setFill }) {
  return (
    <aside style={{
      width: 64,
      background: '#16213e',
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 0',
      gap: 14,
      zIndex: 10,
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      {/* Section label */}
      <span style={{ fontSize: 9, color: '#444', letterSpacing: 1 }}>COLOR</span>

      {/* Color swatches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
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

      {/* Stroke widths */}
      <span style={{ fontSize: 9, color: '#444', letterSpacing: 1 }}>SIZE</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {STROKE_WIDTHS.map(w => (
          <div
            key={w}
            onClick={() => setStrokeWidth(w)}
            style={{
              width: 36,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 6,
              background: strokeWidth === w ? 'rgba(139,233,253,0.15)' : 'transparent',
              border: strokeWidth === w ? '1px solid rgba(139,233,253,0.3)' : '1px solid transparent',
              transition: 'background 0.15s',
            }}
            title={`${w}px`}
          >
            <div style={{
              width: 24,
              height: Math.min(w, 10),
              background: color,
              borderRadius: w / 2,
            }} />
          </div>
        ))}
      </div>

      <div className="divider-v" />

      {/* Fill toggle */}
      <span style={{ fontSize: 9, color: '#444', letterSpacing: 1 }}>FILL</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {/* No fill */}
        <div
          onClick={() => setFill('transparent')}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            border: fill === 'transparent' ? '2px solid #8be9fd' : '1.5px solid rgba(255,255,255,0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.15s',
          }}
          title="No fill"
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(45deg, #2a2a4a 0px, #2a2a4a 4px, #1a1a2e 4px, #1a1a2e 8px)',
          }} />
        </div>

        {/* Solid fill */}
        <div
          onClick={() => setFill(color)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            background: color,
            border: fill !== 'transparent' ? '2px solid #8be9fd' : '1.5px solid rgba(255,255,255,0.15)',
            transition: 'border-color 0.15s',
          }}
          title="Solid fill"
        />
      </div>
    </aside>
  )
}
