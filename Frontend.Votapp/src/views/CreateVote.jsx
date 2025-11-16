import { useState } from 'react'

export default function CreateVote({ onBack, onCreate }) {
  const [options, setOptions] = useState(['Opción 1', 'Opción 2'])

  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const titulo = form.get('titulo')
    const descripcion = form.get('descripcion')
    const fechaInicio = form.get('inicio')
    const fechaCierre = form.get('cierre')
    const clean = options.map(o => o.trim()).filter(Boolean)
    if (clean.length < 2) return alert('Debe tener al menos 2 opciones')
    onCreate({ titulo, descripcion, fechaInicio, fechaCierre, opciones: clean })
  }

  function addOption() {
    setOptions(prev => [...prev, `Opción ${prev.length + 1}`])
  }

  function updateOption(index, value) {
    setOptions(prev => prev.map((o, i) => (i === index ? value : o)))
  }

  function removeOption(index) {
    setOptions(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Votación</h1>
        <button onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">← Volver al Dashboard</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2"><h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input name="titulo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea name="descripcion" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2"><h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Votación</h3></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inicio *</label>
              <input name="inicio" type="datetime-local" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cierre *</label>
              <input name="cierre" type="datetime-local" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Opciones de Votación <span className="text-sm font-normal text-gray-500 ml-2">(Mínimo 2)</span></h3>
              <button type="button" onClick={addOption} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">➕ Agregar Opción</button>
            </div>
            <div className="space-y-3">
              {options.map((opcion, index) => (
                <div className="flex items-center space-x-3" key={index}>
                  <input value={opcion} onChange={e => updateOption(index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 p-2">🗑️</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button type="button" onClick={onBack} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">🚀 Crear Votación</button>
          </div>
        </form>
      </div>
    </div>
  )
}


