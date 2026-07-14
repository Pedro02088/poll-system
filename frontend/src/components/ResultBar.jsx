export default function ResultBar({ text, votes, total }) {
  const pct = total > 0 ? Math.round((votes / total) * 100) : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{text}</span>
        <span className="text-gray-500">{votes} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-brand h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
