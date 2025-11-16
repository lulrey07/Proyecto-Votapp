export default function Dashboard({ votaciones, onNavigate }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button onClick={() => onNavigate('unirse')} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">🔗 Unirse a Votación</button>
          <button onClick={() => onNavigate('crear')} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">➕ Nueva Votación</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mis Votaciones Creadas</h3>
        </div>
        <div>
          {votaciones.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-600 mb-4">No tienes votaciones creadas</p>
              <button onClick={() => onNavigate('crear')} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Crear Primera Votación</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Cierre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {votaciones.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{v.titulo}</div>
                        <div className="text-sm text-gray-500">{v.codigoAcceso}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          v.estado === 'Activa' ? 'bg-green-100 text-green-800' : v.estado === 'Pausada' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>{v.estado}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{v.participantes || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(v.fechaCierre).toLocaleString('es-ES')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => onNavigate('consultar', v.id)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm">⚙️ Consultar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


