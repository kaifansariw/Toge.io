import { useRef, useEffect, useState, useCallback } from 'react'
import { TOOLS, TOOL_CURSORS } from '../constants.js'
import { getPoint, drawElement, drawGrid, isHit, uid } from '../utils/drawing.js'

export default function Canvas({
  tool,
  color, strokeWidth, fill,
  elements, setElements,
  selectedId, setSelectedId,
  zoom, setZoom,
  pan, setPan,
  pushHistory,
  peers,
  collabRef
}) {
  const canvasRef = useRef(null)
  const [currentEl, setCurrentEl] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [textInput, setTextInput] = useState(null)
  const [textDraft, setTextDraft] = useState('')
  const dragRef = useRef(null)
  const panRef = useRef(null)

  // ── Resize canvas to fill container ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // ── Render loop ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawGrid(ctx, canvas.width, canvas.height, pan)

    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    elements.forEach(el => drawElement(ctx, el, el.id === selectedId))
    if (currentEl) drawElement(ctx, currentEl)

    // Peer cursors
    peers.forEach(p => {
      ctx.save()
      ctx.font = 'bold 11px IBM Plex Mono, monospace'
      ctx.fillStyle = p.color
      // Arrow
      ctx.beginPath()
      ctx.moveTo(p.cursor.x, p.cursor.y)
      ctx.lineTo(p.cursor.x + 10, p.cursor.y + 14)
      ctx.lineTo(p.cursor.x + 4, p.cursor.y + 12)
      ctx.lineTo(p.cursor.x + 2, p.cursor.y + 18)
      ctx.closePath()
      ctx.fill()
      // Name
      ctx.fillStyle = p.color
      ctx.fillText(p.name, p.cursor.x + 14, p.cursor.y + 10)
      ctx.restore()
    })

    ctx.restore()
  }, [elements, currentEl, selectedId, zoom, pan, peers])

  // ── Pointer Down ──
  const onPointerDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      panRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y }
      e.preventDefault()
      return
    }

    const canvas = canvasRef.current
    const raw = getPoint(e, canvas)
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }

    if (tool === TOOLS.SELECT) {
      const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y))
      setSelectedId(hit?.id ?? null)
      if (hit) {
        dragRef.current = {
          id: hit.id,
          startX: pt.x,
          startY: pt.y,
          origEl: { ...hit, points: hit.points ? hit.points.map(p => ({ ...p })) : undefined },
        }
      }
      return
    }

    if (tool === TOOLS.ERASER) {
      const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y))
      if (hit) {
        const next = elements.filter(el => el.id !== hit.id)
        setElements(next)
        pushHistory(next)
      }
      return
    }

    if (tool === TOOLS.TEXT) {
      setTextDraft('')
      setTextInput({ x: raw.x, y: raw.y, wx: pt.x, wy: pt.y })
      return
    }

    setDrawing(true)
    const base = { id: uid(), color, strokeWidth, fill, opacity: 1 }

    if (tool === TOOLS.PEN) {
      setCurrentEl({ ...base, type: 'pen', points: [pt] })
    } else {
      setCurrentEl({ ...base, type: tool, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y })
    }
    canvas.setPointerCapture(e.pointerId)
  }, [tool, elements, pan, zoom, color, strokeWidth, fill, pushHistory, setSelectedId, setElements])

  // ── Pointer Move ──
  const onPointerMove = useCallback((e) => {
    if (panRef.current) {
      setPan({ x: e.clientX - panRef.current.startX, y: e.clientY - panRef.current.startY })
      return
    }

    if (dragRef.current) {
      const canvas = canvasRef.current
      const raw = getPoint(e, canvas)
      const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }
      const dx = pt.x - dragRef.current.startX
      const dy = pt.y - dragRef.current.startY
      const orig = dragRef.current.origEl

      setElements(els => els.map(el =>
        el.id === dragRef.current.id ? {
          ...el,
          x1: orig.x1 + dx,
          y1: orig.y1 + dy,
          x2: orig.x2 !== undefined ? orig.x2 + dx : undefined,
          y2: orig.y2 !== undefined ? orig.y2 + dy : undefined,
          points: orig.points?.map(p => ({ x: p.x + dx, y: p.y + dy })),
        } : el
      ))
      return
    }
  
     if (collabRef?.current) {
      const canvas = canvasRef.current
      const raw = getPoint(e, canvas)
      const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }
      collabRef.current.sendCursor(pt.x, pt.y)
    }


     if (collabRef?.current) {
      const canvas = canvasRef.current
      const raw = getPoint(e, canvas)
      const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }
      collabRef.current.sendCursor(pt.x, pt.y)
    }


    if (!currentEl) return
    const canvas = canvasRef.current
    const raw = getPoint(e, canvas)
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }

    if (currentEl.type === 'pen') {
      setCurrentEl(el => ({ ...el, points: [...el.points, pt] }))
    } else {
      setCurrentEl(el => ({ ...el, x2: pt.x, y2: pt.y }))
    }
  }, [currentEl, pan, zoom, setPan, setElements])

  // ── Pointer Up ──
  const onPointerUp = useCallback(() => {
    if (panRef.current) { panRef.current = null; return }
    if (dragRef.current) {
      pushHistory(elements)
      dragRef.current = null
      return
    }
    if (!currentEl) return
    setDrawing(false)
    const next = [...elements, currentEl]
    setElements(next)
    pushHistory(next)

    console.log("collabRef:", collabRef)
    console.log("collabRef.current:", collabRef?.current)

    collabRef?.current?.broadcast({ type: 'element', el: currentEl }) 
    setCurrentEl(null)
  }, [currentEl, elements, pushHistory, setElements,collabRef])

  // ── Wheel zoom ──
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.92 : 1.08
    setZoom(z => Math.min(Math.max(z * factor, 0.1), 8))
  }, [setZoom])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── Submit text ──
  const submitText = useCallback((text) => {
    if (!textInput) return
    const value = text.trim()
    if (value) {
      const el = {
        id: uid(), type: 'text',
        color, strokeWidth, fill: 'transparent', opacity: 1,
        text: value, x1: textInput.wx, y1: textInput.wy, fontSize: 18,
      }
      const next = [...elements, el]
      setElements(next)
      pushHistory(next)
      collabRef?.current?.broadcast({ type: 'element', el })
    }
    setTextDraft('')
    setTextInput(null)
  }, [textInput, elements, color, strokeWidth, pushHistory, setElements, collabRef])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: TOOL_CURSORS[tool] || 'crosshair',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />

      {/* Text input overlay */}
      {textInput && (
        <div style={{ position: 'absolute', left: textInput.x, top: textInput.y - 4, zIndex: 50 }}>
          <input
            autoFocus
            value={textDraft}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1.5px solid #8be9fd',
              color: color,
              font: `18px 'IBM Plex Mono', monospace`,
              outline: 'none',
              minWidth: 120,
              caretColor: '#8be9fd',
            }}
            onChange={e => setTextDraft(e.target.value)}
            onBlur={() => submitText(textDraft)}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter') submitText(textDraft)
              if (e.key === 'Escape') {
                setTextDraft('')
                setTextInput(null)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
