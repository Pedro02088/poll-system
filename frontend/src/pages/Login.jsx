import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand mb-6 text-center">Entrar</h1>
        {error && <p className="text-accent text-sm mb-4">{error}</p>}
        <Input label="E-mail" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Senha" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
        <p className="text-sm text-center mt-4 text-gray-600">
          Não tem conta? <Link to="/register" className="text-brand font-medium">Cadastre-se</Link>
        </p>
      </form>
    </div>
  )
}
