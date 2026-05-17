// import { useState } from 'react'
// import Icon, { ICONS } from './Icon.jsx'
// import { COLORS } from '../constants.js'

// export default function CollabPanel({ onClose, myName }) {
//   const [roomId, setRoomId] = useState('')
//   const [joined, setJoined] = useState(false)
//   const [peers, setPeers] = useState([])
//   const [sessionRef, setSessionRef] = useState(null)
//   const [copied, setCopied] = useState(false)

//   const joinRoom = () => {
//     if (!roomId.trim()) return
//     // Import lazily to avoid circular issues
//     import('../utils/collab.js').then(({ CollabSession }) => {
//       const session = new CollabSession(roomId.trim(), myName, {
//         onPeers: (p) => setPeers(p),
//       })
//       setSessionRef(session)
//       setJoined(true)
//     })
//   }

//   const leaveRoom = () => {
//     sessionRef?.destroy()
//     setSessionRef(null)
//     setJoined(false)
//     setPeers([])
//     setRoomId('')
//   }

//   const copyToClipboard = (text) => {
//     navigator.clipboard?.writeText(text).then(() => {
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1500)
//     })
//   }

//   return (
//     <div className="collab-panel">
//       {/* Header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//         <span style={{ color: '#8be9fd', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
//           ⚡ Collaboration
//         </span>
//         <button className="tool-btn" onClick={onClose} style={{ padding: 4 }}>
//           <Icon d={ICONS.close} size={16} />
//         </button>
//       </div>

//       {!joined ? (
//         <>
//           <p style={{ color: '#666', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
//             Share a room ID with teammates to draw together in real-time.
//           </p>

//           <input
//             className="collab-input"
//             placeholder="Room ID  (e.g. my-project)"
//             value={roomId}
//             onChange={e => setRoomId(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && joinRoom()}
//           />

//           <button className="btn-primary" onClick={joinRoom} style={{ marginTop: 4 }}>
//             Join / Create Room
//           </button>

//           {/* My ID */}
//           <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
//             <div style={{
//               background: '#0f3460',
//               borderRadius: 8,
//               padding: '8px 10px',
//               flex: 1,
//               fontSize: 11,
//               color: '#666',
//               border: '1px solid rgba(139,233,253,0.1)',
//             }}>
//               Your ID: <span style={{ color: '#8be9fd' }}>{myName}</span>
//             </div>
//             <button
//               className="tool-btn"
//               style={{ padding: 8, background: '#0f3460', border: '1px solid rgba(139,233,253,0.1)', borderRadius: 8 }}
//               onClick={() => copyToClipboard(myName)}
//               title="Copy your ID"
//             >
//               <Icon d={ICONS.copy} size={14} />
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Connected badge */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
//             <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#50fa7b', boxShadow: '0 0 8px #50fa7b', display: 'inline-block' }} />
//             <span style={{ color: '#50fa7b', fontSize: 12 }}>Connected</span>
//           </div>

//           {/* Room ID */}
//           <div style={{
//             background: '#0f3460',
//             borderRadius: 8,
//             padding: '9px 12px',
//             marginBottom: 14,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//             <span style={{ color: '#8be9fd', fontSize: 13, fontWeight: 500 }}>{roomId}</span>
//             <button
//               className="tool-btn"
//               style={{ padding: 4 }}
//               onClick={() => copyToClipboard(roomId)}
//               title="Copy room ID"
//             >
//               <Icon d={copied ? ICONS.close : ICONS.copy} size={14} />
//             </button>
//           </div>

//           {/* Peers list */}
//           <div style={{ marginBottom: 14 }}>
//             <div style={{ color: '#555', fontSize: 11, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
//               <Icon d={ICONS.users} size={13} />
//               {peers.length + 1} in room
//             </div>

//             {/* Self */}
//             <PeerRow name={myName} color={COLORS[0]} badge="you" />

//             {peers.map((p, i) => (
//               <PeerRow key={p.id} name={p.name} color={p.color} badge="● live" badgeColor="#50fa7b" />
//             ))}
//           </div>

//           <button className="btn-danger" onClick={leaveRoom}>
//             Leave Room
//           </button>
//         </>
//       )}

//       {/* Dev note */}
//       <div style={{
//         marginTop: 14,
//         padding: 10,
//         background: 'rgba(139,233,253,0.04)',
//         borderRadius: 8,
//         border: '1px solid rgba(139,233,253,0.1)',
//         fontSize: 11,
//         color: '#555',
//         lineHeight: 1.7,
//       }}>
//         💡 Connect a WebSocket server and replace <code style={{ color: '#8be9fd' }}>CollabSession</code> in{' '}
//         <code style={{ color: '#8be9fd' }}>src/utils/collab.js</code> for live sync.
//       </div>
//     </div>
//   )
// }

