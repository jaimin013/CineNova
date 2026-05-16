import React, { useState, useEffect, useRef } from 'react'
import { Send, User, Clock, Loader, AlertCircle, X } from 'lucide-react'

interface Message {
  id: number
  text: string
  createdAt: string
  user: {
    id: number
    name: string
  }
}

interface CommunityConversationProps {
  community: {
    id: number
    name: string
    description: string
  }
  onClose: () => void
}

export const CommunityConversation: React.FC<CommunityConversationProps> = ({ community, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [community.id])

  useEffect(() => {
    if (!loading) scrollToBottom()
  }, [messages, loading])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/communities/${community.id}/messages`)
      const data = await response.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('Please login to post messages')
        return
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/communities/${community.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newMessage.trim() })
      })

      const data = await response.json()
      if (data.success) {
        setMessages([...messages, data.data])
        setNewMessage('')
        setError('')
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-4xl h-[80vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600">group</span>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{community.name}</h3>
              <p className="text-xs text-white/40 font-medium line-clamp-1">{community.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
              <Loader className="animate-spin" size={32} />
              <p className="text-xs font-black uppercase tracking-widest">Syncing with club...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">chat_bubble</span>
              </div>
              <p className="text-sm font-bold">No messages yet. Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                  <User size={18} className="text-white/40" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-amber-600">{msg.user.name}</span>
                    <span className="text-[10px] text-white/20 font-medium flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-white/[0.03] rounded-2xl rounded-tl-none p-4 border border-white/5 inline-block max-w-[80%]">
                    <p className="text-sm text-white/80 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer/Input */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              placeholder="Share your thoughts with the club..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-amber-600 transition-all placeholder-white/20"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-8 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all font-bold flex items-center gap-2"
            >
              {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
