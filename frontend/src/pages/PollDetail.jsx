import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pollService } from '../services/pollService'
import { useSSE } from '../hooks/useSSE'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import ResultBar from '../components/ResultBar'
import ResultChart from '../components/ResultChart'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function PollDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [poll, setPoll] = useState(null)
  const [voted, setVoted] = useState(false)
  const [error, setError] = useState('')

  // Só conecta o stream de resultados depois do voto — durante a votação o
  // EventSource não precisa competir com o clique pelo processo do servidor.
  const liveResults = useSSE(voted ? `${API}/polls/${id}/stream` : null)

  useEffect(() => {
    pollService.get(id).then((res) => setPoll(res.data))
  }, [id])

  const handleVote = async (optionId) => {
    setError('')
    try {
      await pollService.vote(id, optionId)
      setVoted(true)
    } catch (e) {
      setError(e.response?.data?.message || 'Erro ao votar')
      setVoted(true)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Excluir esta enquete?')) return
    await pollService.remove(id)
    navigate('/')
  }

  if (!poll) return <Layout><p className="text-gray-500">Carregando...</p></Layout>

  const results = liveResults || poll.options.map((o) => ({ ...o, votes: 0 }))
  const total = results.reduce((sum, o) => sum + o.votes, 0)
  const isOwner = user?.id === poll.user_id

  return (
    <Layout>
      <button onClick={() => navigate('/')} className="text-brand text-sm mb-4">← Voltar</button>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{poll.title}</h1>
            {poll.description && <p className="text-gray-500 mt-1">{poll.description}</p>}
          </div>
          {isOwner && (
            <button onClick={handleDelete} className="text-accent text-sm font-medium">Excluir</button>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-2">por {poll.user?.name}</p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copiado!')
          }}
          className="text-brand text-sm font-medium mt-2"
        >
          🔗 Compartilhar
        </button>

        {error && <p className="text-accent text-sm mt-4">{error}</p>}

        <div className="mt-6">
          {!voted ? (
            <>
              <p className="font-medium text-gray-700 mb-3">Escolha uma opção:</p>
              {poll.options.map((opt) => (
                <button key={opt.id} onClick={() => handleVote(opt.id)}
                  className="w-full text-left px-4 py-3 mb-2 border border-gray-200 rounded-lg hover:border-brand hover:bg-blue-50 transition">
                  {opt.text}
                </button>
              ))}
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700 mb-3">Resultados ao vivo:</p>
              {results.map((opt) => (
                <ResultBar key={opt.id} text={opt.text} votes={opt.votes} total={total} />
              ))}
              {total > 0 && (
                <div className="max-w-xs mx-auto my-6">
                  <ResultChart results={results} />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">Total: {total} voto(s) · atualiza automaticamente</p>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
