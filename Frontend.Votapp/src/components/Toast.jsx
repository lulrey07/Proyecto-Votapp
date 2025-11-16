import { useEffect } from 'react'

export default function Toast({ toasts, onRemove }) {
  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => onRemove(t.id), t.duration ?? 3000))
    return () => timers.forEach(clearTimeout)
  }, [toasts, onRemove])

  if (!toasts.length) return null
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] text-white ${
            t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : t.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
        >
          <span className="text-xl font-bold">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <p className="flex-1">{t.message}</p>
          <button onClick={() => onRemove(t.id)} className="text-white hover:text-gray-200">×</button>
        </div>
      ))}
    </div>
  )
}


