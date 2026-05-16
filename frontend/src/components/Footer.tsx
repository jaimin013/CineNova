export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full py-16 bg-zinc-950 border-t border-white/5 flex flex-col items-center justify-center gap-4">
      <div className="text-lg font-black text-amber-600 mb-2 font-headline uppercase tracking-tighter">
        CineNova
      </div>
      <div className="flex gap-8 mb-6 font-body text-xs tracking-wide uppercase text-zinc-600">
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
      <p className="text-zinc-600 font-body text-[10px] tracking-[0.2em] uppercase">
        Copyright {year} CineNova. Cinematic Immersion.
      </p>
    </footer>
  )
}
