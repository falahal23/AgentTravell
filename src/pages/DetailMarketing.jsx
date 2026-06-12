import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaChartBar, FaTag, FaCheckCircle, FaTrophy } from "react-icons/fa";
import marketingData from "../Data/Marketing.json";

export default function DetailMarketing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = marketingData.find((item) => item.id_customer === id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 space-y-4">
        <div className="p-6 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-2">Data Marketing Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-4">ID: {id}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Kembali ke Marketing
          </button>
        </div>
      </div>
    );
  }

  const getSourceIcon = (sumber) => {
    switch(sumber) {
      case "Marketplace": return "🛒";
      case "YouTube": return "📺";
      case "Google Search": return "🔍";
      case "Instagram": return "📸";
      case "Facebook": return "f";
      case "TikTok": return "🎵";
      default: return "📊";
    }
  };

  const getSourceColor = (sumber) => {
    switch(sumber) {
      case "Marketplace": return "from-blue-600 to-blue-700";
      case "YouTube": return "from-red-600 to-red-700";
      case "Google Search": return "from-green-600 to-green-700";
      case "Instagram": return "from-pink-600 to-pink-700";
      case "Facebook": return "from-indigo-600 to-indigo-700";
      case "TikTok": return "from-purple-600 to-purple-700";
      default: return "from-slate-600 to-slate-700";
    }
  };

  const getPromoColor = (status) => {
    switch(status) {
      case "Promo Aktif": return "from-green-600 to-green-700";
      case "Promo Member": return "from-blue-600 to-blue-700";
      case "Promo Kedaluwarsa": return "from-orange-600 to-orange-700";
      default: return "from-slate-600 to-slate-700";
    }
  };

  const getPromoIcon = (status) => {
    switch(status) {
      case "Promo Aktif": return "🎉";
      case "Promo Member": return "👑";
      case "Promo Kedaluwarsa": return "⏰";
      default: return "📊";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Marketing
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
          
          {/* BANNER */}
          <div className={`h-40 bg-gradient-to-r ${getSourceColor(detail.sumber_user)} w-full relative`}>
            <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-5xl">
                {getSourceIcon(detail.sumber_user)}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-20 p-8 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                  Detail Marketing & Engagement
                </h1>
                <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mt-2">
                  ID: {detail.id_customer}
                </p>
              </div>
              <span className="px-6 py-3 rounded-2xl border border-green-200 bg-green-50 text-green-600 font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm">
                <FaCheckCircle /> Terdaftar
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* MAIN INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ID Customer */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaUser className="w-4 h-4 text-blue-600" />
                  ID Customer
                </div>
                <p className="text-lg font-bold text-slate-800 font-mono">{detail.id_customer}</p>
              </div>

              {/* Sumber User */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaChartBar className="w-4 h-4 text-blue-600" />
                  Sumber User
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSourceIcon(detail.sumber_user)}</span>
                  <p className="text-lg font-bold text-slate-800">{detail.sumber_user}</p>
                </div>
              </div>

            </div>

            {/* PROMO SECTION */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              
              {/* Status Promo */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaTag className="w-4 h-4 text-blue-600" />
                  Status Promo
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                  <span className="text-3xl">{getPromoIcon(detail.status_promo)}</span>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Promo Saat Ini</p>
                    <p className="text-lg font-bold text-slate-800">{detail.status_promo}</p>
                  </div>
                </div>
              </div>

              <hr className="border-blue-200" />

              {/* Promo Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaTrophy className="w-4 h-4 text-blue-600" />
                  Benefit & Keuntungan
                </div>
                <ul className="space-y-2 text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    Diskon hingga 50% untuk pembelian
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    Free shipping untuk order minimal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    Poin reward ekstra
                  </li>
                </ul>
              </div>

            </div>

            {/* CHANNEL PERFORMANCE */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider">Performa Channel</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Total Click</span>
                  <span className="text-slate-800 font-bold">2,459</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Conversion Rate</span>
                  <span className="text-slate-800 font-bold">12.5%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Engagement Score</span>
                  <span className="text-slate-800 font-bold">9.2/10</span>
                </div>
                <div className="flex justify-between items-center pt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <span className="text-blue-700 font-bold">ROI</span>
                  <span className="text-lg font-black text-blue-600">+245%</span>
                </div>
              </div>
            </div>

            {/* STATUS BADGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="text-xs text-green-600 font-black uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-green-600 mt-1">✓ Aktif</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-black uppercase tracking-wider">Verifikasi</p>
                <p className="text-xl font-bold text-blue-600 mt-1">✓ Email</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-600 font-black uppercase tracking-wider">Preferensi</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">📩 Push</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <p className="text-xs text-purple-600 font-black uppercase tracking-wider">Engagement</p>
                <p className="text-xl font-bold text-purple-600 mt-1">⭐ High</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
              >
                ← Kembali
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(detail.id_customer);
                  alert("ID Customer berhasil disalin!");
                }}
                className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Salin ID Customer
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
