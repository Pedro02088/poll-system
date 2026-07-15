import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pollService } from '../services/pollService'
import Layout from '../components/Layout'
import PollForm from '../components/PollForm'
import Icon from '../components/Icon'

// "2030-05-05T10:00:00.000000Z" -> "2030-05-05T10:00" (formato do datetime-local)
function toInputValue(iso) {
  return iso ? iso.slice(0, 16) : ''
}

export default function PollEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poll, setPoll] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    pollService.get(id)
      .then((res) => setPoll(res.data))
      .catch(() => setError('Não foi possível carregar esta enquete.'))
  }, [id])

  const handleUpdate = async (payload) => {
    await pollService.update(id, payload)
    navigate(`/polls/${id}`)
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">{error}</p>
        </div>
      </Layout>
    )
  }

  if (!poll) return <Layout><div className="skeleton h-64 rounded-2xl max-w-lg" /></Layout>

  return (
    <Layout>
      <button onClick={() => navigate(`/polls/${id}`)}
        className="group flex items-center gap-1 text-slate-500 hover:text-brand font-medium mb-5 transition-colors">
        <Icon name="back" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6 font-display">Editar enquete</h1>

      <PollForm
        showOptions={false}
        initial={{
          title: poll.title,
          description: poll.description ?? '',
          expiresAt: toInputValue(poll.expires_at),
          isAnonymous: poll.is_anonymous,
        }}
        submitLabel="Salvar alterações"
        loadingLabel="Salvando..."
        onSubmit={handleUpdate}
      />
    </Layout>
  )
}
