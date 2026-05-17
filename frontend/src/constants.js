export const TOOLS = {
  SELECT: 'select',
  PEN: 'pen',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
  ARROW: 'arrow',
  LINE: 'line',
  TEXT: 'text',
  ERASER: 'eraser',
}

export const COLORS = [
  '#f8f8f2',
  '#ff79c6',
  '#50fa7b',
  '#ffb86c',
  '#8be9fd',
  '#bd93f9',
  '#ff5555',
  '#f1fa8c',
]

export const STROKE_WIDTHS = [2, 4, 8, 14]

export const TOOL_CURSORS = {
  [TOOLS.SELECT]: 'default',
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
  p: TOOLS.PEN,
  r: TOOLS.RECT,
  e: TOOLS.ELLIPSE,
  a: TOOLS.ARROW,
  l: TOOLS.LINE,
  t: TOOLS.TEXT,
  x: TOOLS.ERASER,
}
