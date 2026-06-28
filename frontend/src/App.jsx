import { useState, useEffect, useCallback, useRef } from 'react';
import { TOOLS, COLORS, KEYBOARD_SHORTCUTS } from './constants.js';
import { useHistory } from './hooks/useHistory.js';
import { CollabSession } from '../utils/collab.js';

import TopBar from './components/TopBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import Canvas from './components/Canvas.jsx';
import PropertiesPanel from './components/PropertiesPanel.jsx';
import CollabPanel from './components/CollabPanel.jsx';
import StatusBar from './components/StatusBar.jsx';


// Generate a stable user name for this session
const MY_NAME = `User_${Math.floor(Math.random() * 9000) + 1000}`;

export default function App() {
  //  Tool state 
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fill, setFill] = useState('transparent');

  //  Canvas state 
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  //  History 
  const { push: pushHistory, undo: histUndo, redo: histRedo, canUndo, canRedo } = useHistory([]);

  const undo = useCallback(() => {
    const prev = histUndo()
    if (prev !== null) { setElements(prev); setSelectedId(null) }
  }, [histUndo])

  const redo = useCallback(() => {
    const next = histRedo()
    if (next !== null) { setElements(next); setSelectedId(null) }
  }, [histRedo])

  //  Collab 
  const collabRef = useRef(null)
  const [showCollab, setShowCollab] = useState(false)
  const [collabJoined, setCollabJoined] = useState(false)
  const [collabRoomId, setCollabRoomId] = useState('')
  const [peers, setPeers] = useState([])

    // joinRoom function — creates CollabSession when user clicks Join
  const joinRoom = useCallback((roomId) => {
    collabRef.current = new CollabSession(roomId, MY_NAME, {
      onPeers:   (p)  => setPeers(p),
      onElement: (el) => setElements(prev => [...prev, el]),
      onClear:   ()   => setElements([]),
    })
    setCollabRoomId(roomId)
    setCollabJoined(true)
  }, [])

  //  leaveRoom function
  const leaveRoom = useCallback(() => {
    collabRef.current?.destroy()
    collabRef.current = null
    setCollabJoined(false)
    setCollabRoomId('')
    setPeers([])
  }, [])

  //  Keyboard shortcuts 
  useEffect(() => {
    const handler = (e) => {
      // Don't fire if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return

      // Tool shortcuts
      if (KEYBOARD_SHORTCUTS[e.key]) {
        setTool(KEYBOARD_SHORTCUTS[e.key]);
        return
      }

      // Undo / Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo() }
        if (e.key === 'y') { e.preventDefault(); redo() }
        return
      }

      // Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const next = elements.filter(el => el.id !== selectedId)
        setElements(next)
        pushHistory(next)
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, selectedId, elements, pushHistory])

  // ── Clear canvas ──
  const clearCanvas = useCallback(() => {
    setElements([])
    pushHistory([])
    setSelectedId(null)
  }, [pushHistory])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      {/* Top bar */}
      <TopBar
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onResetZoom={() => { 
          setZoom(1); 
          setPan({ x: 0, y: 0 }) 
        }}
        elementCount={elements.length}
        onClear={clearCanvas}
        onToggleCollab={() => setShowCollab(v => !v)}
        collabActive={collabJoined}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Left toolbar */}
        <Toolbar tool={tool} onToolChange={setTool} />

        {/* Canvas */}
        <Canvas
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          fill={fill}
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          zoom={zoom}
          setZoom={setZoom}
          pan={pan}
          setPan={setPan}
          pushHistory={pushHistory}
          peers={peers}
          collabRef={collabRef}
        />

        {/* Right properties panel */}
        <PropertiesPanel
          color={color}
          setColor={(c) => { setColor(c); setFill(f => f !== 'transparent' ? c : f) }}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          fill={fill}
          setFill={setFill}
        />

        {/* Collab panel overlay */}
        {showCollab && (
          <CollabPanel
            onClose={() => setShowCollab(false)}
            myName={MY_NAME}
            onJoin={joinRoom}       
            onLeave={leaveRoom}     
            joined={collabJoined}
            roomId={collabRoomId}
            peers={peers}
          />
        )}
      </div>

      {/* Status bar */}
      <StatusBar
        joined={collabJoined}
        roomId={collabRoomId}
        peerCount={peers.length + 1}
      />
    </div>
  )
}
