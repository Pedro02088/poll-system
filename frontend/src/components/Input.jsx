export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
        {...props}
      />
    </div>
  )
}
