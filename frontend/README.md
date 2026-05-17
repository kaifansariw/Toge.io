<div align="center">

<br/>

```
 Toge.io
```

### A collaborative whiteboard built with Vite + React

**Draw. Shape. Collaborate — all in the browser.**

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-50fa7b?style=flat-square)](#license)

<br/>

</div>

---

## ✨ Features

- 🖊️ **Freehand pen** — smooth quadratic-curve rendering
- 🔷 **Shapes** — rectangle, ellipse, arrow, line
- ✏️ **Text tool** — click anywhere on canvas to type
- 🧹 **Eraser** — remove elements with a click
- 🎯 **Select & move** — drag any element to reposition it
- 🎨 **Color palette** — 8 stroke colors + solid/transparent fill
- 📏 **Stroke widths** — 4 preset sizes
- ↩️ **Undo / Redo** — full history stack (Ctrl+Z / Ctrl+Y)
- 🔍 **Zoom & Pan** — scroll to zoom, Alt+drag to pan
- 🗑️ **Delete** — select + Delete key
- 👥 **Collaboration panel** — room-based architecture, ready for WebSocket backend

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/sketchboard.git
cd sketchboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

---

## 🗂️ Project Structure

```
sketchboard/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                   # React entry point
    ├── App.jsx                    # Root component
    ├── index.css                  # Global styles
    ├── constants.js               # Tools, colors, shortcuts
    │
    ├── components/
    │   ├── Canvas.jsx             # Drawing surface — pointer events & render loop
    │   ├── Toolbar.jsx            # Left tool selector
    │   ├── TopBar.jsx             # Header — undo/redo, zoom, collab toggle
    │   ├── PropertiesPanel.jsx    # Right panel — color, stroke, fill
    │   ├── CollabPanel.jsx        # Collaboration room UI
    │   ├── StatusBar.jsx          # Bottom hint bar
    │   └── Icon.jsx               # SVG icon component
    │
    ├── hooks/
    │   └── useHistory.js          # Undo/redo history hook
    │
    └── utils/
        ├── drawing.js             # Canvas rendering — drawElement, isHit, grid
        └── collab.js              # CollabSession — swap for real WebSocket
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `V` | Select tool |
| `P` | Pen (freehand) |
| `R` | Rectangle |
| `E` | Ellipse |
| `A` | Arrow |
| `L` | Line |
| `T` | Text |
| `X` | Eraser |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected element |
| `Alt + drag` | Pan canvas |
| `Scroll` | Zoom in / out |

---

## 🔧 Customization

### Change the App Name / Logo

Open `src/components/TopBar.jsx` and edit the logo section:

```jsx
{/* Logo — change the icon, name, and gradient colors here */}
<span style={{ color: '#8be9fd' }}>✦</span>          {/* ← icon */}
<span style={{
  background: 'linear-gradient(90deg, #8be9fd, #50fa7b)',  {/* ← gradient */}
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}>
  SKETCHBOARD                                          {/* ← name */}
</span>
```

### Change the Color Palette

Edit `src/constants.js`:

```js
export const COLORS = [
  '#f8f8f2',  // white
  '#ff79c6',  // pink
  '#50fa7b',  // green
  // ... add or replace your own hex colors
]
```

---

## 👥 Adding Real-Time Collaboration

The collaboration system is already architected for WebSocket integration. Open `src/utils/collab.js` and replace `_connectMock()` with a real connection:

```js
// Example using Socket.io
import { io } from 'socket.io-client'

_connectReal(roomId) {
  this.socket = io('wss://your-server.com')
  this.socket.emit('join', { roomId, userId: this.userId })

  this.socket.on('element',  (el)    => this.callbacks.onElement?.(el))
  this.socket.on('peers',    (peers) => this.callbacks.onPeers?.(peers))
  this.socket.on('clear',    ()      => this.callbacks.onClear?.())
}

broadcast(event) {
  this.socket.emit(event.type, event)
}
```

A minimal Node.js + Socket.io server to pair with this:

```js
// server.js
const { Server } = require('socket.io')
const io = new Server(3001, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  socket.on('join', ({ roomId }) => socket.join(roomId))
  socket.on('element', (data) => socket.to(data.roomId).emit('element', data))
  socket.on('clear',   (data) => socket.to(data.roomId).emit('clear'))
})
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Vite 5](https://vitejs.dev) | Build tool & dev server |
| [React 18](https://react.dev) | UI framework |
| [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Rendering |
| [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) | Typography |

---

## 📄 License

MIT © 2025 — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built with React + Vite · Contributions welcome</sub>
</div>






🎨 Colors
The colors are just hardcoded hex values written directly in src/constants.js:
jsexport const COLORS = [
  '#f8f8f2',  // plain white
  '#ff79c6',  // pink
  '#50fa7b',  // green
  '#ffb86c',  // orange
  '#8be9fd',  // cyan
  '#bd93f9',  // purple
  '#ff5555',  // red
  '#f1fa8c',  // yellow
]
These are actually the Dracula color palette — a very popular dark-theme color scheme used by many code editors. Nothing is fetched from any external source. You can replace any of these hex codes with whatever colors you want.

🛠️ Tools
The tools are also just plain JavaScript strings defined in constants.js:
jsexport const TOOLS = {
  SELECT:  'select',
  PEN:     'pen',
  RECT:    'rect',
  ELLIPSE: 'ellipse',
  ARROW:   'arrow',
  LINE:    'line',
  TEXT:    'text',
  ERASER:  'eraser',
}
No library. No package. The actual drawing is done using the browser's built-in HTML5 Canvas API — things like ctx.beginPath(), ctx.stroke(), ctx.ellipse() — which comes built into every browser for free.

🔤 The only thing that IS from Google Fonts
That's just the font — IBM Plex Mono — loaded in index.html:
html<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono..." rel="stylesheet" />
That's the monospace typeface used for all the text in the UI. Everything else — colors, tools, drawing — is 100% custom code with zero external dependencies.
