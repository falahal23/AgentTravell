import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";   // 🛠️ PERBAIKAN: Huruf S besar agar tidak crash
import Header from "../components/Header";     // 🛠️ PERBAIKAN: Sekarang akan dipasang
import RightPanel from "../components/RightPanel";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <div className="flex h-screen w-full bg-[#F8FAFC] font-sans antialiased text-slate-800 overflow-hidden">
            
            {/* 1. SIDEBAR (Kiri) - Lebar tetap */}
            <aside className="w-64 hidden lg:block bg-white border-r border-slate-100 flex-shrink-0 h-full">
                <Sidebar />
            </aside>

            {/* 2. AREA KANAN (Header + Konten Utama + Right Panel) */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* 🛠️ PERBAIKAN: Memasang Header di posisi paling atas */}
                <Header />

                {/* AREA BAWAH HEADER: Dibagi menjadi Dashboard Tengah & Panel Kalender Kanan */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* MAIN UTAMA (Outlet / Halaman Dashboard) */}
                    <main className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC]">
                        {/* 🛠️ PERBAIKAN: Menghapus container bg-white raksasa agar kartu-kartu dashboard terpisah rapi seperti di gambar */}
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <Outlet />
                        </div>
                    </main>

                    {/* 3. RIGHT PANEL (Kanan) - Kalender, Upcoming Trips & Social Media */}
                    <aside className="w-80 hidden xl:block p-6 border-l border-slate-100 bg-[#F8FAFC] overflow-y-auto h-full">
                        <RightPanel />
                    </aside>

                </div>
            </div>
            
        </div>
    );
}