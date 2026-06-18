import { useState } from "react";
import { 
    FaFileDownload, FaSearch, FaPrint, FaRegFileAlt, 
    FaArrowUp, FaWallet, FaCheckDouble, FaHistory 
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import LaporanData from "../Data/LaporanData.json";

export default function LaporanTransaksi() {
    const [searchTerm, setSearchTerm] = useState("");

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const filteredLaporan = LaporanData.filter(item =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHeader title="Laporan Transaksi" breadcrumb={["Dashboard", "Laporan"]}>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                    <FaFileDownload /> <span>Export Excel</span>
                </button>
            </PageHeader>

            {/* Stats Summary Area */}
            <div className="!hidden grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><FaWallet /></div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">+12.5%</span>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Total Pendapatan</p>
                    <h2 className="text-2xl font-black text-white mt-1">{formatRupiah(24500000)}</h2>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400"><FaCheckDouble /></div>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Transaksi Sukses</p>
                    <h2 className="text-2xl font-black text-white mt-1">48 <span className="text-sm text-white/20 font-medium">Orders</span></h2>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400"><FaHistory /></div>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Rata-rata Transaksi</p>
                    <h2 className="text-2xl font-black text-white mt-1">{formatRupiah(5100000)}</h2>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                    <div className="relative w-full max-w-md group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari ID atau nama pelanggan..."
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="text-white/40 hover:text-white transition-colors p-3 bg-white/5 rounded-xl border border-white/5">
                        <FaPrint />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Waktu & ID</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Pelanggan</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Paket Wisata</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Nominal</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-widest">Metode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLaporan.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-8">
                                        <p className="text-xs text-white/60 font-bold">{item.date}</p>
                                        <p className="text-[10px] text-blue-400/50 font-black uppercase tracking-tighter">{item.id}</p>
                                    </td>
                                    <td className="py-5 px-8 text-sm font-black text-white">{item.customer}</td>
                                    <td className="py-5 px-8">
                                        <span className="text-xs text-white/50 group-hover:text-white transition-colors">{item.package}</span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-sm font-black text-emerald-400">{formatRupiah(item.amount)}</span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="text-[10px] font-black text-white/40 bg-white/5 px-3 py-1 rounded-md border border-white/5 uppercase">
                                            {item.method}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
