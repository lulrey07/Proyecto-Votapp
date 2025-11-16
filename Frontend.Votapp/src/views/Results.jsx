import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'

export default function Results({ votacion, onBack, onCloseVoting }) {
  if (!votacion) return null
  const opciones = votacion.opciones || []
  const votos = votacion.votos || []
  const resultados = opciones.map((opcion, index) => {
    const votosOpcion = votos.filter(v => v.opcion === index).length
    return { opcion, votos: votosOpcion }
  })
  const totalVotos = votos.length
  const maxVotos = Math.max(0, ...resultados.map(r => r.votos))

  const labels = opciones
  const values = resultados.map(r => r.votos)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Resultados</h1>
        <div className="flex space-x-3">
          <button onClick={() => onCloseVoting(votacion.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">🔒 Cerrar Votación</button>
          <button onClick={() => onBack('votacion', votacion.id)} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">👁️ Ver Votación</button>
          <button onClick={() => onBack('dashboard')} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Dashboard</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">{votacion.titulo}</h3>
            <p className="text-sm text-gray-600">{votacion.codigoAcceso}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Estado:</span>
            <p className={`font-medium ${votacion.estado === 'Activa' ? 'text-green-600' : 'text-gray-600'}`}>{votacion.estado}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Total Votos:</span>
            <p className="text-2xl font-bold text-teal-600">{totalVotos}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Participantes:</span>
            <p className="text-lg font-semibold text-gray-900">{votacion.participantes || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados en Tiempo Real</h3>
        {opciones.length === 0 || totalVotos === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📊</span>
            <p className="text-gray-600">Aún no hay votos registrados</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border">
                <BarChart labels={labels} values={values} title="Votos por opción" />
              </div>
              <div className="p-4 rounded-lg border">
                <PieChart labels={labels} values={values} title="Distribución de votos" />
              </div>
            </div>
            <div className="space-y-4">
            {resultados.map((r, index) => {
              const porcentaje = totalVotos > 0 ? Math.round((r.votos / totalVotos) * 100) : 0
              const esGanador = r.votos === maxVotos && maxVotos > 0
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${esGanador ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {esGanador ? <span className="text-2xl">🏆</span> : null}
                      <h4 className="font-semibold text-gray-900">{r.opcion}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-teal-600">{r.votos}</span>
                      <span className="text-sm text-gray-600 ml-1">({porcentaje}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full ${esGanador ? 'bg-teal-500' : 'bg-cyan-500'}`} style={{ width: `${porcentaje}%` }} />
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