// function PeerRow({ name, color, badge, badgeColor = '#8be9fd' }) {
//   return (
//     <div style={{
//       display: 'flex',
//       alignItems: 'center',
//       padding: '7px 0',
//       borderBottom: '1px solid rgba(255,255,255,0.05)',
//     }}>
//       <span className="peer-dot" style={{ background: color }} />
//       <span style={{ color: '#ccc', fontSize: 12 }}>{name}</span>
//       <span style={{ marginLeft: 'auto', color: badgeColor, fontSize: 10 }}>{badge}</span>
//     </div>
//   )
// }














import { useState } from 'react'
import Icon, { ICONS } from './Icon.jsx'
import { COLORS } from '../constants.js'

export default function CollabPanel({ 
  onClose, 
  myName, 
  onJoin,      // ← from App.jsx
  onLeave,     // ← from App.jsx
  joined,      // ← from App.jsx
  roomId,      // ← from App.jsx
  peers,       // ← from App.jsx
}) {
  const [inputRoomId, setInputRoomId] = useState('')
  const [copied, setCopied] = useState(false)

  const handleJoin = () => {
    if (!inputRoomId.trim()) return
    onJoin(inputRoomId.trim())  // ← calls joinRoom() in App.jsx which sets collabRef
  }

  const handleLeave = () => {
    onLeave()                   // ← calls leaveRoom() in App.jsx
    setInputRoomId('')
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
        <span style={{ color: '#8be9fd', fontWeight: 600, fontSize: 13 }}>
          ⚡ Collaboration
        </span>
        <button className="tool-btn" onClick={onClose} style={{ padding: 4 }}>
          <Icon d={ICONS.close} size={16} />
        </button>
      </div>

      {!joined ? (
        <>
          <p style={{ color: '#666', fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
            Share a room ID with teammates to draw together in real-time.
          </p>

          <input
            className="collab-input"
            placeholder="Room ID  (e.g. my-project)"
            value={inputRoomId}
            onChange={e => setInputRoomId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />

          <button className="btn-primary" onClick={handleJoin} style={{ marginTop: 4 }}>
            Join / Create Room
          </button>

          {/* My ID */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <div style={{
              background: '#0f3460',
              borderRadius: 8,
              padding: '8px 10px',
              flex: 1,
              fontSize: 11,
              color: '#666',
              border: '1px solid rgba(139,233,253,0.1)',
            }}>
              Your ID: <span style={{ color: '#8be9fd' }}>{myName}</span>
            </div>
            <button
              className="tool-btn"
              style={{ padding: 8, background: '#0f3460', border: '1px solid rgba(139,233,253,0.1)', borderRadius: 8 }}
              onClick={() => copyToClipboard(myName)}
            >
              <Icon d={ICONS.copy} size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Connected badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#50fa7b', boxShadow: '0 0 8px #50fa7b',
              display: 'inline-block'
            }} />
            <span style={{ color: '#50fa7b', fontSize: 12 }}>Connected</span>
          </div>

          {/* Room ID */}
          <div style={{
            background: '#0f3460', borderRadius: 8,
            padding: '9px 12px', marginBottom: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#8be9fd', fontSize: 13, fontWeight: 500 }}>{roomId}</span>
            <button
              className="tool-btn" style={{ padding: 4 }}
              onClick={() => copyToClipboard(roomId)}
            >
              <Icon d={copied ? ICONS.close : ICONS.copy} size={14} />
            </button>
          </div>

          {/* Peers list */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#555', fontSize: 11, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon d={ICONS.users} size={13} />
              {(peers?.length ?? 0) + 1} in room
            </div>

            {/* Self */}
            <PeerRow name={myName} color={COLORS[0]} badge="you" />

            {/* Other peers */}
            {peers?.map(p => (
              <PeerRow key={p.id} name={p.name} color={p.color} badge="● live" badgeColor="#50fa7b" />
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

function PeerRow({ name, color, badge, badgeColor = '#8be9fd' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '7px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span className="peer-dot" style={{ background: color }} />
      <span style={{ color: '#ccc', fontSize: 12 }}>{name}</span>
      <span style={{ marginLeft: 'auto', color: badgeColor, fontSize: 10 }}>{badge}</span>
    </div>
  )
}