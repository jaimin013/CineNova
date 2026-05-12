import { useNavigate } from 'react-router-dom'
import AuthenticatedNavbar from '../components/AuthenticatedNavbar'
import AuthenticatedSidebar from '../components/AuthenticatedSidebar'
import { useState } from 'react'

export default function ExploreCategories() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <AuthenticatedNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <AuthenticatedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/*  Main Content  */}
      <main className="pt-24 min-h-screen px-6 sm:px-10 lg:px-16 pb-20">
        <div className="max-w-[1600px] mx-auto">
          {/*  Header Section  */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-4 block">
                  Discovery Mode
                </span>
                <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter text-on-surface leading-none">
                  Explore
                </h1>
              </div>
              <div className="w-full md:w-96">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 to-orange-500/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-surface-container-high rounded-xl flex items-center px-4 py-4 ring-1 ring-white/5">
                    <span className="material-symbols-outlined text-zinc-400 mr-3">filter_list</span>
                    <input
                      className="bg-transparent border-none text-on-surface focus:ring-0 w-full placeholder:text-zinc-600 font-body text-sm"
                      placeholder="Search by category..."
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*  Bento Category Grid  */}
            <div className="space-y-24">
              {/*  Section A  */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-2">
                  <div className="sticky top-28">
                    <span className="text-8xl font-black font-headline text-amber-600/10 leading-none">
                      A
                    </span>
                    <div className="h-1 w-12 bg-amber-600 mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-9xl">rocket_launch</span>
                    </div>
                    <span className="material-symbols-outlined text-amber-600 text-3xl">bolt</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Action</h3>
                    <p className="text-xs text-on-surface-variant font-body">1,420 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer border border-transparent">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      auto_stories
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Adaptation</h3>
                    <p className="text-xs text-on-surface-variant font-body">856 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      comedy_mask
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Adult Comedy</h3>
                    <p className="text-xs text-on-surface-variant font-body">342 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">explore</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Adventure</h3>
                    <p className="text-xs text-on-surface-variant font-body">920 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      animation
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Animated</h3>
                    <p className="text-xs text-on-surface-variant font-body">1,105 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      view_carousel
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Anthology</h3>
                    <p className="text-xs text-on-surface-variant font-body">128 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer col-span-full md:col-span-1">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">brush</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Art House</h3>
                    <p className="text-xs text-on-surface-variant font-body">245 Movies</p>
                  </div>
                </div>
              </div>
              {/*  Section B  */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-2">
                  <div className="sticky top-28">
                    <span className="text-8xl font-black font-headline text-amber-600/10 leading-none">
                      B
                    </span>
                    <div className="h-1 w-12 bg-amber-600 mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/*  Horizontal Wide Card  */}
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer md:col-span-2">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      menu_book
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Based on Book</h3>
                    <p className="text-xs text-on-surface-variant font-body">2,104 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      sports_esports
                    </span>
                    <h3 className="text-xl font-bold font-headline mt-4">Based on Game</h3>
                    <p className="text-xs text-on-surface-variant font-body">84 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      history_edu
                    </span>
                    <h3 className="text-xl font-bold font-headline mt-4">Based on True Story</h3>
                    <p className="text-xs text-on-surface-variant font-body">632 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">person</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Biopic</h3>
                    <p className="text-xs text-on-surface-variant font-body">194 Movies</p>
                  </div>
                  {/*  Highlight Color Card  */}
                  <div className="category-card group bg-error-container/20 rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer border border-error/10">
                    <span className="material-symbols-outlined text-error text-3xl">bloodtype</span>
                    <h3 className="text-2xl font-bold font-headline mt-4 text-error-container">
                      Blood &amp; Gore
                    </h3>
                    <p className="text-xs text-error-dim font-body">210 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">skull</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Body Horror</h3>
                    <p className="text-xs text-on-surface-variant font-body">156 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      meeting_room
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Bottle Movies</h3>
                    <p className="text-xs text-on-surface-variant font-body">42 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      diversity_1
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Bromance</h3>
                    <p className="text-xs text-on-surface-variant font-body">112 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">group</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Buddy Movie</h3>
                    <p className="text-xs text-on-surface-variant font-body">340 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer md:col-span-2">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      business_center
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Business</h3>
                    <p className="text-xs text-on-surface-variant font-body">89 Movies</p>
                  </div>
                </div>
              </div>
              {/*  Section C  */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-2">
                  <div className="sticky top-28">
                    <span className="text-8xl font-black font-headline text-amber-600/10 leading-none">
                      C
                    </span>
                    <div className="h-1 w-12 bg-amber-600 mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/*  Glassmorphism Highlight  */}
                  <div className="category-card group glass-panel rounded-2xl p-8 flex flex-col justify-between h-64 cursor-pointer md:col-span-2 ring-1 ring-white/10">
                    <div>
                      <span className="material-symbols-outlined text-amber-600 text-4xl mb-4">
                        theater_comedy
                      </span>
                      <h3 className="text-4xl font-black font-headline tracking-tight uppercase">
                        Campy
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-on-surface-variant font-body">
                        Cinephile Favorite • 67 Movies
                      </p>
                      <span className="material-symbols-outlined text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-64 cursor-pointer">
                    <span className="material-symbols-outlined text-tertiary text-3xl">ac_unit</span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Christmas</h3>
                    <p className="text-xs text-on-surface-variant font-body">1,240 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      child_care
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Coming of Age</h3>
                    <p className="text-xs text-on-surface-variant font-body">445 Movies</p>
                  </div>
                  <div className="category-card group bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between h-48 cursor-pointer md:col-span-2">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">
                      confirmation_number
                    </span>
                    <h3 className="text-2xl font-bold font-headline mt-4">Concert Film</h3>
                    <p className="text-xs text-on-surface-variant font-body">56 Movies</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*  Footer Callout  */}
          <section className="mt-32">
            <div className="relative rounded-3xl overflow-hidden p-12 bg-surface-container-low border border-white/5">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <img
                  alt="Cinematic background"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADqqRqlBNzjIJl6CITn-bUcjY16ZkkFWqus0sWm1Z3lXpmKS-CG3IxQwcEh1hgXXsDJQgnsTNZmh8QOl5Pi6xlguAdRiHFwjQpPeVBRBGLmLqy1NhjY31kv7k470nJT_BUdu2KcRZKBlB6cHf2i3hOHZkZvbGI87STXNl8igtbLf9FJij5hHzf9kRuSMiHlF6D1hxvA3FvidYuPXEnoapYxfDsee_6DJOQs-HrpbK-p8O26IRX94ebzHVNfWqmso796al3W90dVozY"
                />
              </div>
              <div className="relative z-10 max-w-xl">
                <h2 className="text-4xl font-bold font-headline mb-6">
                  Didn't find what you were looking for?
                </h2>
                <p className="text-on-surface-variant mb-8 text-lg">
                  Our catalog is updated daily with thousands of titles across the most obscure genres
                  imaginable.
                </p>
                <div className="flex gap-4">
                  <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-bold tracking-tight hover:scale-105 active:scale-95 transition-all">
                    Request a Category
                  </button>
                  <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-bold tracking-tight hover:bg-surface-bright transition-all">
                    View All 250+ Tags
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/*  BottomNavBar (Mobile Only)  */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50">
        <button className="text-zinc-500">
          <span className="material-symbols-outlined">dashboard</span>
        </button>
        <button className="text-amber-600">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
        </button>
        <button className="text-zinc-500">
          <span className="material-symbols-outlined">movie</span>
        </button>
        <button className="text-zinc-500">
          <span className="material-symbols-outlined">group</span>
        </button>
      </nav>
    </>
  )
}
