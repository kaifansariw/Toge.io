export const TOOLS = {
  SELECT: 'select',
  HAND: 'hand',
  PEN: 'pen',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
  ARROW: 'arrow',
  LINE: 'line',
  TEXT: 'text',
  ERASER: 'eraser',
}

export const COLORS = [
  '#1e1e1e',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#c2255c',
  '#6741d9',
  '#0c8599',
];

export const STROKE_WIDTHS = [1, 2, 4, 8];

export const TOOL_CURSORS = {
  [TOOLS.SELECT]: 'default',
  [TOOLS.HAND]: 'grab',
  [TOOLS.PEN]: 'crosshair',
  [TOOLS.RECT]: 'crosshair',
  [TOOLS.ELLIPSE]: 'crosshair',
  [TOOLS.ARROW]: 'crosshair',
  [TOOLS.LINE]: 'crosshair',
  [TOOLS.TEXT]: 'text',
  [TOOLS.ERASER]: 'cell',
}

export const KEYBOARD_SHORTCUTS = {
  v: TOOLS.SELECT,
  h: TOOLS.HAND,
  p: TOOLS.PEN,
  r: TOOLS.RECT,
  e: TOOLS.ELLIPSE,
  a: TOOLS.ARROW,
  l: TOOLS.LINE,
  t: TOOLS.TEXT,
  x: TOOLS.ERASER,
}
