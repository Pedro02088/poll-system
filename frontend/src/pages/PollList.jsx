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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enquetes</h1>
          <p className="text-slate-400 text-sm mt-0.5">Vote e acompanhe os resultados em tempo real</p>
        </div>
        <Link to="/polls/new"
          className="flex items-center gap-1.5 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-dark">
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
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
        </div>
        <button onClick={() => setSortByVotes(!sortByVotes)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold border ${sortByVotes ? 'bg-brand text-white border-brand' : 'bg-white text-slate-600 border-slate-200 hover:border-brand'}`}>
          <Icon name="fire" className="w-4 h-4" /> Mais votadas
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map((i) => <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-slate-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">Nenhuma enquete encontrada. Crie a primeira!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((poll) => (
            <Link key={poll.id} to={`/polls/${poll.id}`}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand/40 hover:shadow-md group">
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-brand">{poll.title}</h2>
              {poll.description && <p className="text-slate-500 text-sm mt-1">{poll.description}</p>}
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
