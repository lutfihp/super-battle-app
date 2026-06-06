type Props = { name: string; size?: number }

export function NodeIcon({ name, size = 18 }: Props) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'browser': return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 8h18"/><circle cx="6" cy="6" r="0.4"/></svg>
    case 'proxy':   return <svg {...p}><path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="2.4"/></svg>
    case 'next':    return <svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M9 8v8M9 8l6 8M15 8v6"/></svg>
    case 'py':      return <svg {...p}><path d="M9 4h6a2 2 0 0 1 2 2v4H7V6a2 2 0 0 1 2-2z"/><path d="M7 14h10v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/></svg>
    case 'db':      return <svg {...p}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>
    case 'ai':      return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="3.4"/><path d="M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"/></svg>
    case 'ext':     return <svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 2.4 14.7 0 17M12 3.5c-2.4 2.3-2.4 14.7 0 17"/></svg>
    case 'click':   return <svg {...p}><path d="M7 7l3.5 11 2-4.5 4.5-2z"/></svg>
    case 'scale':   return <svg {...p}><path d="M12 4v16M5 8h14M5 8l-2 5h4zM19 8l-2 5h4z"/></svg>
    case 'search':  return <svg {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/></svg>
    case 'save':    return <svg {...p}><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/></svg>
    case 'sparkle': return <svg {...p}><path d="M12 4l1.8 4.7L18.5 10l-4.7 1.3L12 16l-1.8-4.7L5.5 10l4.7-1.3z"/></svg>
    default:        return <svg {...p}><circle cx="12" cy="12" r="8"/></svg>
  }
}
