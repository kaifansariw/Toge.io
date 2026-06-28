import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_BACKEND_URL; 

export class CollabSession {
  constructor(roomId, userId, callbacks) {
    this.roomId = roomId;
    this.userId = userId;
    this.callbacks = callbacks;
    this.peers = {};

   this.socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"]
});

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