export default function StatusBar({ joined, roomId, peerCount }) {
  return (

    <footer style={{
      height: 28,
      background: '#16213e',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      flexShrink: 0,
      userSelect: 'none',
    }}>

      <span style={{ color:'#ffffff', fontSize: 11 }}>
        Alt+drag to pan · Scroll to zoom · Del to delete · Ctrl+Z/Y to undo/redo
      </span>

      <div style={{ flex: 1 }} />

      {joined && (
        <span style={{ color: '#50fa7b', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 6, height: 6,
            background: '#50fa7b',
            borderRadius: '50%',
            display: 'inline-block',
            boxShadow: '0 0 6px #50fa7b',
          }} />
          Room: <strong>{roomId}</strong> · {peerCount} user{peerCount !== 1 ? 's' : ''}
        </span>
      )}
      
    </footer>
  )
}
