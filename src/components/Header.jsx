import { FaRegBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
    const [search, setSearch] = useState("");

    return (
        <header className="flex justify-between items-center px-8 py-5 bg-[#F8FAFC]">
            
            {/* 🔥 BAGIAN KIRI: Title & Search Bar */}
            <div className="flex items-center gap-8 flex-1">
                <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
                
                <div className="relative w-full max-w-sm">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#EBF0FA] text-sm text-slate-700 rounded-full pl-11 pr-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-blue-100 placeholder-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* 🔥 BAGIAN KANAN: Notification & Profile */}
            <div className="flex items-center gap-6">
                
                {/* Notification Icon */}
                <button className="relative p-2 text-slate-600 hover:text-slate-800 transition-colors">
                    <FaRegBell className="text-[22px]" />
                    {/* Red dot badge */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-bold text-slate-800 leading-tight">Farzana Akhi</span>
                        <span className="text-[10px] font-bold text-slate-400">Admin</span>
                    </div>
                    <img
                        src="/images/foto.png" 
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-100"
                    />
                </div>
                
            </div>
        </header>
    );
}