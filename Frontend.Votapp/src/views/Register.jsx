export default function Register({ onSubmit, onShowLogin }) {
  function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get('password')
    const confirm = form.get('confirm')
    if (password !== confirm) {
      alert('Las contraseñas no coinciden')
      return
    }
    onSubmit({ nombre: form.get('name'), email: form.get('email'), password })
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2"><span className="text-teal-400">Vote</span>app</h1>
          <p className="text-gray-300">Crea tu cuenta</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <input name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Juan Pérez" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input name="password" type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
              <input name="confirm" type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700">Crear Cuenta</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">¿Ya tienes cuenta? <button onClick={onShowLogin} className="text-teal-600 hover:text-teal-700 font-medium">Inicia sesión aquí</button></p>
        </div>
      </div>
    </div>
  )
}


