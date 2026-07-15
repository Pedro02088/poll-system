export default function Button({ children, variant = 'brand', ...props }) {
  const base =
    'w-full py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100'
  const styles = {
    brand: 'btn-gradient text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
    outline: 'bg-white text-brand border border-slate-200 hover:border-brand hover:bg-brand-soft',
  }
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}
