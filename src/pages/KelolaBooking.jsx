import { useState } from "react";
import { 
    FaSearch, FaFilter, FaUserAlt, FaTicketAlt, 
    FaCheckCircle, FaClock, FaTimesCircle, FaFileInvoiceDollar 
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import BookingData from "../Data/BookingData.json";

export default function KelolaBooking() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredBooking = BookingData.filter((item) => {
        const matchSearch = 
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.packageName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "All" || item.status === statusFilter;
        
        return matchSearch && matchStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "Confirmed": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
            case "Pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
            case "Cancelled": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
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
            <PageHeader title="Kelola Booking" breadcrumb={["Dashboard", "Kelola Booking"]} />

            <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border-t border-l border-white/10 relative overflow-hidden">
                
                {/* Search & Filter */}
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between gap-4 bg-white/5">
                    <div className="relative w-full max-w-md group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama pelanggan atau ID booking..."
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <FaFilter className="text-white/30 text-xs" />
                        <select 
                            className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All" className="bg-gray-950">Semua Status</option>
                            <option value="Confirmed" className="bg-gray-950">Confirmed</option>
                            <option value="Pending" className="bg-gray-950">Pending</option>
                            <option value="Cancelled" className="bg-gray-950">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pelanggan & ID</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Paket & Pax</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Tagihan</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Tanggal Booking</th>
                                <th className="py-5 px-8 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredBooking.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-lg">
                                                <FaUserAlt className="text-white text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{item.customerName}</p>
                                                <p className="text-[10px] text-white/30 font-bold tracking-tighter uppercase">{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm text-white/80 font-bold italic underline decoration-blue-500/50">
                                                <FaTicketAlt className="text-blue-400 text-[10px]" /> {item.packageName}
                                            </span>
                                            <span className="text-[11px] text-white/40 font-medium tracking-wide">{item.pax} Orang (Pax)</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                            <FaFileInvoiceDollar className="text-emerald-400/50" />
                                            <span className="text-sm font-black text-white">{formatRupiah(item.totalPrice)}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-xs font-bold text-white/50">{item.bookingDate}</td>
                                    <td className="py-5 px-8">
                                        <span className={`flex items-center justify-center gap-2 px-3 py-1.5 text-[10px] font-black rounded-lg border tracking-widest uppercase ${getStatusStyle(item.status)}`}>
                                            {item.status === "Confirmed" && <FaCheckCircle />}
                                            {item.status === "Pending" && <FaClock />}
                                            {item.status === "Cancelled" && <FaTimesCircle />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 bg-white/[0.02] border-t border-white/5 text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
                    End of Booking List — TravelGo System
                </div>
            </div>
        </div>
    );
}