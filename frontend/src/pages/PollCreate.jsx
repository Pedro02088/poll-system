import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pollService } from '../services/pollService'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Button from '../components/Button'

export default function PollCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setOption = (i, value) => {
    const copy = [...options]; copy[i] = value; setOptions(copy)
  }
  const addOption = () => options.length < 8 && setOptions([...options, ''])
  const removeOption = (i) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const clean = options.map((o) => o.trim()).filter(Boolean)
      const res = await pollService.create({ title, description, options: clean })
      navigate(`/polls/${res.data.id}`)
    } catch {
      setError('Erro ao criar. Preencha título e ao menos 2 opções.')
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-slate-500 hover:text-brand font-medium mb-5 group">
        <span className="group-hover:-translate-x-0.5">←</span> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova enquete</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-lg">
        {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
        <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="block text-sm font-semibold text-slate-700 mb-2">Opções (2 a 8)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={opt} onChange={(e) => setOption(i, e.target.value)} required
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              placeholder={`Opção ${i + 1}`} />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(i)}
                className="px-3 text-red-400 hover:text-red-600 font-bold rounded-lg hover:bg-red-50">✕</button>
            )}
          </div>
        ))}
        {options.length < 8 && (
          <button type="button" onClick={addOption} className="text-brand text-sm font-semibold mb-4 hover:underline">
            + Adicionar opção
          </button>
        )}

        <div className="mt-4">
          <Button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar enquete'}</Button>
        </div>
      </form>
    </Layout>
  )
}
