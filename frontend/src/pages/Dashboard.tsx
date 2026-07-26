import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DynamicFeaturedHero from '../components/DynamicFeaturedHero'
import DynamicContentGrid from '../components/DynamicContentGrid'
import { useEffect, useState, useMemo } from 'react'
import Footer from '../components/Footer'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [sections, setSections] = useState<{ id: number; name: string; order: number }[]>([])

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const platformFilter = queryParams.get('platform')
  const genreFilter = queryParams.get('genre')

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

  // Filter sections based on platform or genre if provided
  const filteredSections = useMemo(() => {
    if (!platformFilter && !genreFilter) return sections

    // If filtering by genre, we just show one large grid for that genre instead of sections
    if (genreFilter) return []

    const platformLower = platformFilter!.toLowerCase()
    const relevant = sections.filter((s) => s.name.toLowerCase().includes(platformLower))

    return relevant.length > 0 ? relevant : sections
  }, [sections, platformFilter, genreFilter])

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Featured Hero Section - Full Width */}
        {(!platformFilter && !genreFilter) && <DynamicFeaturedHero />}

        <div className="max-w-[1600px] mx-auto">
          {(platformFilter || genreFilter) && (
            <div className="px-6 sm:px-10 lg:px-16 pt-12">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">
                  {platformFilter ? 'Platform Spotlight' : 'Category Discovery'}
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded"
                >
                  Clear Filter
                </button>
              </div>
              <h1 className="text-5xl font-extrabold font-headline capitalize">
                {platformFilter || genreFilter}
              </h1>
            </div>
          )}

          {/* Dynamic Content Sections */}
          <div className="space-y-20 py-12 px-6 sm:px-10 lg:px-16">
            {genreFilter ? (
              <DynamicContentGrid
                genreName={genreFilter}
                title={`All ${genreFilter} Titles`}
                subtitle={`Browsing our complete collection of ${genreFilter.toLowerCase()} content`}
                layout="grid-4"
              />
            ) : (
              filteredSections.map((section) => (
                <DynamicContentGrid
                  key={section.id}
                  sectionName={section.name}
                  title={section.name}
                  subtitle={`Curated selection of ${section.name.toLowerCase()}`}
                  layout="grid-4"
                  limit={platformFilter ? undefined : 40}
                />
              ))
            )}

            {!genreFilter && filteredSections.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
                  No content found for this selection
                </p>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </main>
    </div>
  )
}
