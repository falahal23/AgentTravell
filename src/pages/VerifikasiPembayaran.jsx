import { useState } from "react";
import { 
    FaSearch, FaCheck, FaTimes, FaEye, 
    FaCreditCard, FaCalendarAlt, FaUserCircle, FaReceipt 
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import PembayaranData from "../Data/PembayaranData.json";

export default function VerifikasiPembayaran() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredPayments = PembayaranData.filter((item) => {
        const matchSearch = 
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        
        return matchSearch && matchStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "Verified": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
            case "Pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
            case "Rejected": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
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
            <PageHeader title="Verifikasi Pembayaran" breadcrumb={["Dashboard", "Payments"]} />

            <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border-t border-l border-white/10 relative overflow-hidden">
                
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between gap-4 bg-white/5">
                    <div className="relative w-full max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            type="text"
                            placeholder="Cari ID transaksi atau nama..."
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select 
                        className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All" className="bg-gray-900">Semua Status</option>
                        <option value="Pending" className="bg-gray-900">Pending</option>
                        <option value="Verified" className="bg-gray-900">Verified</option>
                        <option value="Rejected" className="bg-gray-900">Rejected</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">ID & Pelanggan</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Nominal & Metode</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Bukti Transfer</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Waktu</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPayments.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <FaUserCircle className="text-white/20 text-2xl" />
                                            <div>
                                                <p className="text-sm font-black text-white">{item.customerName}</p>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase">{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <p className="text-sm font-black text-emerald-400">{formatRupiah(item.amount)}</p>
                                        <p className="text-[10px] text-white/40 flex items-center gap-1">
                                            <FaCreditCard className="text-[8px]" /> {item.method}
                                        </p>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="relative group w-12 h-12 bg-white/5 rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all">
                                            <img src={item.proof} alt="Receipt" className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40">
                                                <FaEye className="text-white text-xs" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <p className="text-[11px] text-white/50 flex items-center gap-2 font-medium">
                                            <FaCalendarAlt className="text-[9px]" /> {item.date}
                                        </p>
                                    </td>
                                    <td className="py-5 px-8">
                                        {item.status === "Pending" ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button title="Verify" className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90 border border-emerald-500/20">
                                                    <FaCheck className="text-xs" />
                                                </button>
                                                <button title="Reject" className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 border border-rose-500/20">
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 text-[9px] font-black rounded-lg border tracking-widest uppercase ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                    <FaReceipt className="text-xs" /> Secure Payment Verification System
                </div>
            </div>
        </div>
    );
}