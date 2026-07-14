import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
    } catch {
      setError('Erro ao cadastrar. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand mb-6 text-center">Criar conta</h1>
        {error && <p className="text-accent text-sm mb-4">{error}</p>}
        <Input label="Nome" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="E-mail" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Senha" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Input label="Confirmar senha" type="password" value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
        <Button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        <p className="text-sm text-center mt-4 text-gray-600">
          Já tem conta? <Link to="/login" className="text-brand font-medium">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
