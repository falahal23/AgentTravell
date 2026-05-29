import { Link } from "react-router-dom";
import { FaHome, FaSync } from "react-icons/fa";

export default function ErrorPage({ errorCode = "404", message = "Halaman tidak ditemukan" }) {
  
  const validImageCodes = ["400", "401", "404"];
  const imagePath = validImageCodes.includes(errorCode) 
    ? `/images/${errorCode}.png` 
    : `/images/404.png`;

  const getErrorMessage = (code) => {
    switch (code) {
      case "400": return "Bad Request. Permintaan tidak dapat diproses.";
      case "401": return "Unauthorized. Anda tidak memiliki akses.";
      case "500": return "Server Error. Terjadi kesalahan internal.";
      case "4001": return "System Timeout. Koneksi terputus.";
      default: return message;
    }
  };

  // 🔥 PERBAIKAN: bg-black/20 membuat hitamnya lebih transparan
  const glossyGlassClass = "bg-black/20 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 p-10 flex flex-col items-center max-w-lg w-full mx-4 relative overflow-hidden";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffebeb00] text-white font-sans">
      
      {/* Background Glow Decor - Sekarang lebih terlihat karena kontainer lebih transparan */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className={`${glossyGlassClass}`}>
        
        {/* IMAGE AREA */}
        <div className="relative w-full aspect-video mb-8 group overflow-hidden">
            <img 
                src={imagePath} 
                alt={`Error ${errorCode}`} 
                className="w-full h-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105" 
                onError={(e) => { e.target.src = "/images/404.png"; }} 
            />
            
            <div className="absolute top-0 right-0 bg-red-500/10 backdrop-blur-md px-3 py-1 rounded-bl-xl border-b border-l border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 opacity-70">System Alert</span>
            </div>
        </div>

        {/* ERROR CODE */}
        {/* <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-transparent">
          {errorCode}
        </h1> */}

        {/* MESSAGE */}
        <div className="mt-4 text-center">
          <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Error Detected</p>
          <h2 className="text-xl font-bold text-white/90 leading-tight">
            {getErrorMessage(errorCode)}
          </h2>
          <p className="mt-3 text-white/40 text-sm max-w-xs mx-auto leading-relaxed italic">
            "Sepertinya ada gangguan pada koordinat sistem."
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-10 w-full">
            <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl transition-all active:scale-95 group"
            >
                <FaHome className="text-indigo-400 text-sm" />
                <span className="text-sm">Dashboard</span>
            </Link>

            <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
            >
                <FaSync className="text-xs group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-sm">Retry</span>
            </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 flex items-center gap-3 opacity-20">
        <div className="h-px w-8 bg-white/20"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">
          Internal Security Protocol
        </span>
        <div className="h-px w-8 bg-white/20"></div>
      </div>

    </div>
  );
}