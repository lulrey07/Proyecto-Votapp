import { useCallback, useEffect, useMemo, useState } from 'react'
import Login from './views/Login'
import Register from './views/Register'
import Sidebar from './components/Sidebar'
import Dashboard from './views/Dashboard'
import CreateVote from './views/CreateVote'
import EditVote from './views/EditVote'
import JoinVote from './views/JoinVote'
import Vote from './views/Vote'
import Results from './views/Results'
import ConsultarVote from './views/ConsultarVote'
import Toast from './components/Toast'
import SuccessModal from './components/SuccessModal'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('votapp_user')
    return saved ? JSON.parse(saved) : null
  })
  const [view, setView] = useState('dashboard')
  const [votaciones, setVotaciones] = useState(() => [])
  const [currentId, setCurrentId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [success, setSuccess] = useState({ open: false, title: '', code: '', message: '' })
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const removeToast = useCallback(id => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const isLoggedIn = !!currentUser

  // load/save votaciones
  useEffect(() => {
    const saved = localStorage.getItem('votapp_votes')
    if (saved) {
      try { setVotaciones(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('votapp_votes', JSON.stringify(votaciones))
  }, [votaciones])

  const navigate = useCallback((name, id = null) => {
    setView(name)
    setCurrentId(id)
    setSelectedIndex(null)
  }, [])

  const findById = useCallback(id => votaciones.find(v => v.id === id), [votaciones])

  function handleLogin({ email }) {
    const user = { id: 'user-' + Date.now(), email, nombre: email.split('@')[0] }
    setCurrentUser(user)
    localStorage.setItem('votapp_user', JSON.stringify(user))
    setView('dashboard')
    addToast('Inicio de sesión exitoso', 'success')
  }

  function handleDemo() {
    const user = { id: 'demo-user-123', email: 'demo@votapp.com', nombre: 'Usuario Demo' }
    setCurrentUser(user)
    localStorage.setItem('votapp_user', JSON.stringify(user))
    setView('dashboard')
    addToast('Sesión demo iniciada', 'success')
  }

  function handleRegister({ nombre, email }) {
    const user = { id: 'user-' + Date.now(), email, nombre }
    setCurrentUser(user)
    localStorage.setItem('votapp_user', JSON.stringify(user))
    setView('dashboard')
    addToast('Registro exitoso', 'success')
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem('votapp_user')
    setView('login')
    addToast('Sesión cerrada', 'info')
  }

  const isVotacionActiva = useCallback(v => {
    const now = new Date()
    return v.estado === 'Activa' && now >= new Date(v.fechaInicio) && now <= new Date(v.fechaCierre)
  }, [])

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
    return code
  }

  function createVotacion({ titulo, descripcion, fechaInicio, fechaCierre, opciones }) {
    const codigo = generateCode()
    const nueva = {
      id: 'votacion-' + Date.now(),
      titulo,
      descripcion,
      fechaInicio,
      fechaCierre,
      estado: 'Activa',
      codigoAcceso: codigo,
      creadorId: currentUser.id,
      opciones,
      participantes: 1,
      votos: [],
    }
    setVotaciones(vs => [nueva, ...vs])
    setSuccess({ open: true, title: '¡Votación Creada Exitosamente!', code: codigo, message: 'Comparte este código con los participantes.' })
    setView('dashboard')
  }

  function updateVotacion(id, updates) {
    setVotaciones(vs => vs.map(v => (v.id === id ? { ...v, ...updates } : v)))
    addToast('Votación actualizada', 'success')
    setView('dashboard')
  }

  function findByCode(code) { return votaciones.find(v => v.codigoAcceso === code.toUpperCase()) }

  function joinVotacion(v) {
    addToast('Te has unido exitosamente a la votación', 'success')
    setView('votacion')
    setCurrentId(v.id)
  }

  function emitVote() {
    if (selectedIndex == null) return
    setVotaciones(vs => vs.map(v => {
      if (v.id !== currentId) return v
      const votos = [...v.votos, { userId: currentUser.id, opcion: selectedIndex, timestamp: new Date().toISOString() }]
      return { ...v, votos }
    }))
    addToast('¡Voto registrado exitosamente!', 'success')
  }

  function closeVoting(id) {
    setVotaciones(vs => vs.map(v => (v.id === id ? { ...v, estado: 'Finalizada' } : v)))
    addToast('Votación cerrada exitosamente', 'success')
  }

  function deleteVotacion(id) {
    setVotaciones(vs => vs.filter(v => v.id !== id))
    addToast('Votación eliminada exitosamente', 'success')
    navigate('dashboard')
  }

  const current = useMemo(() => (currentId ? findById(currentId) : null), [currentId, findById])

  if (!isLoggedIn) {
    return view === 'register' ? (
      <Register onSubmit={handleRegister} onShowLogin={() => setView('login')} />
    ) : (
      <Login onSubmit={handleLogin} onDemo={handleDemo} onShowRegister={() => setView('register')} />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast toasts={toasts} onRemove={removeToast} />
      <SuccessModal
        open={success.open}
        title={success.title}
        code={success.code}
        message={success.message}
        onClose={() => setSuccess(s => ({ ...s, open: false }))}
        onCopy={() => navigator.clipboard.writeText(success.code).then(() => addToast('Código copiado', 'success'))}
      />
      <div className="lg:pl-64">
        <Sidebar current={view} onNavigate={(name, id) => { setSidebarOpen(false); navigate(name, id) }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button className="px-4 text-gray-500 focus:outline-none lg:hidden" onClick={() => setSidebarOpen(true)}><span className="text-2xl">☰</span></button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center"><h2 className="text-xl font-semibold text-gray-900">Bienvenido al sistema de votaciones</h2></div>
            <div className="ml-4 flex items-center space-x-4">
              <div className="text-sm text-gray-600">{currentUser.email}</div>
              <button onClick={logout} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">Cerrar Sesión</button>
            </div>
          </div>
        </div>
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {view === 'dashboard' && (
            <Dashboard votaciones={votaciones} onNavigate={navigate} />
          )}
          {view === 'crear' && (
            <CreateVote onBack={() => navigate('dashboard')} onCreate={createVotacion} />
          )}
          {view === 'editar' && (
            <EditVote
              votacion={current}
              onBack={() => navigate('dashboard')}
              onSave={(data) => updateVotacion(current.id, data)}
            />
          )}
          {view === 'unirse' && (
            <JoinVote onBack={() => navigate('dashboard')} onFind={findByCode} onJoin={joinVotacion} />
          )}
          {view === 'votacion' && current && (
            <Vote
              votacion={current}
              isAdmin={current.creadorId === currentUser.id}
              hasVoted={(current.votos || []).some(v => v.userId === currentUser.id)}
              isActive={isVotacionActiva(current)}
              onBack={navigate}
              onSelect={setSelectedIndex}
              selectedIndex={selectedIndex}
              onEmitVote={emitVote}
            />
          )}
          {view === 'resultados' && current && (
            <Results votacion={current} onBack={navigate} onCloseVoting={closeVoting} />
          )}
          {view === 'consultar' && current && (
            <ConsultarVote
              votacion={current}
              onBack={() => navigate('dashboard')}
              onNavigate={navigate}
              onDelete={deleteVotacion}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
