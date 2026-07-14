export default function Button({ children, variant = 'brand', ...props }) {
  const styles = {
    brand: 'bg-brand hover:bg-brand-dark text-white shadow-md shadow-brand/25',
    outline: 'bg-white hover:bg-slate-50 text-brand border border-slate-200',
  }
  return (
    <button
      className={`w-full py-2.5 rounded-xl font-semibold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
