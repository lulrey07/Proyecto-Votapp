export default function Vote({ votacion, isAdmin, hasVoted, isActive, onBack, onSelect, selectedIndex, onEmitVote }) {
  if (!votacion) return null
  const opciones = votacion.opciones || []
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Votación</h1>
        <div className="flex space-x-3">
          {isAdmin && (
            <button onClick={() => onBack('resultados', votacion.id)} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">📊 Ver Resultados</button>
          )}
          <button onClick={() => onBack('dashboard')} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Volver</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{votacion.titulo}</h2>
          <p className="text-gray-600 mt-2">{votacion.descripcion}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-gray-700">Código:</span>
            <p className="font-mono text-lg text-teal-600">{votacion.codigoAcceso}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Estado:</span>
            <p className={`font-medium ${votacion.estado === 'Activa' ? 'text-green-600' : 'text-gray-600'}`}>{votacion.estado}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Tu rol:</span>
            <p className="font-medium text-gray-900">{isAdmin ? 'Administrador' : 'Votante'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Inicio:</span>
            <p className="text-gray-600">{new Date(votacion.fechaInicio).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Cierre:</span>
            <p className="text-gray-600">{new Date(votacion.fechaCierre).toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center p-4">
          <p className={`text-lg font-medium ${hasVoted ? 'text-gray-600' : isActive ? 'text-green-600' : 'text-gray-600'}`}>
            {hasVoted ? '✅ Ya has emitido tu voto en esta votación' : isActive ? '✅ Puedes votar ahora' : '🔒 Esta votación no está activa'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Votación</h3>
        <div className="space-y-3">
          {opciones.map((opcion, index) => {
            const selectable = isActive && !hasVoted
            const selected = selectedIndex === index
            return (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg transition-all ${selected ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'} ${!selectable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => selectable && onSelect(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                    {selected ? <span className="text-white text-sm">✓</span> : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{opcion}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {isActive && !hasVoted && (
          <div className="mt-6 flex justify-center">
            <button disabled={selectedIndex == null} onClick={onEmitVote} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">🗳️ Emitir Voto</button>
          </div>
        )}
      </div>
    </div>
  )
}


