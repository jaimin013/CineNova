import React from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger'
}) => {
  const [loading, setLoading] = React.useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const variantStyles = {
    danger: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-500',
      iconBg: 'bg-red-600/20',
      iconColor: 'text-red-500',
      shadow: 'shadow-red-600/20'
    },
    warning: {
      bg: 'bg-amber-600',
      hover: 'hover:bg-amber-500',
      iconBg: 'bg-amber-600/20',
      iconColor: 'text-amber-500',
      shadow: 'shadow-amber-600/20'
    },
    info: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-500',
      iconBg: 'bg-blue-600/20',
      iconColor: 'text-blue-500',
      shadow: 'shadow-blue-600/20'
    }
  }[variant]

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${variantStyles.iconBg} flex items-center justify-center mb-2`}>
              <AlertTriangle className={`${variantStyles.iconColor} w-8 h-8`} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{message}</p>
            </div>

            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-3 rounded-xl ${variantStyles.bg} ${variantStyles.hover} text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${variantStyles.shadow}`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
