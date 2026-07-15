import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-slate-200/40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="transition-transform hover:scale-[1.02]"><Logo /></Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/my-votes"
              className="text-slate-600 text-sm font-medium hover:text-brand px-2 py-1 rounded-lg transition-colors">
              Meus votos
            </Link>
            <span className="text-slate-400 text-sm hidden sm:inline">{user?.name}</span>
            <button onClick={handleLogout}
              className="text-sm text-slate-600 border border-slate-200 px-3.5 py-1.5 rounded-lg font-medium hover:border-brand hover:text-brand transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">{children}</main>
    </div>
  )
}
