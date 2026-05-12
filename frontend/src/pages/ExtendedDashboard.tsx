import { useNavigate } from 'react-router-dom'

export default function ExtendedDashboard() {
  const navigate = useNavigate()

  return (
    <>
      {/*  TopAppBar from COMPONENTS_8  */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-body antialiased tracking-tight">
        <div className="flex justify-between items-center px-12 py-8 w-full">
          <div className="text-3xl font-black tracking-tighter text-white uppercase">CINENOVA</div>
          <div className="hidden md:flex flex-1 max-w-xl mx-12">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-amber-600 transition-colors">
                search
              </span>
              <input
                className="w-full bg-surface-container-highest border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-1 focus:ring-amber-600/30 transition-all placeholder:text-outline-variant"
                placeholder="Search the archives..."
                type="text"
              />
            </div>
          </div>
          <nav className="flex items-center gap-8">
            <div className="flex gap-6 items-center">
              <button
                onClick={() => navigate('/explore')}
                className="text-white font-bold hover:text-amber-600 transition-all duration-700 ease-out active:scale-95 transform transition-transform"
              >
                EXPLORE
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-zinc-500 font-medium hover:text-amber-600 transition-all duration-700 ease-out active:scale-95 transform transition-transform"
              >
                ORIGINALS
              </button>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button className="material-symbols-outlined text-zinc-500 hover:text-white transition-colors">
                notifications
              </button>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden p-0.5 ring-1 ring-white/10">
                <img
                  alt="User profile avatar male"
                  className="w-full h-full object-cover rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4B9-6-uJmGz9E-VK9dp9W187KBAgnB2Ez31MJyV2ke64tr4aFoCqOg2G8pIgVG3XIY_Hpt6l3YH_MQeK8b763cpHq5KprfZ7Vp-sQI0twKgN5BjRASRVKkRKW5ya4qeLJT2tT01GmNJl6odoBugIIDpkqiBoTtlE0U5NBKeialw6AB7hktJPIRr6eTuUeND6c3Ofz-i5kEyREplGhPxWqnTPogixwbjHRsxjnE6YxrGZGbvVi7XktM_Xl_tuY8sX8T9oDC2LTXe-o"
                />
              </div>
            </div>
          </nav>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </header>
      {/*  SideNavBar from COMPONENTS_8  */}
      <aside className="fixed left-0 top-0 h-full w-24 z-40 bg-zinc-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-32 shadow-2xl shadow-amber-600/5">
        <div className="flex flex-col gap-12 items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:translate-x-1"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 scale-110">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "\'FILL\' 1" }}
              >
                grid_view
              </span>
            </div>
            <span className="font-inter text-[10px] tracking-[0.2em] font-bold text-amber-600">
              DASHBOARD
            </span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:translate-x-1"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl text-zinc-600 group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined">bookmark</span>
            </div>
            <span className="font-inter text-[10px] tracking-[0.2em] font-bold text-zinc-600 group-hover:text-white transition-colors">
              WATCHLIST
            </span>
          </button>
          <button
            onClick={() => navigate('/communities')}
            className="group flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300 hover:translate-x-1"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl text-zinc-600 group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined">movie_filter</span>
            </div>
            <span className="font-inter text-[10px] tracking-[0.2em] font-bold text-zinc-600 group-hover:text-white transition-colors">
              COMMUNITY
            </span>
          </button>
        </div>
        <div className="mt-auto flex flex-col items-center gap-6">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          <button
            onClick={() => navigate('/')}
            className="material-symbols-outlined text-zinc-600 hover:text-amber-600 cursor-pointer transition-colors"
          >
            settings
          </button>
        </div>
      </aside>
      {/*  Main Content Area  */}
      <main className="pl-24 pt-28 min-h-screen bg-surface">
        <div className="flex flex-col lg:flex-row gap-8 px-12 py-8">
          {/*  Discovery Canvas  */}
          <div className="flex-1 space-y-16">
            {/*  Hero Section (Talk of the Town)  */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <span className="font-inter text-[11px] tracking-[0.3em] font-bold text-white uppercase opacity-60">
                    Featured Discovery
                  </span>
                  <h1 className="font-headline text-5xl font-extrabold tracking-tighter">
                    Talk of the Town
                  </h1>
                </div>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  <button className="px-6 py-2 rounded-md bg-amber-600 text-white text-xs font-bold tracking-widest uppercase">
                    All
                  </button>
                  <button className="px-6 py-2 rounded-md text-on-surface-variant hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                    Movies
                  </button>
                  <button className="px-6 py-2 rounded-md text-on-surface-variant hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                    Shows
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-xl bg-surface-container aspect-[4/5] shadow-2xl">
                  <img
                    alt="Epic cinematic movie poster with dramatic lighting"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Suwl3oLT7qvJotYsgs8UVsc0EGQB1T-QWJA2qk8enB2GTzMWcPFAjhs-qlUp4m4P3UPWNZrJNuzOuGAfbKi6Mwj-qvMjFuAonzOlHDfgUe1LOKRQCqLmTELk7SmrPRKpgWKWsQs3W7fQD2b3tvVcVS57Djlq-37bQVBbBc49nEAR9Ghvthql-kofCcyJ9Ly7IbwrwvcwHf9NazkUF4Pp1Lsi2vBHc4V6LobYPjT5MujRum854gIkkZPJJMTylfvsbQSTt9xBuBlh"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full space-y-4">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full uppercase tracking-tighter">
                        Must Watch
                      </span>
                      <span className="px-3 py-1 bg-surface-container-highest/60 backdrop-blur text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                        2h 45m
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-3xl font-black uppercase tracking-tighter leading-none">
                        THE VOID BEYOND
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-2 font-medium opacity-80">
                        Director: Elena Thorne • Sci-Fi Noir
                      </p>
                    </div>
                  </div>
                </div>
                {/*  Poster 2  */}
                <div className="group space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-surface-container aspect-[2/3] shadow-lg">
                    <img
                      alt="Classic cinema film reel"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvaJpz5XgDtaEIhUBWAGVjR_1yzW0t_wZeoMWHSU6Utxcfgn3jjQb9TISeWLHJFeqim98Rv1jLarlbnRa00MhfSE-MlaNoI9eLoE9YVznLRbTi8NXklm5Qw1RCFzjtq9hP5YYRj_IUlagPi_sgchW_6DgdIKSXmJy7XOmZWm64tD7K376hAerWXUCGxj9DGCQJUSL_AwnzAzW7CeWxZW9shWGo0nvNKhwZPuZfOlr6kk9Wt53AknPGKOKMcQbseB5A3GCNkyPuSziB"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-amber-600/10 transition-colors"></div>
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 rounded-full glass-panel bg-surface-variant/40 flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">bookmark</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold leading-tight group-hover:text-amber-600 transition-colors uppercase">
                        VELVET ECHOES
                      </h4>
                      <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60">
                        2024 • DRAMA
                      </p>
                    </div>
                    <span
                      className="material-symbols-outlined text-secondary-container"
                      title="Good"
                    >
                      sentiment_very_satisfied
                    </span>
                  </div>
                </div>
                {/*  Poster 3  */}
                <div className="group space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-surface-container aspect-[2/3] shadow-lg">
                    <img
                      alt="Foggy mysterious figure"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzOcrQ_t6CHKAm2cEdXqTWXQrV6VTbIf6US5P6LkqghnFVIDEm823fDnt-aQ-QhOW7e1ct7Ek62OUHVXuyJi8GcHpbj-SJ2z8-zvDGJItpsgM5PlP9nvh3BphCZQ0H6OkzK1So2485Dz9BF7gkLPrkuPdOSfkyh3_tdOr6-Bu7V9q7CdCUpz1eBjCRBTpUAwKLHAwzQCynLZbeaVU37aohKRjdRVD7VNNxOcevMlbfFnr5gzu_sL8dI8Wlb_sZ8k0j63AaOJB2O1y5"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="w-10 h-10 rounded-full glass-panel bg-surface-variant/40 flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">bookmark</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-1 flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-lg font-bold leading-tight group-hover:text-amber-600 transition-colors uppercase">
                        MIDNIGHT SHADOW
                      </h4>
                      <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60">
                        2023 • THRILLER
                      </p>
                    </div>
                    <span
                      className="material-symbols-outlined text-tertiary-dim"
                      title="Must Watch"
                    >
                      star
                    </span>
                  </div>
                </div>
              </div>
            </section>
            {/*  Platform Specific: Editor's Choice  */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-3xl font-bold tracking-tight">Editor's Choice</h2>
                <button className="text-xs font-bold tracking-widest uppercase text-amber-600">
                  Explore All
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4">
                {/*  Card 1  */}
                <div className="flex-shrink-0 w-48 group space-y-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO30-0XTj3i4S3YHTo3EsLJJVSyyJqvJ8ql4BQEtVZAht4v7mRWl1o3a0r9EBxPS4qBLPN6gUCjvf3alBircnubJqtOQ9umfKv9UzK6zDNpjfyfWkFDs5gzVXyMkTlrZCIzEuS8IWwL60w25Pv8La06DHB1z6i0XeblTVQkZbEu6y48ZPCRDAbtnc5YtHs2jh48A2yCAmOHDisRa_S5G0v7oFZi0KZdieE31s6Ai8KfWiUAOAAdF2NKODfhZT0EaEHnMQK9QGqfQxP"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="material-symbols-outlined text-white text-lg bg-black/40 p-1 rounded-full">
                        star
                      </span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase truncate">THE LAST AUTEUR</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-tertiary-dim text-xs">
                        star
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-bold">
                        MUST WATCH
                      </span>
                    </div>
                  </div>
                </div>
                {/*  Card 2  */}
                <div className="flex-shrink-0 w-48 group space-y-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc_9ttHPJio0Qa6PJDUE3jdorn9202rQdul5fNgWcnYEBqPhItnyiqrdk1qRryOpAJj5I0rRJC0g-IVoC5q6zLPpXP7o6n3GDKzqtYnaUbCtii6jU1XVUZaiuldqW2wmcm5ggeXoGQw60Cuv8ztoTLRDJWqyP-AyXsCJcAnSS-sNi2gAZsT6I5uUyodsMRcf5TbD7Bd-bcmKqtoXXVWjgxbuv_HBg3GK_QCN6FZgzYeDjJNkBfnk_o8TmJOVFcPJHamZGzir8g4VWr"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase truncate">VINTAGE REEL</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-secondary-container text-xs">
                        sentiment_very_satisfied
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-bold">GOOD</span>
                    </div>
                  </div>
                </div>
                {/*  More cards...  */}
                <div className="flex-shrink-0 w-48 group space-y-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnBXj3LXPrXq_tUOrn1iI5shZWT9F2_iAXgIvh4pio1DlrS36s3ze_8KM-DCrOrIqYqtolczUTpfc5CBvI7G7tGBsYYGcpj0pFuiFRWUz2jLZH-hD4TscR6m7vPakLAdvE8grcoU_hN8FH1aib7_toXGdDJ-OxBfFPxb3dAtNQoitjyCkCv9iN9l_UFfXEMCAU596n6ftRbhlg0UwSo7Cig9Z9SW8VP-ZOYS7JzcX4v3U088OP7yunk8hVBYRpOUOjv6DmWAQYLNqh"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase truncate">NEON DRIFT</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-outline text-xs">
                        sentiment_neutral
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-bold">
                        TIMEPASS
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-48 group space-y-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJTTTg89RWBK6jv1TAs6cJUBnnf3IdFETzCtHk69_mmkDjsxiXYJH3CA6YeXm5-ONEfIuOIF3awpYfoBdqb2A_G3JiQrwByZEJ3Tek9CBJCr4qdqo5aRzQwNNzWHV7MB7kRPq8e2S5CoG0pODsH9gkpUMFTJozluxJ3e3LEhzqXSSXCSWByyuQPJj4Cr6riv-JcVH6w3vW8X3CGagNlDoIYGjqlE2Yac7mMBaQx_bcDB0Q3KfrSoyxX658ZvrcqAM5mcZl6Sew4Z6d"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold uppercase truncate">STEEL CANVAS II</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-secondary-container text-xs">
                        sentiment_very_satisfied
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-bold">GOOD</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/*  Platform Specific: Now on Netflix  */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  alt="Netflix"
                  className="h-6"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ixijDVWpV3qCw2qVU0B5coTy-gmxNUDY7JfTyVm50sh9dl5PUlblcCaC-rJxL7kkXHvPb6nj2GI9deDZgNP3a_DDAjq3F7k2H5xCg4BsuX74zHSErWSJH3NmnDaux9GH4JkIBiw3YLvppsDH-satcpuk5pfB-IxaUDogLc8ayIvAGOTSKgIAfzQ0otmTumz6p3SeiBR9ITr_jgOx_7Qf3Z-q1f5hjElXXociKRENxixl88jTTGn8rkRhtsuD0qg2KJ_JL9axGYba"
                />
                <h2 className="font-headline text-3xl font-bold tracking-tight">Now on Netflix</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-4 px-4">
                {/*  Movie Card 1  */}
                <div className="flex-shrink-0 w-72 group relative rounded-xl overflow-hidden aspect-video shadow-lg">
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Suwl3oLT7qvJotYsgs8UVsc0EGQB1T-QWJA2qk8enB2GTzMWcPFAjhs-qlUp4m4P3UPWNZrJNuzOuGAfbKi6Mwj-qvMjFuAonzOlHDfgUe1LOKRQCqLmTELk7SmrPRKpgWKWsQs3W7fQD2b3tvVcVS57Djlq-37bQVBbBc49nEAR9Ghvthql-kofCcyJ9Ly7IbwrwvcwHf9NazkUF4Pp1Lsi2vBHc4V6LobYPjT5MujRum854gIkkZPJJMTylfvsbQSTt9xBuBlh"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                      Trending Today
                    </p>
                    <h5 className="text-lg font-bold">Arcane: Season 2</h5>
                  </div>
                </div>
                {/*  Movie Card 2  */}
                <div className="flex-shrink-0 w-72 group relative rounded-xl overflow-hidden aspect-video shadow-lg">
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnBXj3LXPrXq_tUOrn1iI5shZWT9F2_iAXgIvh4pio1DlrS36s3ze_8KM-DCrOrIqYqtolczUTpfc5CBvI7G7tGBsYYGcpj0pFuiFRWUz2jLZH-hD4TscR6m7vPakLAdvE8grcoU_hN8FH1aib7_toXGdDJ-OxBfFPxb3dAtNQoitjyCkCv9iN9l_UFfXEMCAU596n6ftRbhlg0UwSo7Cig9Z9SW8VP-ZOYS7JzcX4v3U088OP7yunk8hVBYRpOUOjv6DmWAQYLNqh"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                      New Release
                    </p>
                    <h5 className="text-lg font-bold">The Last Frontier</h5>
                  </div>
                </div>
              </div>
            </section>
            {/*  Trending Weekly (Already Present but integrated)  */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                  Trending This Week
                </h2>
                <button className="text-xs font-bold tracking-widest uppercase text-amber-600 border-b border-amber-600/20 pb-1">
                  See All Activity
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4">
                <div className="flex-shrink-0 w-64 p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-4 hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-amber-600">
                        trending_up
                      </span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                      Rising in Clubs
                    </span>
                  </div>
                  <h5 className="font-headline text-xl font-bold leading-tight">
                    Arcane: Season 2 Discussion
                  </h5>
                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    Join 1.2k others discussing the latest theories on the undercity's future.
                  </p>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-surface bg-zinc-800"></div>
                    <div className="w-6 h-6 rounded-full border border-surface bg-zinc-700"></div>
                    <div className="w-6 h-6 rounded-full border border-surface bg-zinc-600"></div>
                    <span className="ml-4 text-[10px] text-on-surface-variant self-center">
                      +42 active
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-64 p-6 rounded-xl bg-surface-container-low border border-white/5 space-y-4 hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-tertiary">movie</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                      New Trailer
                    </span>
                  </div>
                  <h5 className="font-headline text-xl font-bold leading-tight">
                    The Last Auteur: Official
                  </h5>
                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    First look at the highly anticipated finale of the trilogy.
                  </p>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 w-3/4"></div>
                  </div>
                </div>
              </div>
            </section>
            {/*  Platform Specific: Stream on JioHotstar  */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black italic">
                  HOTSTAR
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                  Stream on JioHotstar
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/*  Movie Card  */}
                <div className="group relative aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Suwl3oLT7qvJotYsgs8UVsc0EGQB1T-QWJA2qk8enB2GTzMWcPFAjhs-qlUp4m4P3UPWNZrJNuzOuGAfbKi6Mwj-qvMjFuAonzOlHDfgUe1LOKRQCqLmTELk7SmrPRKpgWKWsQs3W7fQD2b3tvVcVS57Djlq-37bQVBbBc49nEAR9Ghvthql-kofCcyJ9Ly7IbwrwvcwHf9NazkUF4Pp1Lsi2vBHc4V6LobYPjT5MujRum854gIkkZPJJMTylfvsbQSTt9xBuBlh"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                      <span className="material-symbols-outlined">play_arrow</span>
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold">
                    PREMIUM
                  </div>
                </div>
                <div className="group relative aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzOcrQ_t6CHKAm2cEdXqTWXQrV6VTbIf6US5P6LkqghnFVIDEm823fDnt-aQ-QhOW7e1ct7Ek62OUHVXuyJi8GcHpbj-SJ2z8-zvDGJItpsgM5PlP9nvh3BphCZQ0H6OkzK1So2485Dz9BF7gkLPrkuPdOSfkyh3_tdOr6-Bu7V9q7CdCUpz1eBjCRBTpUAwKLHAwzQCynLZbeaVU37aohKRjdRVD7VNNxOcevMlbfFnr5gzu_sL8dI8Wlb_sZ8k0j63AaOJB2O1y5"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold">
                    PREMIUM
                  </div>
                </div>
                <div className="group relative aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvaJpz5XgDtaEIhUBWAGVjR_1yzW0t_wZeoMWHSU6Utxcfgn3jjQb9TISeWLHJFeqim98Rv1jLarlbnRa00MhfSE-MlaNoI9eLoE9YVznLRbTi8NXklm5Qw1RCFzjtq9hP5YYRj_IUlagPi_sgchW_6DgdIKSXmJy7XOmZWm64tD7K376hAerWXUCGxj9DGCQJUSL_AwnzAzW7CeWxZW9shWGo0nvNKhwZPuZfOlr6kk9Wt53AknPGKOKMcQbseB5A3GCNkyPuSziB"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold">
                    PREMIUM
                  </div>
                </div>
                <div className="group relative aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnBXj3LXPrXq_tUOrn1iI5shZWT9F2_iAXgIvh4pio1DlrS36s3ze_8KM-DCrOrIqYqtolczUTpfc5CBvI7G7tGBsYYGcpj0pFuiFRWUz2jLZH-hD4TscR6m7vPakLAdvE8grcoU_hN8FH1aib7_toXGdDJ-OxBfFPxb3dAtNQoitjyCkCv9iN9l_UFfXEMCAU596n6ftRbhlg0UwSo7Cig9Z9SW8VP-ZOYS7JzcX4v3U088OP7yunk8hVBYRpOUOjv6DmWAQYLNqh"
                  />
                </div>
              </div>
            </section>
          </div>
          {/*  Right Sidebar: Ranked 'Most Interested' & Activity  */}
          <aside className="w-full lg:w-96 space-y-12">
            {/*  Most Interested Ranked List from IMAGE_2  */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-amber-600"
                    style={{ fontVariationSettings: "\'FILL\' 1" }}
                  >
                    local_fire_department
                  </span>
                  <h2 className="font-headline text-xl font-bold tracking-tight">
                    Most Interested
                  </h2>
                </div>
                <select className="bg-transparent border-none text-[10px] font-bold text-on-surface-variant uppercase tracking-widest focus:ring-0">
                  <option>This Week</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="space-y-4">
                {/*  Rank 1  */}
                <div className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-transparent hover:border-white/10 relative">
                  <div className="text-5xl font-black text-stroke-3 italic absolute -left-4 -top-2 opacity-50 select-none">
                    1
                  </div>
                  <div className="w-16 h-20 rounded shadow-lg overflow-hidden flex-shrink-0 z-10">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Suwl3oLT7qvJotYsgs8UVsc0EGQB1T-QWJA2qk8enB2GTzMWcPFAjhs-qlUp4m4P3UPWNZrJNuzOuGAfbKi6Mwj-qvMjFuAonzOlHDfgUe1LOKRQCqLmTELk7SmrPRKpgWKWsQs3W7fQD2b3tvVcVS57Djlq-37bQVBbBc49nEAR9Ghvthql-kofCcyJ9Ly7IbwrwvcwHf9NazkUF4Pp1Lsi2vBHc4V6LobYPjT5MujRum854gIkkZPJJMTylfvsbQSTt9xBuBlh"
                    />
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h6 className="font-bold text-sm truncate uppercase">The Void Beyond</h6>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      26 Mar, 2024 • In Theatre
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-600">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "\'FILL\' 1" }}
                      >
                        local_fire_department
                      </span>
                      <span className="text-[10px] font-black uppercase">4.5K Interested</span>
                    </div>
                  </div>
                </div>
                {/*  Rank 2  */}
                <div className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all relative">
                  <div className="text-5xl font-black text-stroke-3 italic absolute -left-4 -top-2 opacity-30 select-none">
                    2
                  </div>
                  <div className="w-16 h-20 rounded shadow-lg overflow-hidden flex-shrink-0 z-10">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzOcrQ_t6CHKAm2cEdXqTWXQrV6VTbIf6US5P6LkqghnFVIDEm823fDnt-aQ-QhOW7e1ct7Ek62OUHVXuyJi8GcHpbj-SJ2z8-zvDGJItpsgM5PlP9nvh3BphCZQ0H6OkzK1So2485Dz9BF7gkLPrkuPdOSfkyh3_tdOr6-Bu7V9q7CdCUpz1eBjCRBTpUAwKLHAwzQCynLZbeaVU37aohKRjdRVD7VNNxOcevMlbfFnr5gzu_sL8dI8Wlb_sZ8k0j63AaOJB2O1y5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h6 className="font-bold text-sm truncate uppercase">Midnight Shadow</h6>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      12 Apr, 2024 • New Season
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-600/70">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "\'FILL\' 1" }}
                      >
                        local_fire_department
                      </span>
                      <span className="text-[10px] font-black uppercase">3.2K Interested</span>
                    </div>
                  </div>
                </div>
                {/*  Rank 3  */}
                <div className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all relative">
                  <div className="text-5xl font-black text-stroke-3 italic absolute -left-4 -top-2 opacity-30 select-none">
                    3
                  </div>
                  <div className="w-16 h-20 rounded shadow-lg overflow-hidden flex-shrink-0 z-10">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvaJpz5XgDtaEIhUBWAGVjR_1yzW0t_wZeoMWHSU6Utxcfgn3jjQb9TISeWLHJFeqim98Rv1jLarlbnRa00MhfSE-MlaNoI9eLoE9YVznLRbTi8NXklm5Qw1RCFzjtq9hP5YYRj_IUlagPi_sgchW_6DgdIKSXmJy7XOmZWm64tD7K376hAerWXUCGxj9DGCQJUSL_AwnzAzW7CeWxZW9shWGo0nvNKhwZPuZfOlr6kk9Wt53AknPGKOKMcQbseB5A3GCNkyPuSziB"
                    />
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h6 className="font-bold text-sm truncate uppercase">Velvet Echoes</h6>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      18 Apr, 2024 • In Theatre
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-600/50">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "\'FILL\' 1" }}
                      >
                        local_fire_department
                      </span>
                      <span className="text-[10px] font-black uppercase">1.8K Interested</span>
                    </div>
                  </div>
                </div>
                {/*  Rank 4 & 5...  */}
                <div className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all relative">
                  <div className="text-5xl font-black text-stroke-3 italic absolute -left-4 -top-2 opacity-30 select-none">
                    4
                  </div>
                  <div className="w-16 h-20 rounded shadow-lg overflow-hidden flex-shrink-0 z-10">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnBXj3LXPrXq_tUOrn1iI5shZWT9F2_iAXgIvh4pio1DlrS36s3ze_8KM-DCrOrIqYqtolczUTpfc5CBvI7G7tGBsYYGcpj0pFuiFRWUz2jLZH-hD4TscR6m7vPakLAdvE8grcoU_hN8FH1aib7_toXGdDJ-OxBfFPxb3dAtNQoitjyCkCv9iN9l_UFfXEMCAU596n6ftRbhlg0UwSo7Cig9Z9SW8VP-ZOYS7JzcX4v3U088OP7yunk8hVBYRpOUOjv6DmWAQYLNqh"
                    />
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h6 className="font-bold text-sm truncate uppercase">Neon Pulse</h6>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      20 May, 2024 • Streaming
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-600/40">
                      <span
                        className="material-symbols-outlined text-xs"
                        style={{ fontVariationSettings: "\'FILL\' 1" }}
                      >
                        local_fire_department
                      </span>
                      <span className="text-[10px] font-black uppercase">980 Interested</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/*  Recommendation Banner  */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-orange-900 p-8 space-y-4 shadow-xl shadow-amber-600/10">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase px-2 py-1 bg-white/20 rounded">
                AI PICK
              </span>
              <h4 className="font-headline text-xl font-extrabold text-white leading-tight">
                Find your next obsession.
              </h4>
              <p className="text-sm text-white/70">
                Our engine suggests movies based on your emotional mood.
              </p>
              <button className="w-full py-3 bg-white text-amber-700 font-bold text-xs tracking-widest uppercase rounded-lg shadow-lg hover:scale-[1.02] transition-transform">
                Start Journey
              </button>
            </div>
            {/*  Your Clubs section remains from original  */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h6 className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase opacity-40">
                  Your Clubs
                </h6>
                <span className="material-symbols-outlined text-sm text-outline cursor-pointer hover:text-white">
                  add_circle
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      alt="Vibrant concert stage"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO30-0XTj3i4S3YHTo3EsLJJVSyyJqvJ8ql4BQEtVZAht4v7mRWl1o3a0r9EBxPS4qBLPN6gUCjvf3alBircnubJqtOQ9umfKv9UzK6zDNpjfyfWkFDs5gzVXyMkTlrZCIzEuS8IWwL60w25Pv8La06DHB1z6i0XeblTVQkZbEu6y48ZPCRDAbtnc5YtHs2jh48A2yCAmOHDisRa_S5G0v7oFZi0KZdieE31s6Ai8KfWiUAOAAdF2NKODfhZT0EaEHnMQK9QGqfQxP"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-amber-600 transition-colors">
                      Cinephiles Elite
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                      24 New Reviews
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
      {/*  Footer from COMPONENTS_8  */}
      <footer className="w-full py-16 mt-32 bg-zinc-950 border-t border-white/5 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-8 mb-4">
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
        <p className="font-inter text-[9px] tracking-widest uppercase opacity-40">
          © 2024 CINENOVA. THE DIGITAL AUTEUR EXPERIENCE.
        </p>
      </footer>
    </>
  )
}
