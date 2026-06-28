# Toge.io(Together.input/output) - Collaborative Sketchboard

Toge.io is a lightweight, real-time collaborative sketchboard built with **React + Vite** on the frontend and a minimal **Node.js + Socket.IO** backend. It provides a responsive HTML5 Canvas drawing experience with multiple drawing tools, live collaboration, cursor presence, undo/redo functionality, and room-based synchronization.

The project is designed for rapid prototyping and easy extensibility for collaborative whiteboard applications.

---

#  Features

- 🖊️ Freehand drawing and sketching
- 📐 Shape tools:
  - Rectangle
  - Ellipse
  - Line
  - Arrow
- 📝 Text tool
- 🧽 Eraser tool
- 🎯 Selection tool
- ↩️ Undo / Redo history
- 🔍 Pan and Zoom support
- 🎨 Stroke, fill, and opacity controls
- 👥 Real-time collaboration using Socket.IO
- 📍 Live cursor and peer presence
- 🧪 Mock collaboration mode for local development
- ⚡ Lightweight and modular architecture

---

# Tech Stack

## Frontend
- React
- Vite
- HTML5 Canvas
- CSS

## Backend
- Node.js
- Express
- Socket.IO

---

#  Project Structure

```bash
Toge.io/
│
├── backend/                 # Node.js + Socket.IO server
│   ├── server.js
│   └── package.json
│
├── frontend/                # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.jsx
│   │   │   ├── Toolbar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── CollabPanel.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCanvas.js
│   │   │   └── useHistory.js
│   │   │
│   │   ├── utils/
│   │   │   ├── drawing.js
│   │   │   └── collab.js
│   │   │
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

#  Prerequisites

Before running the project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn

---

# Getting Started

## 1️ Clone the Repository

```bash
git clone https://github.com/your-username/Toge.io.git
cd Toge.io
```

---

# Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server runs on:

```bash
http://localhost:3001
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```bash
http://localhost:5173
```

---

# Real-Time Collaboration

The frontend connects to the Socket.IO backend at:

```bash
http://localhost:3001
```

To use a deployed backend server, update the server URL inside:

```bash
frontend/src/utils/collab.js
```

---

# Build for Production

## Frontend Build

```bash
cd frontend
npm run build
```

You can serve the generated `dist/` folder using:

- Vercel
- Netlify
- Express
- Nginx
- Any static hosting provider

---

# Production Recommendations

For production deployment, consider the following improvements:

- Enable HTTPS
- Restrict CORS origins
- Add JWT/session authentication
- Persist room/canvas state using Redis or a database
- Optimize high-frequency cursor events
- Add rate limiting
- Implement CRDT or Operational Transform conflict handling

---

# Future Improvements

- 💾 Persistent room storage
- 👨‍💼 Admin/user permissions
- 🕓 Session replay/history
- 🌍 Multiplayer room management
- 📱 Mobile optimization

---

# Testing & Debugging

- Use browser DevTools to inspect WebSocket traffic
- Test collaboration using multiple browser tabs/windows
- Mock collaboration fallback is available in:

```bash
frontend/src/utils/collab.js
```

---

# Contributing

Contributions are welcome!

## Steps

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

Please keep changes focused and update documentation when necessary.

---

# License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

# Author

Developed by Mohamed Kaif with ❤️ using React, Vite, Node.js, and Socket.IO.
