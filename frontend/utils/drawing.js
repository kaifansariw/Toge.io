
const HANDLE_SIZE = 8;
const HANDLE_HIT = 10;
let _id = 0;

export const uid = () => `el_${Date.now()}_${_id++}`;

export function getPoint(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return { x: clientX - rect.left, y: clientY - rect.top }
}

export function drawElement(ctx, el, selected = false) {
  ctx.save()
  ctx.strokeStyle = el.color || '#f8f8f2'
  ctx.fillStyle = el.fill || 'transparent'
  ctx.lineWidth = el.strokeWidth || 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = el.opacity ?? 1

  if (selected) {
    ctx.shadowColor = '#8be9fd'
    ctx.shadowBlur = 10
  }

  switch (el.type) {
    case 'pen': {
      if (!el.points || el.points.length < 2) break
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      for (let i = 1; i < el.points.length; i++) {
        const prev = el.points[i - 1]
        const curr = el.points[i]
        ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2)
      }
      ctx.stroke()
      break
    }
    case 'rect': {
      const w = el.x2 - el.x1
      const h = el.y2 - el.y1
      ctx.beginPath()
      ctx.roundRect(el.x1, el.y1, w, h, 4)
      if (el.fill !== 'transparent') ctx.fill()
      ctx.stroke()
      break
    }
    case 'ellipse': {
      const cx = (el.x1 + el.x2) / 2
      const cy = (el.y1 + el.y2) / 2
      const rx = Math.abs(el.x2 - el.x1) / 2
      const ry = Math.abs(el.y2 - el.y1) / 2
      ctx.beginPath()
      ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2)
      if (el.fill !== 'transparent') ctx.fill()
      ctx.stroke()
      break
    }
    case 'arrow':
    case 'line': {
      const dx = el.x2 - el.x1
      const dy = el.y2 - el.y1
      ctx.beginPath()
      ctx.moveTo(el.x1, el.y1)
      ctx.lineTo(el.x2, el.y2)
      ctx.stroke()
      if (el.type === 'arrow') {
        const angle = Math.atan2(dy, dx)
        const len = 16
        ctx.beginPath()
        ctx.moveTo(el.x2, el.y2)
        ctx.lineTo(el.x2 - len * Math.cos(angle - 0.4), el.y2 - len * Math.sin(angle - 0.4))
        ctx.moveTo(el.x2, el.y2)
        ctx.lineTo(el.x2 - len * Math.cos(angle + 0.4), el.y2 - len * Math.sin(angle + 0.4))
        ctx.stroke()
      }
      break
    }
    case 'text': {
      ctx.font = `${el.fontSize || 18}px 'IBM Plex Mono', monospace`
      ctx.fillStyle = el.color || '#f8f8f2'
      ctx.shadowBlur = 0
      ctx.fillText(el.text || '', el.x1, el.y1)
      break
    }
    default:
      break
  }

  // Selection outline
  if (selected) {
    const pad = 10
    const x = Math.min(el.x1, el.x2 ?? el.x1) - pad
    const y = Math.min(el.y1, el.y2 ?? el.y1) - pad
    const w = Math.abs((el.x2 ?? el.x1) - el.x1) + pad * 2
    const h = Math.abs((el.y2 ?? el.y1) - el.y1) + pad * 2
    ctx.strokeStyle = '#8be9fd';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.shadowBlur = 0;
    ctx.strokeRect(x, y, Math.max(w, 24), Math.max(h, 24));
    ctx.setLineDash([]);

    // Corner handles
ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "#3b82f6";

if (el.type === "line" || el.type === "arrow") {

    [[el.x1, el.y1],[el.x2,el.y2]].forEach(([x,y])=>{

        ctx.beginPath();

        ctx.arc(x,y,5,0,Math.PI*2);

        ctx.fill();

        ctx.stroke();

    });

}
else{

    const corners=[

        [x,y],

        [x+w,y],

        [x,y+h],

        [x+w,y+h]

    ];

    corners.forEach(([cx,cy])=>{

        ctx.beginPath();

        ctx.rect(
            cx-HANDLE_SIZE/2,
            cy-HANDLE_SIZE/2,
            HANDLE_SIZE,
            HANDLE_SIZE
        );

        ctx.fill();

        ctx.stroke();

    });

   }}
  }

export function isHit(el, px, py) {
  const tol = 10
  switch (el.type) {
    case 'pen':
      return el.points?.some(p => Math.hypot(p.x - px, p.y - py) < tol * 2)
    case 'rect':
    case 'ellipse': {
      const x1 = Math.min(el.x1, el.x2)
      const y1 = Math.min(el.y1, el.y2)
      const x2 = Math.max(el.x1, el.x2)
      const y2 = Math.max(el.y1, el.y2)
      return px >= x1 - tol && px <= x2 + tol && py >= y1 - tol && py <= y2 + tol
    }
    case 'arrow':
    case 'line': {
      const len = Math.hypot(el.x2 - el.x1, el.y2 - el.y1)
      if (len === 0) return false
      const d = Math.abs(
        (el.y2 - el.y1) * px - (el.x2 - el.x1) * py + el.x2 * el.y1 - el.y2 * el.x1,
      ) / len
      return d < tol
    }
    case 'text':
      return Math.abs(px - el.x1) < 100 && Math.abs(py - el.y1) < 24
    default:
      return false
  }
 }

export function drawGrid(ctx, width, height, pan, gridSize = 30) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1;
  for (let x = pan.x % gridSize; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = pan.y % gridSize; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
 }


export function getBounds(el) {
  switch (el.type) {
    case "rect":
    case "ellipse":
      return {
        left: Math.min(el.x1, el.x2),
        right: Math.max(el.x1, el.x2),
        top: Math.min(el.y1, el.y2),
        bottom: Math.max(el.y1, el.y2),
      };

    case "line":
    case "arrow":
      return {
        left: Math.min(el.x1, el.x2),
        right: Math.max(el.x1, el.x2),
        top: Math.min(el.y1, el.y2),
        bottom: Math.max(el.y1, el.y2),
      };

    default:
      return null;
  }
}

export function getResizeHandle(el, x, y) {

  if (!el) return null;

  // For Line and ARROW

  if (el.type === "line" || el.type === "arrow") {

    if (
      Math.abs(x - el.x1) < HANDLE_HIT &&
      Math.abs(y - el.y1) < HANDLE_HIT
    )
      return "start";

    if (
      Math.abs(x - el.x2) < HANDLE_HIT &&
      Math.abs(y - el.y2) < HANDLE_HIT
    )
      return "end";

    return null;
  }

  // For Rectangle and circle

  if (
    el.type !== "rect" &&
    el.type !== "ellipse"
  )
    return null;

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

export function resizeElement(el, handle, x, y) {

  const next = { ...el };

  // RECT + ELLIPSE

  if (
    el.type === "rect" ||
    el.type === "ellipse"
  ) {

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
    }

    return next;
  }

  // LINE + ARROW

  if (
    el.type === "line" ||
    el.type === "arrow"
  ) {

    if (handle === "start") {
      next.x1 = x;
      next.y1 = y;
    }

    if (handle === "end") {
      next.x2 = x;
      next.y2 = y;
    }

    return next;
  }

  return next;
}

