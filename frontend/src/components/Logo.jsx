export default function Logo({ size = 'md', white = false }) {
  const dims = size === 'lg'
    ? { box: 44, icon: 28, text: 'text-3xl' }
    : { box: 36, icon: 22, text: 'text-xl' }

  // Em fundo claro: barras azuis. Em header colorido (white): tudo branco.
  const barFrom = white ? '#ffffff' : '#3b82f6'
  const barTo = white ? '#ffffff' : '#1d4ed8'
  const bubble = white ? 'rgba(255,255,255,.9)' : '#2563eb'
  const gid = white ? 'logoGradW' : 'logoGrad'

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: dims.box,
          height: dims.box,
          background: white ? 'rgba(255,255,255,.15)' : '#eff6ff',
        }}
      >
        <svg width={dims.icon} height={dims.icon} viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={barFrom} />
              <stop offset="1" stopColor={barTo} />
            </linearGradient>
          </defs>
          {/* balão de fala (voz / opinião) */}
          <path
            d="M6 4h20a3 3 0 013 3v10a3 3 0 01-3 3H15l-6 5v-5H6a3 3 0 01-3-3V7a3 3 0 013-3z"
            stroke={bubble}
            strokeWidth="1.8"
            fill="none"
            strokeLinejoin="round"
          />
          {/* três barras crescentes (votação / resultados) */}
          <rect x="9.5" y="13" width="3" height="4" rx="1" fill={`url(#${gid})`} />
          <rect x="14.5" y="10.5" width="3" height="6.5" rx="1" fill={`url(#${gid})`} />
          <rect x="19.5" y="8" width="3" height="9" rx="1" fill={`url(#${gid})`} />
        </svg>
      </div>
      <span
        className={`font-display font-bold tracking-tight ${dims.text}`}
        style={{ color: white ? '#ffffff' : '#0f172a' }}
      >
        Enlace
      </span>
    </div>
  )
}
