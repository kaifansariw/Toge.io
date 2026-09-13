import { useState } from 'react'
import Icon, { ICONS } from './Icon.jsx'
import { COLORS } from '../constants.js'

export default function CollabPanel({ 
  onClose, 
  myName, 
  onJoin,
  onLeave,
  joined,
  roomId,
  peers,
})

{
  const [inputRoomId, setInputRoomId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoin = () => {
    if (!inputRoomId.trim()) return;
    onJoin(inputRoomId.trim());
  }

  const handleLeave = () => {
    onLeave();
    setInputRoomId('');
  }

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="collab-panel">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Icon d={ICONS.collab} size={18} />
          Live Collaboration
        </span>
        <button className="tool-btn" onClick={onClose} style={{ padding: 4 }}>
          <Icon d={ICONS.close} size={16} />
        </button>
      </div>

      {!joined ? (
        <>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 12,
          }}>
            Share a room ID with teammates to draw together in real-time.
          </p>

          <input
            className="collab-input"
            placeholder="Room ID (e.g. my-project)"
            value={inputRoomId}
            onChange={e => setInputRoomId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />

          <button className="btn-primary" onClick={handleJoin} style={{ marginTop: 4 }}>
            Join / Create Room
          </button>

          {/* My ID */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <div style={{
              background: 'var(--color-canvas)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              flex: 1,
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-light)',
            }}>
              You: <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{myName}</span>
            </div>
            <button
              className="tool-btn"
              style={{
                padding: 8,
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
              }}
              onClick={() => copyToClipboard(myName)}
              title="Copy ID"
            >
              <Icon d={ICONS.copy} size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Connected badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14,
            padding: '8px 12px',
            background: '#f0fdf4',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #bbf7d0',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--color-success)',
              boxShadow: '0 0 6px rgba(47, 158, 68, 0.4)',
              display: 'inline-block',
            }} />
            <span style={{ color: 'var(--color-success)', fontSize: 13, fontWeight: 600 }}>Connected</span>
          </div>

          {/* Room ID */}
          <div style={{
            background: 'var(--color-canvas)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid var(--color-border-light)',
          }}>
            <span style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 600 }}>{roomId}</span>
            <button
              className="tool-btn" style={{ padding: 4 }}
              onClick={() => copyToClipboard(roomId)}
              title={copied ? 'Copied!' : 'Copy room ID'}
            >
              <Icon d={copied ? ICONS.close : ICONS.copy} size={14} />
            </button>
          </div>

          {/* Peers list */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              color: 'var(--color-text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <Icon d={ICONS.users} size={14} />
              {(peers?.length ?? 0) + 1} in room
            </div>

            {/* Self */}
            <PeerRow name={myName} color={COLORS[0]} badge="you" />

            
            {peers?.map(p => (
              <PeerRow key={p.id} name={p.name} color={p.color} badge="● live" badgeColor="var(--color-success)" />
            ))}
          </div>

          <button className="btn-danger" onClick={handleLeave}>
            Leave Room
          </button>
        </>
      )}
    </div>
  )
}

function PeerRow({ name, color, badge, badgeColor = 'var(--color-primary)' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid var(--color-border-light)',
    }}>
      <span className="peer-dot" style={{ background: color }} />
      <span style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 500 }}>{name}</span>
      <span style={{ marginLeft: 'auto', color: badgeColor, fontSize: 11, fontWeight: 600 }}>{badge}</span>
    </div>
  )
}