import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pollService } from '../services/pollService'
import Layout from '../components/Layout'

export default function PollList() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortByVotes, setSortByVotes] = useState(false)

  useEffect(() => {
    pollService.list()
      .then((res) => setPolls(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = polls
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortByVotes ? b.votes_count - a.votes_count : 0))

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enquetes</h1>
        <Link to="/polls/new" className="bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark">
          Nova enquete
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar enquete..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          onClick={() => setSortByVotes(!sortByVotes)}
          className={`px-4 py-2 rounded-lg font-medium border ${sortByVotes ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-300'}`}
        >
          Mais votadas
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Nenhuma enquete encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((poll) => (
            <Link key={poll.id} to={`/polls/${poll.id}`}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">{poll.title}</h2>
              {poll.description && <p className="text-gray-500 text-sm mt-1">{poll.description}</p>}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                <span>por {poll.user?.name}</span>
                <span>{poll.votes_count} voto(s)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
