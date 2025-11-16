export default function ConsultarVote({ votacion, onBack, onNavigate, onDelete }) {
  if (!votacion) return null

  function handleDelete() {
    if (window.confirm(`¿Estás seguro de eliminar la votación "${votacion.titulo}"? Esta acción no se puede deshacer.`)) {
      onDelete(votacion.id)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Consultar Votación</h1>
        <button onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Volver al Dashboard</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{votacion.titulo}</h2>
          <p className="text-gray-600">{votacion.descripcion}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <span className="text-sm font-medium text-gray-600">Código:</span>
            <p className="font-mono text-lg text-teal-600 font-bold">{votacion.codigoAcceso}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Estado:</span>
            <p className={`font-medium ${votacion.estado === 'Activa' ? 'text-green-600' : votacion.estado === 'Pausada' ? 'text-yellow-600' : 'text-gray-600'}`}>
              {votacion.estado}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Participantes:</span>
            <p className="text-lg font-semibold text-gray-900">{votacion.participantes || 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-600">Fecha Inicio:</span>
            <p className="text-gray-900">{new Date(votacion.fechaInicio).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Fecha Cierre:</span>
            <p className="text-gray-900">{new Date(votacion.fechaCierre).toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('votacion', votacion.id)}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
          >
            <span className="text-3xl">👁️</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Ver Votación</p>
              <p className="text-sm text-gray-600">Ver detalles y opciones</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('resultados', votacion.id)}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all"
          >
            <span className="text-3xl">📊</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Ver Resultados</p>
              <p className="text-sm text-gray-600">Gráficos y estadísticas</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('editar', votacion.id)}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <span className="text-3xl">✏️</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Editar Votación</p>
              <p className="text-sm text-gray-600">Modificar información</p>
            </div>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center space-x-3 p-6 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all"
          >
            <span className="text-3xl">🗑️</span>
            <div className="text-left">
              <p className="font-semibold text-red-600">Eliminar Votación</p>
              <p className="text-sm text-gray-600">Eliminar permanentemente</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}








