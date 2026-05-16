import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Toast {
  id: string
  message: string
  actionLabel?: string
  actionPath?: string
}

interface ToastContextType {
  showToast: (message: string, actionLabel?: string, actionPath?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const navigate = useNavigate()

  const showToast = useCallback((message: string, actionLabel?: string, actionPath?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, actionLabel, actionPath }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-zinc-900 border border-amber-600/30 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-6 min-w-[320px]"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              {toast.actionLabel && toast.actionPath && (
                <button
                  onClick={() => {
                    navigate(toast.actionPath!)
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
