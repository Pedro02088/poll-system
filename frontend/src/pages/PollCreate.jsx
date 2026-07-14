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
    const copy = [...options]
    copy[i] = value
    setOptions(copy)
  }

  const addOption = () => options.length < 8 && setOptions([...options, ''])
  const removeOption = (i) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const clean = options.map((o) => o.trim()).filter(Boolean)
      const res = await pollService.create({ title, description, options: clean })
      navigate(`/polls/${res.data.id}`)
    } catch {
      setError('Erro ao criar. Preencha título e ao menos 2 opções.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nova enquete</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm max-w-lg">
        {error && <p className="text-accent text-sm mb-4">{error}</p>}
        <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="block text-sm font-medium text-gray-700 mb-2">Opções (2 a 8)</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={opt} onChange={(e) => setOption(i, e.target.value)} required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder={`Opção ${i + 1}`} />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(i)}
                className="px-3 text-accent font-bold">✕</button>
            )}
          </div>
        ))}
        {options.length < 8 && (
          <button type="button" onClick={addOption}
            className="text-brand text-sm font-medium mb-4">+ Adicionar opção</button>
        )}

        <div className="mt-4">
          <Button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar enquete'}</Button>
        </div>
      </form>
    </Layout>
  )
}
