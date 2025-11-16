import { useState } from 'react'

export default function JoinVote({ onBack, onFind, onJoin }) {
  const [codigo, setCodigo] = useState('')
  const [found, setFound] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const v = onFind(codigo.toUpperCase())
    setFound(v || null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Unirse a Votación</h1>
        <button onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Volver al Dashboard</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ingresa el Código de Acceso</h2>
          <p className="text-gray-600">Solicita el código de 6 caracteres al administrador</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Código de Acceso</label>
              <input value={codigo} onChange={e => setCodigo(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0,6))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-2xl font-mono tracking-widest" placeholder="X9Q7B2" maxLength={6} required />
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">🔍 Buscar Votación</button>
          </div>
        </form>
        {found && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Votación Encontrada</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Título:</span>
                <p className="text-gray-900">{found.titulo}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Descripción:</span>
                <p className="text-gray-600">{found.descripcion}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Inicio:</span>
                  <p className="text-gray-600">{new Date(found.fechaInicio).toLocaleString('es-ES')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cierre:</span>
                  <p className="text-gray-600">{new Date(found.fechaCierre).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={() => onJoin(found)} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">✅ Unirse a esta Votación</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


