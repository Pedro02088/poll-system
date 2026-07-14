export default function Button({ children, variant = 'brand', ...props }) {
  const colors = {
    brand: 'bg-brand hover:bg-brand-dark',
    accent: 'bg-accent hover:opacity-90',
  }
  return (
    <button
      className={`w-full py-2 rounded-lg text-white font-medium transition ${colors[variant]} disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  )
}
