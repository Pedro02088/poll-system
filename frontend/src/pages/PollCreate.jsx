import { useNavigate } from 'react-router-dom'
import { pollService } from '../services/pollService'
import Layout from '../components/Layout'
import PollForm from '../components/PollForm'
import Icon from '../components/Icon'

export default function PollCreate() {
  const navigate = useNavigate()

  const handleCreate = async (payload) => {
    const res = await pollService.create(payload)
    navigate(`/polls/${res.data.id}`)
  }

  return (
    <Layout>
      <button onClick={() => navigate('/')}
        className="group flex items-center gap-1 text-slate-500 hover:text-brand font-medium mb-5 transition-colors">
        <Icon name="back" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6 font-display">Nova enquete</h1>

      <PollForm
        submitLabel="Criar enquete"
        loadingLabel="Criando..."
        onSubmit={handleCreate}
      />
    </Layout>
  )
}
