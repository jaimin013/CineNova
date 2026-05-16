import { useState, useEffect } from 'react'
import { CommunityConversation } from '../components/CommunityConversation'
import { Loader, Users, MessageSquare, Tag } from 'lucide-react'
import Footer from '../components/Footer'

interface Community {
  id: number
  name: string
  description: string
  imageUrl?: string
  _count: {
    messages: number
  }
}

export default function CommunitiesClubs() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/communities`)
      const data = await response.json()
      if (data.success) {
        setCommunities(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch communities:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/*  Main Content Area  */}
      <main className="px-6 sm:px-10 lg:px-16 pt-24 pb-12 min-h-screen bg-[#070707]">
        <div className="max-w-[1600px] mx-auto text-white">
          {/*  Header & Introduction  */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[1px] bg-amber-600"></div>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-600">
                  Global Networks
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-headline font-black tracking-tighter mb-6">
                Digital <span className="text-amber-500 italic">Clubs.</span>
              </h1>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                The intersection of cinema and conversation. Join curated spaces designed for
                meaningful dialogue between film scholars and casual viewers alike.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Active Members
                </span>
                <span className="text-2xl font-black">2,482+</span>
              </div>
              <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Total Conversations
                </span>
                <span className="text-2xl font-black">
                  {communities.reduce((acc, c) => acc + (c._count?.messages || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/*  Dynamic Tags / Genres Section  */}
          <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <Tag className="text-amber-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest">Library Categories</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveLetter(null)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${!activeLetter ? 'bg-amber-600 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                >
                  ALL
                </button>
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setActiveLetter(letter)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${activeLetter === letter ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/*  Featured Clubs  */}
          <div className="flex items-center gap-3 mb-12">
            <Users className="text-amber-500" size={20} />
            <h2 className="text-sm font-black uppercase tracking-widest">Featured Communities</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader className="animate-spin text-amber-600" size={48} />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">
                Syncing Global Communities...
              </p>
            </div>
          ) : communities.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                <Users className="text-white/10" size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">
                No Clubs Found
              </h3>
              <p className="text-white/20 font-bold uppercase tracking-widest text-xs">
                Admins are curating new spaces. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communities.map((community, index) => (
                <div
                  key={community.id}
                  className={`flex flex-col group bg-zinc-900/40 backdrop-blur-md overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-amber-600/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-600/10 ${index % 2 !== 0 ? 'lg:mt-12' : ''}`}
                >
                  <div className="h-64 relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={community.name}
                      src={
                        community.imageUrl ||
                        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80'
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-8 flex gap-2">
                      <div className="px-4 py-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-3">
                        <MessageSquare size={14} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                          {community._count?.messages || 0} Discussions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col flex-1">
                    <h3 className="text-4xl font-headline font-black mb-4 group-hover:text-amber-500 transition-colors uppercase tracking-tight leading-none">
                      {community.name}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-3 mb-10 font-medium leading-relaxed">
                      {community.description}
                    </p>
                    <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-[#070707] bg-zinc-800 overflow-hidden"
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${community.id + i}`}
                              alt="User"
                            />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-[#070707] bg-amber-600 flex items-center justify-center text-[8px] font-black">
                          +12
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCommunity(community)}
                        className="bg-white text-black hover:bg-amber-500 hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                      >
                        Join Conversation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedCommunity && (
        <CommunityConversation
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
      <Footer />
    </>
  )
}
