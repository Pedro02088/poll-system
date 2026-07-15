import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pollService } from '../services/pollService'
import { useSSE } from '../hooks/useSSE'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import ResultBar from '../components/ResultBar'
import Icon from '../components/Icon'

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
    pollService.get(id).then((res) => {
      setPoll(res.data)
      if (res.data.has_voted) setVoted(true)
    })
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
    if (!confirm('Tem certeza que deseja excluir esta enquete?')) return
    await pollService.remove(id)
    navigate('/')
  }

  const share = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado para a área de transferência.')
  }

  if (!poll) return <Layout><div className="skeleton h-48 rounded-2xl" /></Layout>

  const results = liveResults || poll.options.map((o) => ({ ...o, votes: 0 }))
  const total = results.reduce((sum, o) => sum + o.votes, 0)
  const maxVotes = Math.max(...results.map((r) => r.votes), 0)
  const isOwner = user?.id === poll.user_id

  return (
    <Layout>
      <button onClick={() => navigate('/')}
        className="group flex items-center gap-1 text-slate-500 hover:text-brand font-medium mb-5 transition-colors">
        <Icon name="back" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Voltar
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-800 font-display">{poll.title}</h1>
            {poll.description && <p className="text-slate-500 mt-1">{poll.description}</p>}
            <p className="text-sm text-slate-400 mt-2">por {poll.user?.name}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={share} title="Compartilhar"
              className="text-slate-400 hover:text-brand p-2 rounded-lg hover:bg-brand-soft transition-colors">
              <Icon name="share" className="w-5 h-5" />
            </button>
            {isOwner && (
              <button onClick={handleDelete} title="Excluir"
                className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Icon name="trash" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm px-4 py-3 rounded-xl mt-4">{error}</div>}

        <div className="mt-6">
          {!voted ? (
            <>
              <p className="font-semibold text-slate-700 mb-3">Escolha uma opção:</p>
              {poll.options.map((opt) => (
                <button key={opt.id} onClick={() => handleVote(opt.id)}
                  className="w-full text-left px-4 py-3.5 mb-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 transition-all duration-200 hover:border-brand hover:bg-brand-soft hover:scale-[1.01] active:scale-[0.99]">
                  {opt.text}
                </button>
              ))}
            </>
          ) : (
            <div className="animate-fade-in">
              {poll.has_voted && (
                <div className="flex items-center gap-2 bg-brand-soft text-brand text-sm font-medium px-4 py-2.5 rounded-xl mb-4">
                  <Icon name="check" className="w-4 h-4 shrink-0" />
                  Você já votou nesta enquete.
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-slate-700">Resultados</p>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  em tempo real
                </span>
              </div>

              {results.map((opt) => (
                <ResultBar key={opt.id} text={opt.text} votes={opt.votes} total={total}
                  highlight={opt.votes === maxVotes && maxVotes > 0}
                  chosen={opt.id === poll.user_vote_option_id} />
              ))}

              <p className="text-sm text-slate-400 mt-5 pt-4 border-t border-slate-100">
                Total de <span className="font-semibold text-slate-600">{total}</span> voto(s)
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
