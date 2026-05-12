import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="inline-block">
            <div className="h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-on-surface font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      {/*  TopAppBar  */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-2xl bg-gradient-to-b from-zinc-950/80 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center px-12 py-8 w-full">
          <div className="text-3xl font-black tracking-tighter text-white uppercase font-headline">
            CINENOVA
          </div>
          <div className="hidden md:flex items-center gap-12 font-body antialiased tracking-tight">
            {/* Nav links removed as per requirement for unauthenticated root page */}
          </div>
          <div className="flex items-center gap-6">
            <button className="material-symbols-outlined text-zinc-500 hover:text-amber-600 transition-colors">
              notifications
            </button>
            <button className="material-symbols-outlined text-zinc-500 hover:text-amber-600 transition-colors">
              account_circle
            </button>
          </div>
        </div>
      </nav>
      <main>
        {/*  Hero Section  */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/*  Background Image with Overlay  */}
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover scale-105 opacity-60"
              alt="Cinematic abstract dark film production background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvyzMj1tkEL1FE1gx8UkKQt6CXihG1pZYwGI8pVEb84kPyjHOvuNAqwx-2VSq1y5kLe5X-amdU5QFSgoA6bKXc_W0bq6ChLC5d_uLq1MaZfM8nIWL3Qtvb59f5gSZXn_4ES9sjLfosu4gzreMw-oPQzN-xVS4G5xoNv-OGjhdjlYMdFqvVCXATUH9M28DR3h-qXmzeKRqJZsQWaocm3IsJbe3eVBbaIJneXqBh5Ngh_hHzsbcNfbSQC5NZFOjpumk9ABXZTwRlIJWO"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface"></div>
          </div>
          {/*  Hero Content  */}
          <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center text-center">
            <h1 className="font-headline font-extrabold text-6xl md:text-8xl tracking-tighter mb-8 max-w-4xl text-glow">
              Your Next Cinematic <span className="text-amber-600 italic">Obsession</span> Starts
              Here.
            </h1>
            {/*  Central Search Bar  */}
            <div className="w-full max-w-2xl relative mt-4 group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-zinc-500 group-focus-within:text-amber-600 transition-colors">
                  search
                </span>
              </div>
              <input
                className="w-full py-6 pl-16 pr-8 bg-zinc-900/40 backdrop-blur-xl rounded-full border-none focus:ring-2 focus:ring-amber-600/40 text-lg font-body placeholder:text-zinc-500/50 transition-all"
                placeholder="Search films, directors, or genres..."
                type="text"
              />
            </div>
            <div className="mt-12 flex gap-6">
              <button
                onClick={() => navigate('/explore')}
                className="bg-gradient-to-r from-amber-600 to-amber-700 px-10 py-4 rounded-md font-bold text-white hover:scale-105 transition-transform active:scale-95 shadow-[0_0_30px_rgba(229,183,110,0.3)]"
              >
                GET STARTED
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-zinc-900 px-10 py-4 rounded-md font-bold text-white hover:bg-zinc-800 transition-colors active:scale-95"
              >
                LOGIN
              </button>
            </div>
          </div>
        </section>
        {/*  Category Filters  */}
        <section className="px-12 -mt-24 relative z-20">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8">
            <button className="whitespace-nowrap bg-amber-600 text-white px-8 py-3 rounded-full font-label text-xs tracking-[0.15em] font-bold">
              LATEST RELEASES
            </button>
            <button className="whitespace-nowrap bg-surface-container-highest text-on-surface-variant px-8 py-3 rounded-full font-label text-xs tracking-[0.15em] font-bold hover:text-white transition-colors">
              TOP RATED
            </button>
            <button className="whitespace-nowrap bg-surface-container-highest text-on-surface-variant px-8 py-3 rounded-full font-label text-xs tracking-[0.15em] font-bold hover:text-white transition-colors">
              COMING SOON
            </button>
            <button className="whitespace-nowrap bg-surface-container-highest text-on-surface-variant px-8 py-3 rounded-full font-label text-xs tracking-[0.15em] font-bold hover:text-white transition-colors">
              AWARD WINNERS
            </button>
            <button className="whitespace-nowrap bg-surface-container-highest text-on-surface-variant px-8 py-3 rounded-full font-label text-xs tracking-[0.15em] font-bold hover:text-white transition-colors">
              NOIR CLASSICS
            </button>
          </div>
        </section>
        {/*  Bento Grid Posters Section  */}
        <section className="px-12 py-24 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/*  Large Feature Poster  */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[4/5]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Moody cinematic sci-fi movie poster art"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiC4FTdAe5uaaEeWAtDTHX6wLrt-Z5RcUV14CIiKBxb64PDB1aAzCuV7xorxdMsFic4IcnQT39S8gpx9mnTt59Zvfj_YkQBef8GPrzPH9QJqLzc00iS_QGNxKqmqBjY7eple20iGu1tNReW2CXVmq9cA5Ur5bZvncFlYfelh0gBp8mfeUXgoPRKyw2MKYTJEW-4HOd3e4lQsDRRKHafm3hspSY-0JqOMI6xsTFhI2i0KaAyHGO5oecghTJKOHf2dEKYGTkCTrqXVgW"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-sm mb-4 inline-block">
                  MUST WATCH
                </span>
                <h3 className="font-headline text-4xl font-bold mb-2">NEON DREAMS</h3>
                <p className="text-on-surface-variant text-sm tracking-wide">
                  2024 • SCI-FI • 2h 45m
                </p>
              </div>
            </div>
            {/*  Secondary Poster 1  */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[3/4]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Vintage black and white film still"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7i3e8fg1yOm6ogyKTT5JTLR4K8FVR4enmDxc4j0n480uXURJM8ZNdnQ3ykF0SPe1l_0m7pTEos--ZEmHauRdM-0_NXczVkw_Bk7B9Low8OEES3i-WHsORG2XLzW_hR5nrhdCxbkifk-ESXk1BnFvP_2sRePfYF8MT8CLfiODNKVSHMxs_11Bky2khH4IyFql8zw3D-Ua4lLf1rXkKq5YFlHUkkBy0AGDbuI45_IhUjtZn6ixX34GC7a90DlSbhFga5oLN-z05aMlz"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline text-xl font-bold">THE LAST REEL</h3>
                <p className="text-on-surface-variant text-xs tracking-[0.1em] mt-1">DRAMA</p>
              </div>
            </div>
            {/*  Secondary Poster 2  */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[3/4]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Cinematic portrait with dramatic lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx7aHi_LHE9veNVKmm4zG22FNYWUIutAIFL4cJpC48OpWS5tvHV0qKTggAUIH22arNk6WD6W4ccRx-obkvN8OCb42qvqyaXNE-e3Gynm4TZYuRNhpizMnGqj9Iu6qvFjBLFfyrixxu-XrfKOeyF1AjyW4kfKGtwGbEeT7636s94dGAdfk4c-eKTktNzKAvq2Q65nlo9-HKgnZOppc20cWgqcf695vWf88j3ZzH0a2R9cp_r45OFtZw4v0gh9Yq2JQBrDHnjzTeeZU_"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline text-xl font-bold">SILENT ECHO</h3>
                <p className="text-on-surface-variant text-xs tracking-[0.1em] mt-1">THRILLER</p>
              </div>
            </div>
            {/*  Secondary Poster 3  */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[3/4]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Cinematic landscape during golden hour"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKU7wL-nXtU05UQCLKTMMebuwGnWU54MqnoIK4AfANj1TT9Sf-HPWHNrHwM1Iv81-iuqUAaIPwREXoJ3_hRyMaRMs0cPCQM1KXLO-GeACRaVnIZXiJtg8KL04-T6TMrmEfUwhsadGp94pFtxUSjg1L_zwxj5vLpiW7mm8e3Wy1zujlqH5vWl_hwwhmIlwb3TKb_xgMXaBdbvH4V_f_wP6iRVdp1qgLLryKSsBlFik59QORzQ7uEZIWjZVub6M-34cqPYkIbvjnp5WG"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline text-xl font-bold">VELVET VOID</h3>
                <p className="text-on-surface-variant text-xs tracking-[0.1em] mt-1">HORROR</p>
              </div>
            </div>
            {/*  Secondary Poster 4  */}
            <div className="group relative overflow-hidden rounded-xl bg-surface-container-low aspect-[3/4]">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="High-speed action movie scene blur"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKV-9dZL_r15xbiIEiVf95PqF1687TssNQQzo7s22CEaizYfikUt5E1JeZGtZzfu35aJVSi0aLWFPcdVr8PAwI-QNC4A_goLwALZcamUAdpjCFjFRs5iAuJz7nNPDJZhfZAmgH9QtQD45usgnY3usrB94PXOnGvFZLhBF6sRZVGIgtbslPEqqzZylDZdI7oykXla_O1L6_LDd0uq9YPCZJMAddVXFfJ8O6fawhF8BrPVefaeqQWAUmpwVmjuGr76kdSVNGqp3vgcDW"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-headline text-xl font-bold">FAST TRACK</h3>
                <p className="text-on-surface-variant text-xs tracking-[0.1em] mt-1">ACTION</p>
              </div>
            </div>
          </div>
        </section>
        {/*  Asymmetric Narrative Section  */}
        <section className="py-32 px-12 bg-surface-container-low">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1">
              <p className="font-label text-amber-600 tracking-[0.4em] text-xs mb-6">THE VISION</p>
              <h2 className="font-headline text-5xl font-extrabold mb-8 leading-tight">
                Curated by Creators,
                <br />
                For Visionaries.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-lg">
                CINENOVA isn't just a database. It's an algorithm with a soul, designed to navigate
                the vast sea of digital content to find the pieces that actually matter. Discover
                high-art, indie gems, and blockbuster epics through the lens of pure cinematography.
              </p>
              <div className="flex gap-12 border-t border-white/5 pt-10">
                <div>
                  <p className="font-headline text-4xl font-bold text-white mb-1">50K+</p>
                  <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                    Auteurs Joined
                  </p>
                </div>
                <div>
                  <p className="font-headline text-4xl font-bold text-white mb-1">12M</p>
                  <p className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
                    Critical Reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="aspect-square bg-surface-container-highest rounded-full blur-[100px] absolute -inset-4 opacity-30"></div>
              <img
                className="relative z-10 w-full rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-1000"
                alt="High-end professional cinema camera on set"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQDlhVTkGq_n6Odeo6vG37dHWdnW5uev6Y4z2YA0nZRrN-d_qGnokYAQLcvpbvqMlgqwHpsDsod5yxuz6xZK-ohlxs92na3SB19D40GjLhuFWWod86wifW2ckxXel6hbzbsVEbEKUsJzH6gvjGN9dwEp5Dt7F3sBW60KfaN_B4IolqotwqESU9xhYYTglUxHh4JpyWpjxyCnvNxJGvJMsxDPbmCr2xfUlJFfEmgigvG7ay6yJnhWH_CA2l8fpd2Pg7AXq0EuIQvsnQ"
              />
            </div>
          </div>
        </section>
      </main>
      {/*  Footer  */}
      <footer className="w-full py-16 mt-32 bg-zinc-950 border-t border-white/5">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex gap-12 mb-8">
            <a
              className="font-inter text-[9px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
              href="#"
            >
              Manifesto
            </a>
            <a
              className="font-inter text-[9px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
              href="#"
            >
              Privacy
            </a>
            <a
              className="font-inter text-[9px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
              href="#"
            >
              Terms
            </a>
          </div>
          <div className="font-inter text-[9px] tracking-widest uppercase opacity-40">
            © 2024 CINENOVA. THE DIGITAL AUTEUR EXPERIENCE.
          </div>
          <div className="mt-8 flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant opacity-30 text-xl">
              movie_filter
            </span>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30 text-xl">
              camera_outdoor
            </span>
            <span className="material-symbols-outlined text-on-surface-variant opacity-30 text-xl">
              theater_comedy
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
