import frameworkData from "./framework.json";

export default function FrameworkList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-slate-900 p-6 md:p-10 selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header Gaming Style */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-wider drop-shadow-lg">
            FRAMEWORKS VAULT
          </h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">
            Select your engine • Build your universe
          </p>
        </div>

        {/* Grid Layout Responsif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworkData.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] hover:-translate-y-1 flex flex-col"
            >
              {/* Tombol Menu (Kebab) */}
              <button 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                aria-label="Options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                  <circle cx="5" cy="12" r="1.5" />
                </svg>
              </button>

              {/* Tag / Rarity Indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  FRAMEWORK
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>

              {/* Konten Utama */}
              <h2 className="text-xl font-bold text-white mb-2 drop-shadow-sm group-hover:text-purple-300 transition-colors">
                {item.name}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                {item.description}
              </p>

              {/* Stat Block ala Game */}
              <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Developer</span>
                  <span className="font-semibold text-cyan-300 drop-shadow-sm">{item.details.developer}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Release Year</span>
                  <span className="font-semibold text-purple-300 drop-shadow-sm">{item.details.releaseYear}</span>
                </div>
              </div>

              {/* Efek Glow Akcent di pojok */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}