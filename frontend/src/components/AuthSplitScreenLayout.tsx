import { ReactNode } from 'react';
import Footer from './Footer'

interface AuthSplitScreenLayoutProps {
  children: ReactNode;
}

export default function AuthSplitScreenLayout({ children }: AuthSplitScreenLayoutProps) {
  return (
    <>
      
      {/*  Style block for marquee animations  */}
      <style>{`
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>
      
      {/*  Main Content Canvas  */}
      <main className="min-h-screen flex bg-zinc-950 overflow-hidden relative">
        {/* Left Side: Animated Posters Canvas */}
        <div className="hidden lg:flex w-[55%] relative h-screen items-center justify-center overflow-hidden bg-zinc-950 py-4 gap-4 px-8 pt-24">
           {/* Gradient Overlays for smooth blending */}
           <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none"></div>
           
           {/* Columns */}
           {[
             { dir: 'up', dur: '45s', delay: '0s' },
             { dir: 'down', dur: '55s', delay: '-10s' },
             { dir: 'up', dur: '35s', delay: '-20s' },
             { dir: 'down', dur: '65s', delay: '-5s' },
             { dir: 'up', dur: '50s', delay: '-15s' }
           ].map((col, colIndex) => {
             const authPosters = [
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QlsUUHXjNpeEYZnWlcPwwT1.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                "https://image.tmdb.org/t/p/w600_and_h900_bestv2/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
             ];
             // Shuffle slightly per column so they look random
             const shuffled = [...authPosters].sort(() => 0.5 - Math.random());
             const duplicated = [...shuffled, ...shuffled, ...shuffled];
             
             return (
               <div key={colIndex} className="flex-1 h-[200vh] relative -mt-[50vh] opacity-80">
                  <div 
                    className="flex flex-col gap-4 w-full absolute top-0"
                    style={{
                      animation: `marquee-${col.dir} ${col.dur} linear infinite`,
                      animationDelay: col.delay
                    }}
                  >
                    {duplicated.map((src, i) => (
                       <img key={i} src={src} className="w-full rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] object-cover aspect-[2/3] bg-zinc-800" alt="poster" />
                    ))}
                  </div>
               </div>
             )
           })}
        </div>

        {/* Right Side: Auth Container */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 md:px-12 relative z-20 bg-zinc-950 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] pt-20 pb-20 overflow-y-auto">
          <div className="w-full max-w-md">
            {children}
            
            {/*  Contextual Metadata / Brand Quote  */}
            <div className="mt-8 text-center opacity-30 px-12">
              <p className="font-headline italic text-xs leading-relaxed text-zinc-400">
                "Every great film should seem new every time you see it." — Robert Bresson
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
