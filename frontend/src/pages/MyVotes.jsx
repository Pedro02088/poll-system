import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Layout from '../components/Layout'
import Icon from '../components/Icon'

export default function MyVotes() {
  const navigate = useNavigate()
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/my-votes')
      .then((res) => setVotes(res.data))
      .catch(() => setError('Não foi possível carregar seus votos. Verifique sua conexão e tente novamente.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <button onClick={() => navigate('/')}
        className="group flex items-center gap-1 text-slate-500 hover:text-brand font-medium mb-5 transition-colors">
        <Icon name="back" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6 font-display">Meus votos</h1>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()}
            className="text-brand font-semibold text-sm mt-3 hover:underline">
            Tentar novamente
          </button>
        </div>
      ) : votes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">Você ainda não votou em nenhuma enquete.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {votes.map((v, i) => (
            <Link key={v.poll_id} to={`/polls/${v.poll_id}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in-up bg-white p-4 rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md hover:shadow-blue-500/10 group flex items-center justify-between">
              <span className="font-semibold text-slate-800 group-hover:text-brand transition-colors">{v.poll_title}</span>
              <Icon name="back" className="w-4 h-4 text-slate-300 rotate-180 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
