export default function Sidebar({ current, onNavigate, open, onClose }) {
  const item = (view, label, icon) => (
    <button
      key={view}
      onClick={() => onNavigate(view)}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        current === view ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
      }`}
      data-view={view}
    >
      <span className="mr-3 text-xl">{icon}</span>
      {label}
    </button>
  )

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-slate-800">
          <h1 className="text-xl font-bold text-white"><span className="text-teal-400">Vote</span>app</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {item('dashboard', 'Dashboard', '📊')}
          {item('crear', 'Crear Votación', '➕')}
          {item('unirse', 'Unirse a Votación', '🔗')}
        </nav>
        <div className="lg:hidden p-4">
          <button onClick={onClose} className="w-full border border-slate-700 text-gray-300 rounded px-3 py-2">Cerrar</button>
        </div>
      </div>
    </div>
  )
}


