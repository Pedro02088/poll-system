import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Layout from '../components/Layout'
import Icon from '../components/Icon'

export default function MyVotes() {
  const navigate = useNavigate()
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-votes').then((res) => setVotes(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <button onClick={() => navigate('/')}
        className="flex items-center gap-1 text-slate-500 hover:text-brand font-medium mb-5">
        <Icon name="back" className="w-4 h-4" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Meus votos</h1>

      {loading ? (
        <div className="grid gap-3">
          {[1,2].map((i) => <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-slate-100" />)}
        </div>
      ) : votes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">Você ainda não votou em nenhuma enquete.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {votes.map((v) => (
            <Link key={v.poll_id} to={`/polls/${v.poll_id}`}
              className="bg-white p-4 rounded-xl border border-slate-100 hover:border-brand/40 hover:shadow-sm">
              <span className="font-semibold text-slate-800">{v.poll_title}</span>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
