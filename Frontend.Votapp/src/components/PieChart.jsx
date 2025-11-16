import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default function PieChart({ labels, values, title }) {
  const colors = [
    'rgba(59, 130, 246, 0.8)', // blue-500
    'rgba(16, 185, 129, 0.8)', // emerald-500
    'rgba(236, 72, 153, 0.8)', // pink-500
    'rgba(234, 179, 8, 0.8)',  // yellow-500
    'rgba(99, 102, 241, 0.8)', // indigo-500
    'rgba(20, 184, 166, 0.8)', // teal-500
  ]
  const data = {
    labels,
    datasets: [
      {
        label: title ?? 'Distribución',
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 0,
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: !!title, text: title },
    },
    cutout: '60%'
  }
  return (
    <div className="w-full max-w-xl mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  )
}


