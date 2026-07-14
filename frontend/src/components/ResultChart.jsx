import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ResultChart({ results }) {
  const data = {
    labels: results.map((r) => r.text),
    datasets: [
      {
        data: results.map((r) => r.votes),
        backgroundColor: ['#2563eb', '#dc2626', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const options = {
    plugins: { legend: { position: 'bottom' } },
  }

  return <Doughnut data={data} options={options} />
}
