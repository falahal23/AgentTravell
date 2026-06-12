import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaClock, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import aktivitasData from "../Data/AktivitasUser.json";

export default function DetailAktivitas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detail = aktivitasData.find((item) => item.id_customer === id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 space-y-4">
        <div className="p-6 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-slate-400 mb-2">Data Aktivitas Tidak Ditemukan</h2>
          <p className="text-slate-500 mb-4">ID: {id}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Kembali ke Aktivitas User
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  const getStatusInfo = (loginTime) => {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const daysDiff = (now - loginDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 1) {
      return { status: "🟢 Aktif Hari Ini", color: "from-green-600 to-green-700", badge: "bg-green-50 text-green-600 border-green-200" };
    } else if (daysDiff < 7) {
      return { status: "🟡 Aktif (Seminggu)", color: "from-blue-600 to-blue-700", badge: "bg-blue-50 text-blue-600 border-blue-200" };
    } else {
      return { status: "🔴 Tidak Aktif", color: "from-orange-600 to-orange-700", badge: "bg-orange-50 text-orange-600 border-orange-200" };
    }
  };

  const statusInfo = getStatusInfo(detail.login_terakhir);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Aktivitas User
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-50">
          
          {/* BANNER */}
          <div className={`h-40 bg-gradient-to-r ${statusInfo.color} w-full relative`}>
            <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-3xl shadow-lg">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-5xl font-black">
                👤
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="pt-20 p-8 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                  Detail Aktivitas User
                </h1>
                <p className="text-slate-400 font-bold tracking-widest text-sm uppercase mt-2">
                  ID: {detail.id_customer}
                </p>
              </div>
              <span className={`px-6 py-3 rounded-2xl border font-black text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm ${statusInfo.badge}`}>
                {statusInfo.status}
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* MAIN INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ID Customer */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaUser className="w-4 h-4 text-blue-600" />
                  ID Customer
                </div>
                <p className="text-lg font-bold text-slate-800 font-mono">{detail.id_customer}</p>
              </div>

              {/* Login Terakhir (Date Only) */}
              <div className="space-y-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <FaCalendarAlt className="w-4 h-4 text-blue-600" />
                  Tanggal Login
                </div>
                <p className="text-lg font-bold text-slate-800">{formatDate(detail.login_terakhir)}</p>
              </div>

            </div>

            {/* LOGIN DETAIL SECTION */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              
              {/* Login Terakhir (Full DateTime) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaClock className="w-4 h-4 text-blue-600" />
                  Login Terakhir (Detail)
                </div>
                <p className="text-base font-semibold text-slate-800">{formatDateTime(detail.login_terakhir)}</p>
              </div>

              <hr className="border-blue-200" />

              {/* Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider">
                  <FaCheckCircle className="w-4 h-4 text-blue-600" />
                  Status Aktivitas
                </div>
                <p className="text-lg font-bold text-slate-800">{statusInfo.status}</p>
              </div>

            </div>

            {/* ACTIVITY STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="text-xs text-green-600 font-black uppercase tracking-wider">Verifikasi</p>
                <p className="text-xl font-bold text-green-600 mt-1">✓ Terbukti</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-xs text-blue-600 font-black uppercase tracking-wider">Akses</p>
                <p className="text-xl font-bold text-blue-600 mt-1">✓ Aktif</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-600 font-black uppercase tracking-wider">Device</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">📱 Mobile</p>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider">Ringkasan Aktivitas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Tipe Login</span>
                  <span className="text-slate-800 font-bold">Web & Mobile</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">IP Address</span>
                  <span className="text-slate-800 font-bold font-mono">192.168.1.x</span>
                </div>
                <div className="flex justify-between items-center pt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <span className="text-blue-700 font-bold">Lokasi</span>
                  <span className="text-lg font-black text-blue-600">Jakarta, ID</span>
                </div>
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
