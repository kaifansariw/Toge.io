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
