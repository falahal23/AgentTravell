import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div 
            className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4 md:p-8"
            style={{ 
                // Gunakan image pantai yang ada di gambar
                backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073')` 
            }}
        >
            {/* Overlay untuk memperhalus transisi (opsional) */}
            <div className="absolute inset-0 bg-black/10 backdrop-brightness-95 pointer-events-none"></div>

            {/* Container Kaca Utama (The Outer Frame) */}
            <div className="relative z-10 w-full max-w-6xl min-h-[85vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col p-6 md:p-10">
                
                {/* Bagian Navigasi Atas (Sesuai gambar) */}
                <header className="flex justify-between items-center mb-12">
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-emerald-500/30 text-white rounded-full font-bold backdrop-blur-md border border-white/10 text-sm">Home</button>
                        <button className="px-6 py-2 text-white/80 font-bold text-sm hover:text-white transition-colors">About</button>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 text-white font-bold text-sm">Log in</button>
                        <button className="px-6 py-2 border border-white/30 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all">Contact us</button>
                    </div>
                </header>

                {/* Konten Utama (Outlet akan merender isi Login/Sign-up) */}
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* Copyright yang menyatu dengan tema */}
                <footer className="mt-8 text-center">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                        © 2026 TravelGo Admin Dashboard. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );

}