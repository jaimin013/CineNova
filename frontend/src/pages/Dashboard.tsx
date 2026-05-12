import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DynamicFeaturedHero from '../components/DynamicFeaturedHero'
import DynamicContentGrid from '../components/DynamicContentGrid'
import AuthenticatedNavbar from '../components/AuthenticatedNavbar'
import AuthenticatedSidebar from '../components/AuthenticatedSidebar'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [sections, setSections] = useState<{id: number, name: string, order: number}[]>([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sections`)
        const data = await response.json()
        if (data.success) {
          setSections(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch sections', err)
      }
    }
    fetchSections()
  }, [])

  return (
    <>
      <AuthenticatedNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <AuthenticatedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pt-24 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          {/* Featured Hero Section */}
          <DynamicFeaturedHero />

          {/* Dynamic Content Sections */}
          <div className="space-y-20 py-12 px-6 sm:px-10 lg:px-16">
            {sections.map((section) => (
              <DynamicContentGrid
                key={section.id}
                sectionName={section.name}
                title={section.name}
                subtitle={`Curated selection of ${section.name.toLowerCase()}`}
                layout="grid-4"
              />
            ))}
            
            {sections.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No sections defined yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="relative w-full py-16 px-12 mt-auto bg-zinc-950 flex flex-col items-center justify-center border-t border-zinc-900/50">
            <div className="text-lg font-black text-amber-600 mb-4 font-headline uppercase tracking-tighter">
              CineNova
            </div>
            <div className="flex gap-8 mb-8 font-label text-xs tracking-wide uppercase text-zinc-600">
              <a
                className="hover:text-amber-600 transition-opacity opacity-80 hover:opacity-100"
                href="#"
              >
                Legal
              </a>
              <a
                className="hover:text-amber-600 transition-opacity opacity-80 hover:opacity-100"
                href="#"
              >
                Privacy
              </a>
              <a
                className="hover:text-amber-600 transition-opacity opacity-80 hover:opacity-100"
                href="#"
              >
                Press
              </a>
              <a
                className="hover:text-amber-600 transition-opacity opacity-80 hover:opacity-100"
                href="#"
              >
                Careers
              </a>
            </div>
            <div className="text-zinc-600 font-label text-xs tracking-wide uppercase">
              © 2024 CineNova. Cinematic Immersion.
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
