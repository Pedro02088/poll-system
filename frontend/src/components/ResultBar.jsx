export default function ResultBar({ text, votes, total, highlight, chosen }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-sm mb-1.5 gap-2">
        <span className={`font-medium flex items-center gap-2 min-w-0 ${highlight ? 'text-brand' : 'text-slate-700'}`}>
          <span className="truncate">{text}</span>
          {chosen && (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide border border-brand/40 text-brand px-2 py-0.5 rounded-full">
              Sua escolha
            </span>
          )}
          {highlight && (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-brand-soft text-brand px-2 py-0.5 rounded-full">
              Liderando
            </span>
          )}
        </span>
        <span className="text-slate-500 tabular-nums shrink-0">
          <span className="font-semibold text-slate-700">{votes}</span> · {pct}%
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={highlight ? 'bar-gradient h-3 rounded-full' : 'bg-brand/40 h-3 rounded-full'}
          style={{ width: `${pct}%`, transition: 'width .6s cubic-bezier(.16,1,.3,1)' }}
        />
      </div>
    </div>
  )
}
