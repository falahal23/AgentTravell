import { useState } from "react";
import { 
    FaPlus, FaEdit, FaTrashAlt, FaFolderOpen, 
    FaGem, FaMountain, FaHeart, FaGlobe, FaSearch, FaEllipsisV
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import KategoriPaketData from "../Data/KategoriPaket.json"; // Nama file data baru

export default function KategoriPaket() { // Nama fungsi baru
    const [searchTerm, setSearchTerm] = useState("");

    const iconMap = {
        FaGem: <FaGem className="text-pink-400" />,
        FaMountain: <FaMountain className="text-emerald-400" />,
        FaHeart: <FaHeart className="text-rose-400" />,
        FaGlobe: <FaGlobe className="text-blue-400" />
    };

    const filteredKategori = KategoriPaketData.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader title="Kategori Paket" breadcrumb={["Dashboard", "Kategori Paket"]}>
                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                    <FaPlus /> <span>Tambah Kategori</span>
                </button>
            </PageHeader>

            {/* Filter */}
            <div className="max-w-md relative group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Cari kategori..."
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all backdrop-blur-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredKategori.map((item) => (
                    <div key={item.id} className="group relative bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-2xl shadow-inner">
                                {iconMap[item.icon] || <FaFolderOpen className="text-gray-400" />}
                            </div>
                            <button className="text-white/20 hover:text-white p-2 transition-colors">
                                <FaEllipsisV />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                {item.name}
                            </h3>
                            <p className="text-xs text-white/40 leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Paket Terhubung</p>
                                <p className="text-xl font-black text-white">{item.totalPackages}</p>
                            </div>
                            <div className="flex gap-2">
                                <button title="Edit" className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                                    <FaEdit className="text-xs" />
                                </button>
                                <button title="Hapus" className="p-3 bg-white/5 text-rose-400/60 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                    <FaTrashAlt className="text-xs" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}