import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Icon from './Icon'

/**
 * Formulário compartilhado entre criar e editar enquete.
 * Na edição as opções não são exibidas: alterá-las apagaria os votos já
 * registrados nelas (as FKs de votes usam ON DELETE CASCADE).
 */
export default function PollForm({
  initial = {},
  showOptions = true,
  submitLabel,
  loadingLabel,
  onSubmit,
}) {
  const [title, setTitle] = useState(initial.title ?? '')
  const [description, setDescription] = useState(initial.description ?? '')
  const [expiresAt, setExpiresAt] = useState(initial.expiresAt ?? '')
  const [isAnonymous, setIsAnonymous] = useState(initial.isAnonymous ?? false)
  const [options, setOptions] = useState(initial.options ?? ['', ''])
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
      const payload = {
        title,
        description,
        expires_at: expiresAt || null,
        is_anonymous: isAnonymous,
      }
      if (showOptions) payload.options = options.map((o) => o.trim()).filter(Boolean)
      await onSubmit(payload)
    } catch (err) {
      const errors = err.response?.data?.errors
      const first = errors ? Object.values(errors)[0]?.[0] : null
      setError(first || err.response?.data?.message || 'Não foi possível salvar. Verifique os dados.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-100 max-w-lg">
      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input label="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />

      {showOptions ? (
        <>
          <label className="block text-sm font-medium text-slate-700 mb-2">Opções (2 a 8)</label>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={opt} onChange={(e) => setOption(i, e.target.value)} required
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 transition-all duration-200 focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                placeholder={`Opção ${i + 1}`} />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(i)} title="Remover opção"
                  className="px-2.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {options.length < 8 && (
            <button type="button" onClick={addOption}
              className="inline-flex items-center gap-1 text-brand text-sm font-semibold mb-4 hover:underline">
              <Icon name="plus" className="w-4 h-4" /> Adicionar opção
            </button>
          )}
        </>
      ) : (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm font-medium text-slate-600">As opções não podem ser alteradas</p>
          <p className="text-xs text-slate-400 mt-0.5">Editar as opções descartaria os votos já registrados nelas.</p>
        </div>
      )}

      <div className="mt-5">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Encerrar em (opcional)</label>
        <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 transition-all duration-200 focus:bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
        <p className="text-xs text-slate-400 mt-1.5">Depois desta data a enquete para de aceitar votos.</p>
      </div>

      <label className="flex items-start gap-3 mt-5 p-3.5 rounded-xl border border-slate-200 cursor-pointer transition-colors hover:border-brand/50 hover:bg-brand-soft/40">
        <button type="button" role="switch" aria-checked={isAnonymous}
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`relative shrink-0 mt-0.5 w-10 h-6 rounded-full transition-colors duration-200 ${isAnonymous ? 'bg-brand' : 'bg-slate-300'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isAnonymous ? 'translate-x-4' : ''}`} />
        </button>
        <span>
          <span className="block text-sm font-medium text-slate-700">Permitir votos anônimos (sem login)</span>
          <span className="block text-xs text-slate-400 mt-0.5">Qualquer pessoa com o link pode votar, uma vez por dispositivo.</span>
        </span>
      </label>

      <div className="mt-5">
        <Button type="submit" disabled={loading}>{loading ? loadingLabel : submitLabel}</Button>
      </div>
    </form>
  )
}
