import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch {
      setError('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-brand/10 blur-3xl" />

      <div className="w-full max-w-md animate-fade-in relative">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-slate-400 mt-3 text-xs tracking-[0.22em]">SUA OPINIÃO CONTA</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 font-display">Entrar</h2>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}
          <Input label="E-mail" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Senha" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
          <p className="text-sm text-center mt-4">
            <Link to="/forgot-password" className="text-slate-400 hover:text-brand transition-colors">Esqueci minha senha</Link>
          </p>
          <p className="text-sm text-center mt-5 text-slate-500">
            Não tem conta? <Link to="/register" className="text-brand font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
