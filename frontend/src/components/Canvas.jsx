import { useRef, useEffect, useState, useCallback } from 'react';
import { TOOLS, TOOL_CURSORS } from '../constants.js';
import { getPoint, drawElement, drawGrid, isHit, uid, getResizeHandle, resizeElement } from '../../utils/drawing.js';


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
  const canvasRef = useRef(null);
  const [currentEl, setCurrentEl] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [textInput, setTextInput] = useState(null);
  const [textDraft, setTextDraft] = useState('');
  const inputRef = useRef(null);
  const mountingRef = useRef(false);
  const dragRef = useRef(null);
  const panRef = useRef(null);
  const resizeRef = useRef(null);
  const HANDLE_SIZE = 8;
  const HANDLE_HIT = 10;

  //  Resize canvas to fill container ──
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

  //  Render loop 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    // Light canvas background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas.width, canvas.height, pan);

    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    elements.forEach(el => drawElement(ctx, el, el.id === selectedId))
    if (currentEl) drawElement(ctx, currentEl)

    // Peer cursors
    peers.forEach(p => {
      ctx.save()
      ctx.font = "bold 12px 'Assistant', sans-serif"
      ctx.fillStyle = p.color
      // Arrow
      ctx.beginPath()
      ctx.moveTo(p.cursor.x, p.cursor.y)
      ctx.lineTo(p.cursor.x + 10, p.cursor.y + 14)
      ctx.lineTo(p.cursor.x + 4, p.cursor.y + 12)
      ctx.lineTo(p.cursor.x + 2, p.cursor.y + 18)
      ctx.closePath()
      ctx.fill()
      // Name badge
      const textWidth = ctx.measureText(p.name).width
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.roundRect(p.cursor.x + 12, p.cursor.y + 2, textWidth + 12, 20, 4)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.fillText(p.name, p.cursor.x + 18, p.cursor.y + 16)
      ctx.restore()
    })

    ctx.restore()
  }, [elements, currentEl, selectedId, zoom, pan, peers]);

  // Submit text element to canvas and history
  const submitText = useCallback((text) => {
    if (!textInput) return;

    const rawVal = text !== undefined ? text : (inputRef.current?.value ?? textDraft);
    const value = (rawVal ?? '').trim();

    if (value) {
      const el = {
        id: uid(),
        type: 'text',
        color: color || '#1e1e1e', 
        strokeWidth: strokeWidth || 2, 
        fill: 'transparent', 
        opacity: 1,
        text: value,
        x1: textInput.wx, 
        y1: textInput.wy, 
        fontSize: 20,
      };
      const next = [...elements, el];
      setElements(next);
      pushHistory(next);
      collabRef?.current?.broadcast({ type: 'element', el });
    }
    setTextDraft('');
    setTextInput(null);
  }, [textInput, textDraft, elements, color, strokeWidth, pushHistory, setElements, collabRef]);

  // Focus input when text tool creates input overlay
  useEffect(() => {
    if (textInput) {
      mountingRef.current = true;
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        mountingRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [textInput]);

  // Double click text to edit
  const onDoubleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const raw = getPoint(e, canvas);
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom };

    const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y));
    if (hit && hit.type === 'text') {
      const next = elements.filter(el => el.id !== hit.id);
      setElements(next);
      pushHistory(next);
      mountingRef.current = true;
      setTextDraft(hit.text);
      setTextInput({
        x: hit.x1 * zoom + pan.x,
        y: hit.y1 * zoom + pan.y,
        wx: hit.x1,
        wy: hit.y1,
      });
    }
  }, [elements, pan, zoom, pushHistory, setElements]);

  //  Pointer Down 
  const onPointerDown = useCallback((e) => {
    // If textInput was open and user clicks on canvas, commit active text
    if (textInput) {
      const val = (inputRef.current?.value ?? textDraft).trim();
      if (val) {
        submitText(val);
      } else {
        setTextDraft('');
        setTextInput(null);
      }
    }

    // Hand tool or middle-click or alt+click = pan
    if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && tool === TOOLS.HAND)) {
      panRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y };
      e.currentTarget.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }

    const canvas = canvasRef.current;
    const raw = getPoint(e, canvas);
    const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom };
 
    if (tool === TOOLS.SELECT) {
      const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y));
      setSelectedId(hit?.id ?? null);
      if (!hit) return;

      const handle = getResizeHandle(hit, pt.x, pt.y);
      if (handle) {
        resizeRef.current = {
          id: hit.id,
          handle,
          original: { ...hit }
        };
        return;
      }

      dragRef.current = {
        id: hit.id,
        startX: pt.x,
        startY: pt.y,
        origEl: { ...hit }
      };
      return;
    } 

    if (tool === TOOLS.ERASER) {
      const hit = [...elements].reverse().find(el => isHit(el, pt.x, pt.y));
      if (hit) {
        const next = elements.filter(el => el.id !== hit.id);
        setElements(next);
        pushHistory(next);
      }
      return;
    }

    if (tool === TOOLS.TEXT) {
      mountingRef.current = true;
      setTextDraft('');
      setTextInput({
        x: raw.x,
        y: raw.y,
        wx: pt.x,
        wy: pt.y,
      });
      return;
    }

    setDrawing(true);
    const base = { id: uid(), color, strokeWidth, fill, opacity: 1 };

    if (tool === TOOLS.PEN) {
      setCurrentEl({ ...base, type: 'pen', points: [pt] });
    } else {
      setCurrentEl({ ...base, type: tool, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
    }
    canvas.setPointerCapture(e.pointerId);
  }, [tool, elements, pan, zoom, color, strokeWidth, fill, pushHistory, setSelectedId, setElements, textInput, textDraft, submitText]);


  //  Pointer Move 
  const onPointerMove = useCallback((e) => {
    if (panRef.current) {
      setPan(
        { x: e.clientX - panRef.current.startX, 
          y: e.clientY - panRef.current.startY 
        });
      return
    }

    const canvas = e.currentTarget;

    const raw = getPoint(e, canvas);

    const pt = {

    x:(raw.x-pan.x)/zoom,

    y:(raw.y-pan.y)/zoom

};

 const hovered=[...elements]
 .reverse()
 .find(el=>isHit(el,pt.x,pt.y));

   if(hovered){

    const handle=getResizeHandle(
        hovered,
        pt.x,
        pt.y
    );

    switch(handle){

        case "nw":
        case "se":

            canvas.style.cursor="nwse-resize";

            break;

        case "ne":
        case "sw":

            canvas.style.cursor="nesw-resize";

            break;

        case "start":
        case "end":

            canvas.style.cursor="pointer";

            break;

        default:

            canvas.style.cursor="move";
    }
  } else{
    canvas.style.cursor = tool === TOOLS.HAND ? 'grab' : (TOOL_CURSORS[tool] || 'default');
  }


   if (resizeRef.current) {
     const resize = resizeRef.current;

     const canvas = canvasRef.current;
     const raw = getPoint(e, canvas);

     const pt = {
        x: (raw.x - pan.x) / zoom,
        y: (raw.y - pan.y) / zoom,
     };

     setElements(els => {

    return els.map(el => {

        if (!el) return el;

        if (el.id === resize.id) {
            return resizeRect(
                resize.original,
                resize.handle,
                pt.x,
                pt.y
            );
        }

        return el;
    });
});
   }


    if (dragRef.current) {
      const canvas = canvasRef.current
      const raw = getPoint(e, canvas)
      const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }
      const dx = pt.x - dragRef.current.startX
      const dy = pt.y - dragRef.current.startY
      const orig = dragRef.current.origEl

      const drag = dragRef.current;

  setElements(els =>
    els.map(el => {
     if (!el) return el;

     if (el.id !== drag.id) return el;

    return {
      ...el,
      x1: orig.x1 + dx,
      y1: orig.y1 + dy,
      x2: orig.x2 !== undefined ? orig.x2 + dx : undefined,
      y2: orig.y2 !== undefined ? orig.y2 + dy : undefined,
      points: orig.points?.map(p => ({
        x: p.x + dx,
        y: p.y + dy,
        })),
      };
    })
  );
      
    }
  
     if (collabRef?.current) {
      const canvas = canvasRef.current
      const raw = getPoint(e, canvas)
      const pt = { x: (raw.x - pan.x) / zoom, y: (raw.y - pan.y) / zoom }
      collabRef.current.sendCursor(pt.x, pt.y)
    }

    if (!currentEl) return

    if (currentEl.type === 'pen') {
      setCurrentEl(el => ({ ...el, points: [...el.points, pt] }))
    } else {
      setCurrentEl(el => ({ ...el, x2: pt.x, y2: pt.y }))
    }
  }, [currentEl, pan, zoom, setPan, setElements, tool]);


  // Pointer Up 
  const onPointerUp = useCallback((e) => {

    // Reset cursor from grabbing
    if (panRef.current && e?.currentTarget) {
      e.currentTarget.style.cursor = tool === TOOLS.HAND ? 'grab' : (TOOL_CURSORS[tool] || 'default');
    }

    if (resizeRef.current) {
    pushHistory(elements);

    dragRef.current = null;
    resizeRef.current = null;

    return;
  }

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

    console.log("collabRef:", collabRef);
    console.log("collabRef.current:", collabRef?.current);

    collabRef?.current?.broadcast({ type: 'element', el: currentEl }) ;
    setCurrentEl(null);
  }, [currentEl, elements, pushHistory, setElements,collabRef, tool]);


  // Wheel zoom 
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.92 : 1.08
    setZoom(z => Math.min(Math.max(z * factor, 0.1), 8))
  }, [setZoom]);


  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel]);

  function getBounds(el) {
   return {
    left: Math.min(el.x1, el.x2),
    right: Math.max(el.x1, el.x2),
    top: Math.min(el.y1, el.y2),
    bottom: Math.max(el.y1, el.y2),
  };
  }

  function getResizeHandle(el, x, y) {
  if (!["rect", "ellipse"].includes(el.type)) return null;
 
  const b = getBounds(el);

  const handles = [
    { name: "nw", x: b.left, y: b.top },
    { name: "ne", x: b.right, y: b.top },
    { name: "sw", x: b.left, y: b.bottom },
    { name: "se", x: b.right, y: b.bottom },
  ];

  for (const h of handles) {
    if (
      Math.abs(x - h.x) <= HANDLE_HIT &&
      Math.abs(y - h.y) <= HANDLE_HIT
    ) {
      return h.name;
    }
  }

  return null;
  }

  function resizeRect(el, handle, x, y) {
  const next = { ...el };

  switch (handle) {
    case "nw":
      next.x1 = x;
      next.y1 = y;
      break;

    case "ne":
      next.x2 = x;
      next.y1 = y;
      break;

    case "sw":
      next.x1 = x;
      next.y2 = y;
      break;

    case "se":
      next.x2 = x;
      next.y2 = y;
      break;

    default:
      break;
  }

  return next;
  }


  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      overflow: 'hidden',
      zIndex: 1,
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: tool === TOOLS.HAND ? 'grab' : (TOOL_CURSORS[tool] || 'crosshair'),
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDoubleClick={onDoubleClick}
      />

      {/* Text input overlay */}
      {textInput && (
        <div
          style={{
            position: 'absolute',
            left: textInput.x,
            top: textInput.y - 2,
            zIndex: 50,
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="text"
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            placeholder="Type text..."
            style={{
              fontSize: Math.max(14, Math.round(20 * zoom)),
              fontFamily: "'Kalam', 'Assistant', sans-serif",
              color: color || '#1e1e1e',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px dashed #6965db',
              borderRadius: 4,
              outline: 'none',
              minWidth: 140,
              padding: '2px 8px',
              caretColor: '#6965db',
              boxShadow: '0 2px 10px rgba(105, 101, 219, 0.2)',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitText(e.target.value);
              }
              if (e.key === 'Escape') {
                setTextDraft('');
                setTextInput(null);
              }
            }}
            onBlur={(e) => {
              if (mountingRef.current) return;
              submitText(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  )
}
