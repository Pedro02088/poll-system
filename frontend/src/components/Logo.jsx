export default function Logo({ size = 'md', white = false }) {
  const dims = size === 'lg'
    ? { box: 'w-11 h-11', icon: 28, text: 'text-3xl' }
    : { box: 'w-9 h-9', icon: 22, text: 'text-xl' }
  const color = white ? '#ffffff' : '#2563eb'

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center rounded-xl"
        style={{ width: dims.box === 'w-11 h-11' ? 44 : 36, height: dims.box === 'w-11 h-11' ? 44 : 36, background: white ? 'rgba(255,255,255,.15)' : '#eff6ff' }}>
        <svg width={dims.icon} height={dims.icon} viewBox="0 0 32 32" fill="none">
          <path d="M9 20c-2 0-4-1.6-4-4s2-4 4-4c1.5 0 2.8.8 3.4 2" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M23 12c2 0 4 1.6 4 4s-2 4-4 4c-1.5 0-2.8-.8-3.4-2" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="9" cy="16" r="2.4" fill={color}/>
          <circle cx="23" cy="16" r="2.4" fill={color}/>
        </svg>
      </div>
      <span className={`font-display font-bold tracking-tight ${dims.text}`} style={{ color }}>
        Enlace
      </span>
    </div>
  )
}
