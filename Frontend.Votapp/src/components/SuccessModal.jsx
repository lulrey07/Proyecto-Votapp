export default function SuccessModal({ open, title, code, message, onClose, onCopy }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="bg-white border-2 border-dashed border-teal-500 rounded-lg p-4">
              <span className="text-3xl font-mono font-bold text-teal-600">{code}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center space-x-3">
            <button onClick={onCopy} className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">📋 Copiar Código</button>
            <button onClick={onClose} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Continuar</button>
          </div>
        </div>
      </div>
    </div>
  )
}


