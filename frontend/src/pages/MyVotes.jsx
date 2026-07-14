import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Layout from '../components/Layout'

export default function MyVotes() {
  const [votes, setVotes] = useState([])

  useEffect(() => {
    api.get('/my-votes').then((res) => setVotes(res.data))
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus votos</h1>
      {votes.length === 0 ? (
        <p className="text-gray-500">Você ainda não votou em nenhuma enquete.</p>
      ) : (
        <div className="grid gap-3">
          {votes.map((v) => (
            <Link key={v.poll_id} to={`/polls/${v.poll_id}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md border border-gray-100">
              <span className="font-medium text-gray-800">{v.poll_title}</span>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
