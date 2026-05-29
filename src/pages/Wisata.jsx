import { useState } from "react";
import { 
    FaSearch, FaPlus, FaMapMarkedAlt, FaSuitcase, 
    FaTags, FaRegClock, FaGlobeAmericas
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
// PERBAIKAN 1: Hapus tanda < > pada import
import Wisatadata from "../Data/Wisatadata.json"; 

export default function Wisata() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // PERBAIKAN 2: Gunakan Wisatadata (dari JSON), bukan Wisata (nama fungsi)
    const filteredData = Wisatadata.filter((item) => {
        const matchSearch = 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        
        return matchSearch && matchStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Available": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
            case "Scheduled": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
            case "Full": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
            default: return "bg-white/10 text-white/50 border-white/10";
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader title="Kelola Paket Wisata" breadcrumb={["Dashboard", "Paket Wisata"]}>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/40 transition-all active:scale-95">
                    <FaPlus /> <span>Buat Paket Baru</span>
                </button>
            </PageHeader>

            <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border-t border-l border-white/10 relative overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between gap-4 bg-white/5">
                    <div className="relative w-full max-w-md group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari paket, destinasi, atau ID..."
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select 
                        className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All" className="bg-gray-950">Semua Status</option>
                        <option value="Available" className="bg-gray-950">Available</option>
                        <option value="Full" className="bg-gray-950">Full</option>
                        <option value="Scheduled" className="bg-gray-950">Scheduled</option>
                    </select>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Paket & Destinasi</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Detail Tour</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Harga</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Kapasitas</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="py-5 px-8">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 bg-blue-500/20 text-blue-400 p-2.5 rounded-xl border border-blue-500/20 shadow-inner">
                                                <FaGlobeAmericas />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{item.title}</p>
                                                <p className="flex items-center gap-1 text-[11px] font-bold text-white/30 mt-1 uppercase tracking-wider">
                                                    <FaMapMarkedAlt className="text-[9px]" /> {item.destination}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm text-white/80 font-bold"><FaTags className="text-white/20 text-xs" /> {item.category}</span>
                                            <span className="flex items-center gap-2 text-xs text-white/40 font-medium"><FaRegClock className="text-white/20" /> {item.duration}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 font-black text-white">{formatRupiah(item.price)}</td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className={`h-full transition-all duration-700 ${item.booked >= item.quota ? 'bg-rose-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(item.booked / item.quota) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase">{item.booked}/{item.quota}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg border tracking-widest uppercase ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Count */}
                <div className="p-6 border-t border-white/5 text-xs text-white/40 font-bold uppercase tracking-wider bg-white/[0.02]">
                    Total: <span className="text-white">{filteredData.length}</span> Paket Ditemukan
                </div>
            </div>
        </div>
    );
}