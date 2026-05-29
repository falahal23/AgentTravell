export default function Loading() {
    return (

        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden font-sans">
            {/* Background Decorative - Menyamakan vibe dashboard */}
            <div className="absolute inset-0 bg-[#f8fafc] z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Loader Container */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                    {/* Ring Luar (Rotating Gradient) */}
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    
                    {/* Ring Tengah (Pulse Effect) */}
                    <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full animate-ping"></div>
                    
                    {/* Icon atau Dot di Tengah */}
                    <div className="relative bg-white p-3 rounded-2xl shadow-xl border border-blue-50">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>

                {/* Text Loading dengan Efek Shimmer */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter animate-pulse">
                        PREPARING TRIP
                    </h2>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
                    </div>
                </div>
                
                <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
                    Please wait a moment
                </p>
            </div>
        </div>
    );
}

