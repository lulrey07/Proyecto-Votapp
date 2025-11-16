import { useEffect, useState } from 'react'

export default function EditVote({ votacion, onBack, onSave }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [inicio, setInicio] = useState('')
  const [cierre, setCierre] = useState('')
  const [estado, setEstado] = useState('Activa')
  const [opciones, setOpciones] = useState([])

  useEffect(() => {
    if (votacion) {
      setTitulo(votacion.titulo)
      setDescripcion(votacion.descripcion)
      setInicio(votacion.fechaInicio)
      setCierre(votacion.fechaCierre)
      setEstado(votacion.estado)
      setOpciones(votacion.opciones || [])
    }
  }, [votacion])

  function handleSubmit(e) {
    e.preventDefault()
    const clean = opciones.map(o => o.trim()).filter(Boolean)
    if (clean.length < 2) return alert('Debe tener al menos 2 opciones')
    onSave({ titulo, descripcion, fechaInicio: inicio, fechaCierre: cierre, estado, opciones: clean })
  }

  function addOption() { setOpciones(prev => [...prev, `Opción ${prev.length + 1}`]) }
  function updateOption(i, val) { setOpciones(prev => prev.map((o, idx) => (idx === i ? val : o))) }
  function removeOption(i) { setOpciones(prev => prev.filter((_, idx) => idx !== i)) }

  if (!votacion) return null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Votación</h1>
        <button onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Volver al Dashboard</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2"><h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
              <input value={votacion.codigoAcceso} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2"><h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Votación</h3></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inicio *</label>
              <input value={inicio} onChange={e => setInicio(e.target.value)} type="datetime-local" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cierre *</label>
              <input value={cierre} onChange={e => setCierre(e.target.value)} type="datetime-local" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Votación</h3>
            <select value={estado} onChange={e => setEstado(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="Activa">Activa</option>
              <option value="Pausada">Pausada</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Opciones de Votación</h3>
              <button type="button" onClick={addOption} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">➕ Agregar Opción</button>
            </div>
            <div className="space-y-3">
              {opciones.map((op, idx) => (
                <div className="flex items-center space-x-3" key={idx}>
                  <input value={op} onChange={e => updateOption(idx, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                  {opciones.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700 p-2">🗑️</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">💾 Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}


