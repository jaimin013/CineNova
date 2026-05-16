import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import BrandLogo from '../components/BrandLogo'

const basePosters = [
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QlsUUHXjNpeEYZnWlcPwwT1.jpg',
    title: 'Interstellar',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    title: 'Inception',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    title: 'The Dark Knight',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    title: 'Oppenheimer',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    title: 'Breaking Bad',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    title: 'Game of Thrones',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    title: 'Avengers Endgame',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    title: 'Dune',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/49WJfeN0moxb9IPfGn8mhR1W1H.jpg',
    title: 'Stranger Things',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/dznsXbEqXl1J03R6j4Y1iS0xO6B.jpg',
    title: 'The Boys',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/iZf0KyrE25z1sgefDGWQGvO7rLp.jpg',
    title: '1917',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    title: 'Attack on Titan',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    title: 'Spider-Man',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    title: 'The Batman',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/dDlEmu3EZ0PggZTo2BQAxGvN0fV.jpg',
    title: 'Squid Game',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    title: 'The Matrix',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/7C921eWKjHptmO23ppA5A0xP80S.jpg',
    title: 'Rush',
  },
  {
    src: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/fC2HDm5t0kHlAMO61urvY8Glafr.jpg',
    title: 'Better Call Saul',
  },
]

const posters = Array.from({ length: 40 }).map((_, i) => ({
  ...basePosters[i % basePosters.length],
  id: i,
  aspect: 'aspect-[2/3]',
}))

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="inline-block">
            <div className="h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-body selection:bg-amber-600/30 overflow-x-hidden">
      {/* Background Glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(217, 119, 6, 0.15) 0%, rgba(9, 9, 11, 1) 70%)',
          filter: `blur(${Math.min(scrollY / 10, 20)}px)`,
        }}
      />

      {/* Header */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-zinc-950/80 backdrop-blur-2xl py-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' : 'bg-transparent py-4 sm:py-6'}`}
      >
        <div className="flex justify-between items-start px-6 sm:px-12 w-full max-w-[2400px] mx-auto">
          <BrandLogo
            className="relative -top-3 sm:-top-4"
            imgClassName="h-14 sm:h-20 md:h-24 w-auto"
          />
          <div className="flex items-start gap-2 sm:gap-4 -mt-1 sm:-mt-1">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors text-[11px] sm:text-sm shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg font-bold text-white bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors text-[11px] sm:text-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Fixed Hero Logo in Background */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mt-[-10vh]">
        <div
          className="flex flex-col items-center gap-6 transition-all duration-100 ease-out"
          style={{
            opacity: Math.max(1 - scrollY / 600, 0),
            filter: `blur(${Math.min(scrollY / 30, 15)}px)`,
          }}
        >
          <div className="flex items-center transition-transform duration-700 cursor-default">
            <BrandLogo imgClassName="h-[70px] sm:h-[110px] md:h-[160px] w-auto drop-shadow-[0_0_40px_rgba(217,119,6,0.2)]" />
          </div>
          <p className="text-zinc-400 font-label tracking-[0.3em] uppercase text-xs md:text-sm opacity-80">
            The Digital Auteur Experience
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 w-full pt-[65vh]">
        {/* Masonry Grid */}
        <section className="relative w-full px-4 md:px-8 max-w-[2400px] mx-auto pb-32">
          {/* Overlay gradient to smoothly transition from transparent to solid dark behind the grid */}
          <div className="absolute inset-0 top-[-20vh] bg-gradient-to-b from-transparent via-zinc-950 to-zinc-950 -z-10 pointer-events-none"></div>

          <div className="w-full">
            {/* Custom Flex Masonry to control staggered top offsets perfectly */}
            {(() => {
              const renderMasonry = (numCols: number) => {
                const cols = Array.from({ length: numCols }, () => [] as typeof posters)
                posters.forEach((p, i) => cols[i % numCols].push(p))

                // Staggering offsets to create the "uneven" top effect
                const getMargin = (colIndex: number) => {
                  const offsets = ['mt-16', 'mt-0', 'mt-24', 'mt-8', 'mt-20', 'mt-4']
                  return offsets[colIndex % offsets.length]
                }

                return (
                  <div className="flex gap-4 sm:gap-6 w-full items-start">
                    {cols.map((col, i) => (
                      <div
                        key={i}
                        className={`flex-1 flex flex-col gap-4 sm:gap-6 ${getMargin(i)}`}
                      >
                        {col.map((poster) => (
                          <div
                            key={poster.id}
                            className={`group relative overflow-hidden rounded-xl bg-zinc-900 border border-white/5 cursor-pointer shadow-2xl hover:shadow-[0_0_30px_rgba(217,119,6,0.2)] hover:border-amber-600/30 transition-all duration-500 ${poster.aspect} w-full`}
                          >
                            <div className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out bg-zinc-800">
                              <img
                                className="w-full h-full object-cover"
                                alt={poster.title}
                                src={poster.src}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              }

              return (
                <>
                  <div className="block sm:hidden">{renderMasonry(2)}</div>
                  <div className="hidden sm:block md:hidden">{renderMasonry(3)}</div>
                  <div className="hidden md:block lg:hidden">{renderMasonry(4)}</div>
                  <div className="hidden lg:block xl:hidden">{renderMasonry(5)}</div>
                  <div className="hidden xl:block">{renderMasonry(6)}</div>
                </>
              )
            })()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
