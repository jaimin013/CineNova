import React, { useState } from 'react'
import { X, AlertCircle, Flag, Loader2 } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  title?: string
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Report Review"
}) => {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reason.trim().length < 3) {
      setError('Please provide a reason (minimum 3 characters)')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onConfirm(reason.trim())
      setReason('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-600/5 to-orange-600/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center">
              <Flag className="text-red-500 w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-white/60 mb-4 leading-relaxed">
            Help us understand why you are reporting this review. Our moderation team will investigate it.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
                Reason for Reporting
              </label>
              <textarea
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Spam, harassment, spoilers, etc..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none h-32"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || reason.trim().length < 3}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-white/10 disabled:text-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
