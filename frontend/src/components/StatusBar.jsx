export default function StatusBar({ joined, roomId, peerCount }) {
  // StatusBar is now integrated into TopBar's floating layout.
  // This component is kept for collab status display in the bottom-right 
  // when the collab connection is active.
  
  if (!joined) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 12,
      right: 12,
      zIndex: 10,
      pointerEvents: 'all',
    }}>
      <div className="floating-panel" style={{
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--color-success)',
      }}>
        <span style={{
          width: 7,
          height: 7,
          background: 'var(--color-success)',
          borderRadius: '50%',
          display: 'inline-block',
          boxShadow: '0 0 6px rgba(47, 158, 68, 0.5)',
          animation: 'pulse 2s infinite',
        }} />
        <span>
          Room: <strong>{roomId}</strong> · {peerCount} user{peerCount !== 1 ? 's' : ''}
        </span>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
