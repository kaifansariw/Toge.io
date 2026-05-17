// import { COLORS } from '../constants.js'


// /**
//  * CollabSession — wraps WebSocket logic.
//  *
//  * In production, replace `_connectMock()` with a real socket:
//  *   this.ws = new WebSocket(`wss://your-server/room/${roomId}`)
//  *   this.ws.onmessage = (e) => this._handleMessage(JSON.parse(e.data))
//  */
// export class CollabSession {
//   constructor(roomId, userId, callbacks) {
//     this.roomId = roomId
//     this.userId = userId
//     this.callbacks = callbacks // { onPeers, onElement, onCursor, onClear }
//     this.ws = null
//     this._connectMock()
//   }

//   _connectMock() {
//     // Simulate peers joining after a short delay
//     const names = ['Alex Chen', 'Mia Patel', 'Sam Torres', 'Jordan Lee']
//     const count = Math.floor(Math.random() * 3) + 1

//     this._peersTimer = setTimeout(() => {
//       const peers = names.slice(0, count).map((name, i) => ({
//         id: `peer_${i}`,
//         name,
//         color: COLORS[i + 1],
//         cursor: { x: 250 + i * 180, y: 220 + i * 90 },
//       }))
//       this.callbacks.onPeers?.(peers)

//       // Simulate cursor movement
//       this._cursorTimer = setInterval(() => {
//         peers.forEach(p => {
//           p.cursor.x += (Math.random() - 0.5) * 40
//           p.cursor.y += (Math.random() - 0.5) * 30
//         })
//         this.callbacks.onPeers?.(peers)
//       }, 2000)
//     }, 1800)
//   }

//   /** Send an event to the server / peers */
//   broadcast(event) {
//     if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//       this.ws.send(JSON.stringify({ ...event, from: this.userId }))
//     }
//     // In mock mode, just log
//     console.log('[Collab] broadcast:', event.type, event)
//   }

//   /** Handle a message from the server */
//   _handleMessage(data) {
//     switch (data.type) {
//       case 'peers':
//         this.callbacks.onPeers?.(data.peers)
//         break
//       case 'element':
//         this.callbacks.onElement?.(data.el)
//         break
//       case 'cursor':
//         this.callbacks.onCursor?.(data)
//         break
//       case 'clear':
//         this.callbacks.onClear?.()
//         break
//     }
//   }

//   destroy() {
//     clearTimeout(this._peersTimer)
//     clearInterval(this._cursorTimer)
//     this.ws?.close()
//     this.ws = null
//   }
// }












import { io } from "socket.io-client";

const SERVER_URL = io(import.meta.env.VITE_BACKEND_URL); // change to your deployed URL later

export class CollabSession {
  constructor(roomId, userId, callbacks) {
    this.roomId = roomId;
    this.userId = userId;
    this.callbacks = callbacks;
    this.peers = {};

    this.socket = io(SERVER_URL);

    this.socket.on("connect", () => {
      console.log("Connected to server:", this.socket.id);

      // Join the room
      this.socket.emit("join", {
        roomId,
        userId,
        color: callbacks.myColor || "#8be9fd"
      });
    });

    // Someone already in the room
    this.socket.on("peers", (peers) => {
      peers.forEach(p => this.peers[p.id] = p);
      this.callbacks.onPeers?.(Object.values(this.peers));
    });

    // New person joined after us
    this.socket.on("peer-joined", (peer) => {
      this.peers[peer.id] = peer;
      this.callbacks.onPeers?.(Object.values(this.peers));
    });

    // Someone drew something
    this.socket.on("element", (el) => {
      this.callbacks.onElement?.(el);
    });

    // Cursor moved
    this.socket.on("cursor", ({ id, x, y }) => {
      if (this.peers[id]) {
        this.peers[id].cursor = { x, y };
        this.callbacks.onPeers?.(Object.values(this.peers));
      }
    });

    // Canvas cleared by someone
    this.socket.on("clear", () => {
      this.callbacks.onClear?.();
    });

    // Someone left
    this.socket.on("peer-left", ({ id }) => {
      delete this.peers[id];
      this.callbacks.onPeers?.(Object.values(this.peers));
    });
  }

  broadcast(event) {
    this.socket.emit(event.type, {
      ...event,
      roomId: this.roomId
    });
  }

  // Call this when mouse moves on canvas
  sendCursor(x, y) {
    this.socket.emit("cursor", { roomId: this.roomId, x, y });
  }

  destroy() {
    this.socket.disconnect();
  }
}