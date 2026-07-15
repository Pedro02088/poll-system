import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pollService } from '../services/pollService'
import Layout from '../components/Layout'
import Icon from '../components/Icon'

export default function PollList() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortByVotes, setSortByVotes] = useState(false)

  useEffect(() => {
    pollService.list().then((res) => setPolls(res.data)).finally(() => setLoading(false))
  }, [])

  const filtered = polls
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortByVotes ? b.votes_count - a.votes_count : 0))

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Enquetes</h1>
          <p className="text-slate-400 text-sm mt-0.5">Vote e acompanhe os resultados em tempo real</p>
        </div>
        <Link to="/polls/new"
          className="btn-gradient flex items-center justify-center gap-1.5 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 shrink-0">
          <Icon name="plus" className="w-4 h-4" /> Nova enquete
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="w-4 h-4" />
          </span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar enquete..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
        </div>
        <button onClick={() => setSortByVotes(!sortByVotes)}
          title="Mais votadas"
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold border shrink-0 transition-all duration-200 ${sortByVotes ? 'bg-brand text-white border-brand shadow-md shadow-blue-500/25' : 'bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand'}`}>
          <Icon name="fire" className="w-4 h-4" />
          <span className="hidden sm:inline">Mais votadas</span>
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-soft text-brand mb-3">
            <Icon name="search" className="w-6 h-6" />
          </div>
          <p className="text-slate-500">Nenhuma enquete encontrada. Crie a primeira!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((poll, i) => (
            <Link key={poll.id} to={`/polls/${poll.id}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in-up bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 hover:border-brand/30 group">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-brand transition-colors">{poll.title}</h2>
                <span className="flex gap-1.5 shrink-0">
                  {poll.is_expired && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      Encerrada
                    </span>
                  )}
                  {poll.is_anonymous && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      Anônima
                    </span>
                  )}
                </span>
              </div>
              {poll.description && <p className="text-slate-500 text-sm mt-1 line-clamp-2">{poll.description}</p>}
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-slate-400">por {poll.user?.name}</span>
                <span className="bg-brand-soft text-brand px-3 py-1 rounded-full font-semibold text-xs">
                  {poll.votes_count} voto(s)
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
