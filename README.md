# Toge.io — Collaborative Sketchboard

Toge.io is a lightweight, real-time collaborative sketchboard built with React + Vite on the frontend and a minimal Node + Socket.IO backend. It provides a responsive HTML5 Canvas drawing surface with tools for freehand drawing, shapes, text, selection, pan/zoom, undo/redo, and live cursor/peer presence. The project is structured to let you prototype and extend collaborative drawing features quickly.

## Features
- Multi-tool canvas: Pen, Rectangle, Ellipse, Line, Arrow, Text, Eraser, Select
- Undo/Redo history with a fixed stack
- Pan and zoom controls
- Properties panel for stroke, fill and opacity
- Real-time collaboration using Socket.IO: room join/leave, element broadcast, cursor updates, and clear
- Mocked collab mode for local dev when server is not available
- Small, focused backend for room-based broadcasting

## Repository Layout
- `backend/` — Node server using Socket.IO (room-based events)
  - `server.js` — minimal Socket.IO server (listens on port 3001 by default)
  - `package.json`
- `frontend/` — Vite + React client
  - `src/`
    - `App.jsx` — application root and UI composition
    - `components/` — `Canvas.jsx`, `Toolbar.jsx`, `TopBar.jsx`, `CollabPanel.jsx`, etc.
    - `hooks/` — `useHistory.js`, `useCanvas.js`
    - `utils/` — `drawing.js`, `collab.js` (client collab wrapper)
    - `constants.js`, `index.css`, `main.jsx`
  - `package.json`, `vite.config.js`, `public/`

## Prerequisites
- Node.js v16+ and npm or yarn
- (Optional) A reverse proxy or hosting platform for production deployment

## Local Development
1. Backend
```bash
cd backend
npm install
npm start

By default the server listens on http://localhost:3001.

2.Frontend

cd frontend
npm install
npm run dev

Open the Vite dev URL (usually http://localhost:5173).

3.Collaboration
The client connects to the Socket.IO server at http://localhost:3001 by default. Update the URL in frontend/src/utils/collab.js to point to a deployed server if needed.

## Build & Production

Build frontend:
cd frontend
npm run build

Serve the static build with any static server or integrate into a Node/Express host. For production collaboration, deploy the backend server and update the client SERVER_URL.
Deployment Notes & Recommendations.

Use HTTPS and CORS restrictions for production. Configure allowed origins in the server CORS settings (backend/server.js) instead of origin: '*'.
Add authentication (JWT or session) to validate room joins.
Persist canvas state (e.g., Redis or a database) for durable rooms and rejoining users.
Rate-limit/bundle high-frequency cursor or drawing events to reduce bandwidth.
Extending the Project
Add persistent storage/room snapshots
Implement per-user permissions and admin controls
Merge operational transforms or CRDTs for robust conflict resolution
Add server-side replay/history and export (PNG/SVG)
Testing & Debugging
Use browser devtools to inspect WebSocket messages.
Use small rooms to simulate multi-user behavior; the client includes a mock fallback in frontend/src/utils/collab.js.
Contributing
Fork the repo, create a feature branch, and open a PR with a descriptive title and changeset.
Keep changes focused; update or add tests and README when adding features.
License
MIT — see LICENSE for details.
