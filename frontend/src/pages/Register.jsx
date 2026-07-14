import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0]?.[0] : null
      setError(firstError || err.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-slate-400 mt-3 text-sm tracking-wide">SUA OPINIÃO CONTA</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Criar conta</h2>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}
          <Input label="Nome" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="E-mail" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Senha" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirmar senha" type="password" value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
          <Button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
          <p className="text-sm text-center mt-5 text-slate-500">
            Já tem conta? <Link to="/login" className="text-brand font-semibold hover:underline">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
