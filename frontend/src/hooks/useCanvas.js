import { useRef, useCallback } from 'react'
import { TOOLS } from '../constants.js'
import { getPoint, isHit, uid } from '../utils/drawing.js'

export function useCanvas({
  tool, color, strokeWidth, fill,
  elements, setElements,
  selectedId, setSelectedId,
  zoom, pan, setPan,
  pushHistory,
  setCurrentEl, currentEl,
  setDrawing,
  setTextInput,
  collabRef,
}) {
  const dragRef = useRef(null);
  const panRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    // Middle mouse or Alt+left = pan
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      panRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y }
      return
    }

    const canvas = e.currentTarget
    const raw = getPoint(e, canvas)
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }

    if (tool === TOOLS.SELECT) {
      const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y))
      setSelectedId(hit?.id ?? null)
      if (hit) {
        dragRef.current = { id: hit.id, startX: pt.x, startY: pt.y, origEl: { ...hit, points: hit.points ? [...hit.points] : undefined } }
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
  }, [tool, elements, pan, zoom, color, strokeWidth, fill, pushHistory, setSelectedId, setElements, setDrawing, setCurrentEl, setTextInput])

  const onPointerMove = useCallback((e) => {
    if (panRef.current) {
      setPan({ x: e.clientX - panRef.current.startX, y: e.clientY - panRef.current.startY })
      return
    }

    if (dragRef.current) {
      const canvas = e.currentTarget
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

    if (!currentEl) return
    const canvas = e.currentTarget
    const raw = getPoint(e, canvas)
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }

    if (currentEl.type === 'pen') {
      setCurrentEl(el => ({ ...el, points: [...el.points, pt] }))
    } else {
      setCurrentEl(el => ({ ...el, x2: pt.x, y2: pt.y }))
    }
  }, [currentEl, pan, zoom, setPan, setElements, setCurrentEl])

  const onPointerUp = useCallback(() => {
    if (panRef.current) {
      panRef.current = null
      return
    }
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
    collabRef?.current?.broadcast({ type: 'element', el: currentEl })
    setCurrentEl(null)
  }, [currentEl, elements, pushHistory, setDrawing, setElements, setCurrentEl, collabRef])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    // Pinch to zoom on trackpad too
    const delta = e.deltaY > 0 ? 0.92 : 1.08
    // Zoom toward mouse position
    // (simplified version — zoom around center)
    return delta
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onWheel }
}
