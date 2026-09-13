export default function Icon({ d, size = 20, strokeWidth = 2 }) {
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {
      Array.isArray(d)
        ? d.map((path, i) => <path key={i} d={path} />)
        : <path d={d} />
        }
    </svg>
  )
}

export const ICONS = {
  select:    'M5 3l14 9-7 1-4 7z',
  hand:      ['M18 11V6a2 2 0 0 0-4 0v5', 'M14 10V4a2 2 0 0 0-4 0v6', 'M10 10.5V6a2 2 0 0 0-4 0v8', 'M18 11a2 2 0 0 1 4 0v7a8 8 0 0 1-8 8h-2c-2.5 0-4.5-1-6.2-2.8L3 20'],
  pen:       'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z',
  rect:      'M3 3h18v18H3z',
  ellipse:   'M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z',
  arrow:     'M5 12h14M12 5l7 7-7 7',
  line:      'M5 19L19 5',
  text:      'M4 7V4h16v3M9 20h6M12 4v16',
  eraser:    'M18 13l-5 5H7l-4-4 9-9 6 6zM2 22h20',
  undo:      'M3 7v6h6M3 13A9 9 0 1 0 6 6.8',
  redo:      'M21 7v6h-6M21 13A9 9 0 1 1 18 6.8',
  trash:     'M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2',
  collab:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  close:     'M18 6L6 18M6 6l12 12',
  copy:      'M8 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M11 21h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z',
  users:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  download:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  grid:      'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  menu:      'M4 6h16M4 12h16M4 18h16',
  zoomIn:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M8 11h6M11 8v6',
  zoomOut:   'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35M8 11h6',
  minus:     'M5 12h14',
  plus:      'M12 5v14M5 12h14',
  help:      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  lock:      'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
}
