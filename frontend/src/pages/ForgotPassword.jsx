import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await api.post('/forgot-password', { email })
      setSuccess(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível enviar o link.')
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
          <h2 className="text-xl font-bold text-slate-800 mb-2">Recuperar senha</h2>
          <p className="text-slate-500 text-sm mb-6">Informe seu e-mail e enviaremos um link de recuperação.</p>

          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-100 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

          <Input label="E-mail" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar link de recuperação'}</Button>

          <p className="text-sm text-center mt-5 text-slate-500">
            Lembrou a senha? <Link to="/login" className="text-brand font-semibold hover:underline">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
