import { useNavigate } from 'react-router-dom'
import AuthenticatedNavbar from '../components/AuthenticatedNavbar'
import AuthenticatedSidebar from '../components/AuthenticatedSidebar'
import { useState } from 'react'

export default function CommunitiesClubs() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <AuthenticatedNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <AuthenticatedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex">
        {/*  Main Content Area  */}
        <main className="flex-1 px-6 sm:px-10 lg:px-16 pt-24 pb-12 min-h-screen">
          <div className="max-w-[1600px] mx-auto">
            {/*  Header & Filter Bar  */}
            <div className="flex justify-between items-end mb-16">
              <div>
                <h1 className="text-6xl font-headline font-extrabold tracking-tighter mb-4">
                  Discover Clubs
                </h1>
                <p className="text-on-surface-variant text-lg max-w-lg">
                  Find your tribe. Join specialized cinema communities curated for the true digital
                  auteur.
                </p>
              </div>
              {/*  Browse By Trigger (Modal logic placeholder)  */}
              <div className="relative group">
                <button className="bg-surface-container-highest px-6 py-3 rounded-md flex items-center gap-3 hover:bg-zinc-800 transition-colors">
                  <span className="text-sm font-label uppercase tracking-widest font-bold">
                    Browse By
                  </span>
                  <span className="material-symbols-outlined text-amber-600">
                    keyboard_arrow_down
                  </span>
                </button>
                {/*  Popover  */}
                <div className="absolute right-0 mt-4 w-64 bg-zinc-900/95 backdrop-blur-2xl p-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 shadow-2xl">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
                        Categories
                      </h4>
                      <ul className="space-y-3 text-sm">
                        <li className="hover:text-amber-600 transition-colors cursor-pointer">
                          Genre
                        </li>
                        <li className="hover:text-amber-600 transition-colors cursor-pointer">
                          Country
                        </li>
                        <li className="hover:text-amber-600 transition-colors cursor-pointer">
                          Language
                        </li>
                        <li className="hover:text-amber-600 transition-colors cursor-pointer">
                          Anime
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  Clubs Grid  */}
            <div className="asymmetric-grid">
              {/*  Club Card 1  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Cinematic wide shot of football stadium"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs4qJDzYoq24w_KzTq88TV8zB5n7NcE1oi1ms74b1aw1OGO8Y-zeGI6vSBHdFMpgMWUd49eCt34WNYZRsogpyZhxfVoV2AEM3qTYcqtG7FwZqcZ8h2wNhs-HxeWI3EDPPFHvQBRRfhWUqdoorhwV-dMg2vlxQecZ_M6M1nn-WvWJrIFpI4zx8p5Mm2lbpt6TPvHG4QGvlcxHAGGzC27-7FveGH_ES9_ToTg8u9Ib_6gAV9yrPIfMpZbqD9-3eo-K7AYqEFD8fdEh0W"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Trending
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">Football</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    Analyzing the cinematic beauty of the pitch, documentaries, and the drama of the
                    game.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      12.4k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
              {/*  Club Card 2  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl mt-8">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Black and white film reel and projector"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjgozjqFdUYVlaS9eGpomeH7SzMA9kkb9dHJJZ5sAY55egRd1HZeMt8krdnz8igQhrPuRVWVPrCI_8W9mC-aJp9HYp1NsM39VSqcWXPbs-o1ZrxENT9wVEMUf86dHJk1I0EDBT3RRSXjEAcikMrhn51SVmfnay_204OAic3gAMypbnaTaoB5hJGqSno4ypnC38eRCPaIV4iw_Azt3t7m_i5AgdokwdVCBqwWjjpfamLKS9dFTOj6HceC5ZLpmonyScFw6OGmHBKeSc"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">World Cinema</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    Exploring masterpieces from every corner of the globe. Subtitles are not a
                    barrier.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      8.9k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
              {/*  Club Card 3  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Neon lights reflecting on a rainy city street"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdDieuopODE7axr7XjBOOkeehAFgMdR0x-AEMBbKKqpRftxYfDfxSgGva_ZneBDk_syJsoNzo5D6EzShTmJl1UcSrw3fgnszBlYV7svs6OF1n4lvbsI8WT-7mY44u--CLCk99dMdI8CPoBht0FMHL8lDf4r8M8MtPr2oYNQhGMT1r6AFtkWUQGDh_kc2o6gHvHTzwFlayD2ooIzfBmmqKvsYeyw5kmrrgVYzl8QOn5XMdT0kgXdXLNqRectJ0Pupgz2UIK8HpcsceK"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Hot
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">K-Drama</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    From Seoul to the world. Discussing the emotional depth and style of Korean
                    television.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      25.1k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
              {/*  Club Card 4  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl mt-12">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="A professional cinema camera on a dolly"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpwWDAHuxnPiXQKBSU5Vxjw6YsUDM0pNTp0mgRlRvdpBapuZPgfrCGLtxm_0Sc6-OH_DqIiB7G1VGv1Pvx6zkDY4wIs_SkvL95UjIk07EnqqjyRL346VstBP_3CqRyrb-XaDK0IFu8YDQu4D2hjzVkNbnLWd5eD-zC_Kk61TVFHsQr0Xcxu69eTPYtuLlP6Hkw6Cin_6pbrg8SjLpXFO_xfNBqu2vmAbmQ4SSp-BNm_3Nlto2zO6qX_M-foPtE1BTjGD8NpOelBaxU"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">Film-Making</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    Technical discussions on lenses, lighting, and the art of the cut. For creators.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      5.2k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
              {/*  Club Card 5  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Anime style illustration of clouds"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7mvI8Ns3LNu6yPz-saTWmNMtTb8rgTSbGKcAP0M1-TnPWs-dPgJ9sgugEtLY_jeDcgknnE4gZ4siw_1TPz6-EguYJiZ2XERBjljhxDqBynJK6qtsQvvTL4LUOqiUKv7Gn1N-nTXrDgoOsx1N761aaBnYZ41wZkrbPKgLw07NHlzfviwa0QdfpnLCjfJitgrGA7UlQKgPckTK_skzvbG678SJYZIunok3QJsHJIwohAk3i_r1GMHVCsoTqYB1YPox19WN7LIL4rbJ_"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">Anime Collective</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    Celebrating the artistry and narrative of Japanese animation from classic to
                    contemporary.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      30.7k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
              {/*  Club Card 6  */}
              <div className="flex flex-col group bg-surface-container-low overflow-hidden rounded-xl mt-4">
                <div className="h-48 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Shadowy figure in a moody noir hallway"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnLZdaTcWlOFV95SgWQ0IFt1bwLGdir0pELaanRT3VUyTxC_JIMOA3a89Na7KMIh3t5dSaKKF4t-QxfE2-sN4vbHxfFOmyclGESLKpVJ4oTdkqf-IYezgkgXfVDiZOc1eGH4FuXr5-X5sBDZqwKpu3j2j89OspnT3RtI5BqDJfbJLsx0IpWTCFx6jbFjG8Tum0b4kOUwLKBSrfq3yicDtHYywguUVYk5UkwrlgsHPbjAzAob2Jc-DstjwtgDEZp1pw7tAkgVALjpLn"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-headline font-bold mb-2">Noir Society</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                    Dark streets, cynical detectives, and the femme fatale. A haven for crime noir
                    fans.
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-[10px] font-label uppercase tracking-widest text-zinc-500">
                      4.1k Members
                    </span>
                    <button className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-6 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/*  Footer  */}
      <footer className="relative w-full py-16 px-12 mt-auto bg-zinc-950 flex flex-col items-center justify-center border-t border-zinc-900/50">
        <div className="text-lg font-black text-amber-600 mb-4 tracking-tighter uppercase font-headline">CineNova</div>
        <div className="flex gap-8 mb-8">
          <a
            className="font-body text-xs tracking-wide uppercase text-zinc-600 hover:text-amber-300 transition-opacity opacity-80 hover:opacity-100"
            href="#"
          >
            Legal
          </a>
          <a
            className="font-body text-xs tracking-wide uppercase text-zinc-600 hover:text-amber-300 transition-opacity opacity-80 hover:opacity-100"
            href="#"
          >
            Privacy
          </a>
          <a
            className="font-body text-xs tracking-wide uppercase text-zinc-600 hover:text-amber-300 transition-opacity opacity-80 hover:opacity-100"
            href="#"
          >
            Press
          </a>
          <a
            className="font-body text-xs tracking-wide uppercase text-zinc-600 hover:text-amber-300 transition-opacity opacity-80 hover:opacity-100"
            href="#"
          >
            Careers
          </a>
        </div>
        <p className="text-zinc-600 font-body text-[10px] tracking-[0.2em] uppercase">
          © 2024 CineNova. Cinematic Immersion.
        </p>
      </footer>
    </>
  )
}
