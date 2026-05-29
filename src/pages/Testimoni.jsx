import { useState } from "react";
import { 
    FaStar, FaTrashAlt, FaCheckCircle, FaEyeSlash, 
    FaQuoteLeft, FaSearch, FaUserCircle 
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import TestimoniData from "../Data/TestimoniData.json";

export default function Testimoni() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTestimoni = TestimoniData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.review.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "text-amber-400" : "text-white/10"} />
        ));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Published": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "Pending": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "Hidden": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            default: return "text-white/40 bg-white/5 border-white/10";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader title="Kelola Testimoni" breadcrumb={["Dashboard", "Testimoni"]} />

            {/* Filter Search */}
            <div className="max-w-md relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                    type="text"
                    placeholder="Cari ulasan atau nama pelanggan..."
                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTestimoni.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl relative flex flex-col justify-between group hover:bg-white/10 transition-all">
                        
                        <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <FaQuoteLeft className="text-4xl text-blue-400" />
                        </div>

                        <div>
                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {renderStars(item.rating)}
                            </div>

                            {/* Review Text */}
                            <p className="text-white/70 text-sm leading-relaxed italic mb-6">
                                "{item.review}"
                            </p>

                            {/* User Profile */}
                            <div className="flex items-center gap-4 mb-6">
                                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border-2 border-blue-500/30" />
                                <div>
                                    <h4 className="text-sm font-black text-white">{item.name}</h4>
                                    <p className="text-[10px] text-white/30 uppercase font-bold">{item.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Card: Status & Actions */}
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                {item.status}
                            </span>

                            <div className="flex gap-2">
                                <button title="Approve" className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                    <FaCheckCircle className="text-xs" />
                                </button>
                                <button title="Hide" className="p-2.5 bg-white/5 text-white/40 rounded-xl hover:bg-black hover:text-white transition-all">
                                    <FaEyeSlash className="text-xs" />
                                </button>
                                <button title="Delete" className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
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