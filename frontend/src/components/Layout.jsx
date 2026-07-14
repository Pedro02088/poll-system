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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-5">
            <Link to="/my-votes" className="text-slate-600 text-sm font-medium hover:text-brand">Meus votos</Link>
            <span className="text-slate-400 text-sm hidden sm:inline">{user?.name}</span>
            <button onClick={handleLogout}
              className="text-sm text-slate-600 border border-slate-200 px-3.5 py-1.5 rounded-lg font-medium hover:border-brand hover:text-brand">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">{children}</main>
    </div>
  )
}
